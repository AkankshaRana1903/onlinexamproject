import express from 'express';
import { body } from 'express-validator';
import { 
  startExamAttempt, 
  submitExamAttempt, 
  getUserAttempts, 
  getAttempt,
  getExamAttempts,
  gradeSubjectiveAnswers
} from '../controllers/attemptController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Start exam attempt
router.post('/start/:examId', protect, startExamAttempt);

// Submit exam attempt
router.post(
  '/submit/:attemptId',
  [
    protect,
    body('answers').isArray().withMessage('Answers must be an array'),
    body('tabSwitchCount').optional().isNumeric().withMessage('Tab switch count must be a number'),
    body('suspiciousActivityLogs').optional().isArray().withMessage('Suspicious activity logs must be an array')
  ],
  submitExamAttempt
);

// Get user's exam attempts
router.get('/my', protect, getUserAttempts);

// Get single attempt
router.get('/:id', protect, getAttempt);

// Get attempts for an exam (admin/examiner only)
router.get('/exam/:examId', protect, authorize('admin', 'examiner'), getExamAttempts);

// Grade subjective answers (admin/examiner only)
router.post(
  '/grade/:attemptId',
  [
    protect,
    authorize('admin', 'examiner'),
    body('grades').isArray().withMessage('Grades must be an array'),
    body('grades.*.answerId').not().isEmpty().withMessage('Answer ID is required'),
    body('grades.*.isCorrect').isBoolean().withMessage('isCorrect must be a boolean'),
    body('grades.*.marksAwarded').isNumeric().withMessage('Marks awarded must be a number'),
    body('grades.*.feedback').optional().isString().withMessage('Feedback must be a string')
  ],
  gradeSubjectiveAnswers
);

router.get('/exam/all', protect, authorize('admin'), async (req, res) => {
  try {
    const attempts = await ExamAttempt.find()
      .populate('userId', 'name')
      .populate('examId', 'title')
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
});

export default router;