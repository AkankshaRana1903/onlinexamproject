import express from 'express';
import { body } from 'express-validator';
import { 
  getExams, 
  getExam, 
  createExam, 
  updateExam, 
  deleteExam,
  getMyExams
} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all exams
router.get('/', getExams);

// Get single exam
router.get('/:id', getExam);

// Get exams created by current user
router.get('/my/exams', protect, getMyExams);

// Create exam (admin and examiner only)
router.post(
  '/',
  [
    protect,
    authorize('admin', 'examiner'),
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('totalMarks').isNumeric().withMessage('Total marks must be a number'),
    body('passingMarks').isNumeric().withMessage('Passing marks must be a number'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
  ],
  createExam
);

// Update exam (admin and examiner only)
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'examiner'),
    body('title').optional().not().isEmpty().withMessage('Title cannot be empty'),
    body('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
    body('duration').optional().isNumeric().withMessage('Duration must be a number'),
    body('totalMarks').optional().isNumeric().withMessage('Total marks must be a number'),
    body('passingMarks').optional().isNumeric().withMessage('Passing marks must be a number'),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    body('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required')
  ],
  updateExam
);

// Delete exam (admin and examiner only)
router.delete('/:id', protect, authorize('admin', 'examiner'), deleteExam);

export default router;