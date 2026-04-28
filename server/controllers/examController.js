import { validationResult } from 'express-validator';
import Exam from '../models/Exam.js';
import ExamAttempt from '../models/ExamAttempt.js';

// Get all exams (with filtering)
export const getExams = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search by title or description if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Only show active exams for students
    if (req.user && req.user.role === 'student') {
      query.isActive = true;
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }
    
    // Count total documents
    const total = await Exam.countDocuments(query);
    
    // Fetch exams with pagination
    const exams = await Exam.find(query)
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: exams.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single exam
export const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name');
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // For students, don't send correct answers
    if (req.user && req.user.role === 'student') {
      const examWithoutAnswers = exam.toObject();
      
      // Remove correct answers from questions
      examWithoutAnswers.questions = examWithoutAnswers.questions.map(question => {
        const { correctAnswer, ...rest } = question;
        return rest;
      });
      
      return res.status(200).json({
        success: true,
        exam: examWithoutAnswers
      });
    }
    
    res.status(200).json({
      success: true,
      exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create exam
export const createExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  try {
    req.body.createdBy = req.user._id;
    console.log('Request body:', req.body);
    const exam = await Exam.create(req.body);
    console.log('Created exam:', exam);
    
    res.status(201).json({
      success: true,
      exam
    });
  } catch (error) {
    console.error('Error in createExam:', error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update exam
export const updateExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  try {
    let exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Check if user is authorized to update
    if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exam'
      });
    }
    
    // Check if exam has attempts
    const hasAttempts = await ExamAttempt.exists({ examId: exam._id });
    
    if (hasAttempts) {
      // If exam has attempts, only allow updating certain fields
      const allowedUpdates = ['title', 'description', 'endDate', 'isActive'];
      
      // Filter out fields that are not allowed to be updated
      Object.keys(req.body).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete req.body[key];
        }
      });
    }
    
    // Update exam
    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    // Check if user is authorized to delete
    if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exam'
      });
    }
    
    // Check if exam has attempts
    const hasAttempts = await ExamAttempt.exists({ examId: exam._id });
    
    if (hasAttempts) {
      // If exam has attempts, just mark it as inactive instead of deleting
      exam.isActive = false;
      await exam.save();
      
      return res.status(200).json({
        success: true,
        message: 'Exam marked as inactive',
        exam
      });
    }
    
    // Delete exam if no attempts
    await exam.remove();
    
    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get exams created by current user
export const getMyExams = async (req, res) => {
  console.log('getMyExams - req.user:', req.user); // Debug log

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  try {
    const { page = 1, limit = 10 } = req.query;

    const total = await Exam.countDocuments({ createdBy: req.user.id });
    const exams = await Exam.find({ createdBy: req.user.id })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      exams,
    });
  } catch (error) {
    console.error('getMyExams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};