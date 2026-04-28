import { validationResult } from 'express-validator';
import Exam from '../models/Exam.js';
import ExamAttempt from '../models/ExamAttempt.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';

// Start exam attempt
export const startExamAttempt = async (req, res) => {
  try {
    const { examId } = req.params;
    
    // Check if exam exists
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Check if exam is available
    const now = new Date();
    if (now < exam.startDate || now > exam.endDate || !exam.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Exam is not available'
      });
    }
    
    // Check if user has already attempted the exam
    const previousAttempts = await ExamAttempt.find({
      examId,
      userId: req.user.id,
      status: { $in: ['completed', 'timed-out'] }
    });
    
    // Check if user has passed the exam
    const hasPassed = previousAttempts.some(attempt => attempt.passed);
    
    if (hasPassed) {
      return res.status(400).json({
        success: false,
        message: 'You have already passed this exam'
      });
    }
    
    // Check if user has reached maximum retakes
    if (!exam.allowRetake) {
      if (previousAttempts.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Retakes are not allowed for this exam'
        });
      }
    } else if (exam.maxRetakes !== null && previousAttempts.length >= exam.maxRetakes) {
      return res.status(400).json({
        success: false,
        message: 'You have reached the maximum number of retakes'
      });
    }
    
    // Check if user has an in-progress attempt
    const inProgressAttempt = await ExamAttempt.findOne({
      examId,
      userId: req.user.id,
      status: 'in-progress'
    });
    
    if (inProgressAttempt) {
      // Check if the attempt is still valid (within duration)
      const attemptStartTime = new Date(inProgressAttempt.startTime);
      const expiryTime = new Date(attemptStartTime.getTime() + exam.duration * 60000);
      
      if (now < expiryTime) {
        return res.status(200).json({
          success: true,
          message: 'Continuing existing attempt',
          attempt: inProgressAttempt,
          timeRemaining: Math.floor((expiryTime - now) / 1000) // in seconds
        });
      } else {
        // Mark the attempt as timed-out
        inProgressAttempt.status = 'timed-out';
        inProgressAttempt.endTime = expiryTime;
        await inProgressAttempt.save();
      }
    }
    
    // Create new attempt
    const attempt = await ExamAttempt.create({
      examId,
      userId: req.user.id,
      startTime: now,
      status: 'in-progress',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(201).json({
      success: true,
      attempt,
      timeRemaining: exam.duration * 60 // in seconds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Submit exam attempt
export const submitExamAttempt = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  try {
    const { attemptId } = req.params;
    const { answers, tabSwitchCount, suspiciousActivityLogs } = req.body;
    
    // Find attempt
    const attempt = await ExamAttempt.findById(attemptId);
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }
    
    // Check if attempt belongs to user
    if (attempt.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this attempt'
      });
    }
    
    // Check if attempt is already completed
    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'This attempt is already completed'
      });
    }
    
    // Find exam
    const exam = await Exam.findById(attempt.examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Calculate end time
    const now = new Date();
    attempt.endTime = now;
    
    // Check if attempt is within time limit
    const attemptStartTime = new Date(attempt.startTime);
    const expiryTime = new Date(attemptStartTime.getTime() + exam.duration * 60000);
    
    if (now > expiryTime) {
      attempt.status = 'timed-out';
    } else {
      attempt.status = 'completed';
    }
    
    // Save answers
    attempt.answers = answers.map(answer => {
      const question = exam.questions.id(answer.questionId);
      
      if (!question) {
        return {
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect: false,
          marksAwarded: 0
        };
      }
      
      // For MCQs, check if answer is correct
      if (question.type === 'mcq') {
        const isCorrect = answer.answer === question.correctAnswer;
        return {
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect,
          marksAwarded: isCorrect ? question.marks : 0
        };
      }
      
      // For subjective questions, mark as pending evaluation
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect: null,
        marksAwarded: 0
      };
    });
    
    // Calculate score for MCQs
    let score = 0;
    attempt.answers.forEach(answer => {
      if (answer.isCorrect === true) {
        score += answer.marksAwarded;
      }
    });
    
    attempt.score = score;
    
    // Check if passed
    attempt.passed = score >= exam.passingMarks;
    
    // Save suspicious activity data
    attempt.tabSwitchCount = tabSwitchCount || 0;
    attempt.suspiciousActivity = (tabSwitchCount > 3) || (suspiciousActivityLogs && suspiciousActivityLogs.length > 0);
    
    if (suspiciousActivityLogs && suspiciousActivityLogs.length > 0) {
      attempt.suspiciousActivityLogs = suspiciousActivityLogs;
    }
    
    // If passed, create certificate
    if (attempt.passed) {
      const user = await User.findById(req.user.id);
      
      const certificate = await Certificate.create({
        userId: req.user.id,
        examId: exam._id,
        examTitle: exam.title,
        userName: user.name,
        score: Math.round((score / exam.totalMarks) * 100),
        issueDate: now,
        expiryDate: exam.certificateValidity ? new Date(now.getTime() + exam.certificateValidity * 24 * 60 * 60 * 1000) : null
      });
      
      attempt.certificateId = certificate._id;
    }
    
    await attempt.save();
    const user = await User.findById(req.user.id);
  
    // Calculate new stats
    const allAttempts = await ExamAttempt.find({ userId: req.user.id });
    const totalScore = allAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    
    user.examStats.totalAttempts = allAttempts.length;
    user.examStats.totalPassed = allAttempts.filter(a => a.passed).length;
    user.examStats.averageScore = totalScore / allAttempts.length || 0;
    user.examStats.totalCertificates = await Certificate.countDocuments({ userId: req.user.id });
    user.examStats.lastExamDate = attempt.endTime;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user's exam attempts
export const getUserAttempts = async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ userId: req.user.id })
      .populate('examId', 'title totalMarks passingMarks')
      .sort({ startTime: -1 });
    
    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single attempt
export const getAttempt = async (req, res) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.id)
      .populate('examId', 'title description totalMarks passingMarks questions')
      .populate('certificateId');
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }
    
    // Check if attempt belongs to user or user is admin/examiner
    if (
      attempt.userId.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'examiner'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this attempt'
      });
    }
    
    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get attempts for an exam (admin/examiner only)
export const getExamAttempts = async (req, res) => {
  try {
    const { examId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if exam exists
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Check if user is authorized to view attempts
    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view attempts for this exam'
      });
    }
    
    // Count total documents
    const total = await ExamAttempt.countDocuments({ examId });
    
    // Fetch attempts with pagination
    const attempts = await ExamAttempt.find({ examId })
      .populate('userId', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ startTime: -1 });
    
    res.status(200).json({
      success: true,
      count: attempts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      attempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Grade subjective answers (admin/examiner only)
export const gradeSubjectiveAnswers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  try {
    const { attemptId } = req.params;
    const { grades } = req.body;
    
    // Find attempt
    const attempt = await ExamAttempt.findById(attemptId);
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }
    
    // Find exam
    const exam = await Exam.findById(attempt.examId);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Check if user is authorized to grade
    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to grade this attempt'
      });
    }
    
    // Update grades
    let totalScore = 0;
    
    attempt.answers = attempt.answers.map(answer => {
      // Find the grade for this answer
      const grade = grades.find(g => g.answerId.toString() === answer._id.toString());
      
      // If this is a subjective answer being graded
      if (grade && answer.isCorrect === null) {
        answer.isCorrect = grade.isCorrect;
        answer.marksAwarded = grade.marksAwarded;
        answer.feedback = grade.feedback;
      }
      
      // Add to total score
      totalScore += answer.marksAwarded;
      
      return answer;
    });
    
    // Update total score
    attempt.score = totalScore;
    
    // Check if passed
    attempt.passed = totalScore >= exam.passingMarks;
    
    // If passed and no certificate yet, create certificate
    if (attempt.passed && !attempt.certificateId) {
      const user = await User.findById(attempt.userId);
      
      const certificate = await Certificate.create({
        userId: attempt.userId,
        examId: exam._id,
        examTitle: exam.title,
        userName: user.name,
        score: Math.round((totalScore / exam.totalMarks) * 100),
        issueDate: new Date(),
        expiryDate: exam.certificateValidity ? new Date(Date.now() + exam.certificateValidity * 24 * 60 * 60 * 1000) : null
      });
      
      attempt.certificateId = certificate._id;
    }
    
    await attempt.save();
    
    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};