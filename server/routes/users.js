import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import ExamAttempt from '../models/ExamAttempt.js';
import Exam from '../models/Exam.js';

const router = express.Router();

// Routes will be implemented as needed
// In routes/users.js
// In routes/users.js
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let profileData = { user };
    console.log(user);
    
    switch (user.role) {
      case 'student':
        const studentAttempts = await ExamAttempt.find({ userId: user._id })
          .populate('examId', 'title totalMarks passingMarks')
          .sort({ endTime: -1 });
        profileData.attempts = studentAttempts;
        break;

      case 'examiner':
        const examinerExams = await Exam.find({ createdBy: user._id })
          .sort({ createdAt: -1 });
          console.log(examinerExams);
        profileData.createdExams = examinerExams;
        
        break;

      case 'admin':
        const allUsers = await User.find().select('-password');
        const allAttempts = await ExamAttempt.find()
          .populate('examId', 'title')
          .populate('userId', 'name email')
          .sort({ endTime: -1 });
        profileData = {
          ...profileData,
          allUsers,
          allAttempts,
          totalExams: await Exam.countDocuments(),
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
        });
    }

    res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

export default router;