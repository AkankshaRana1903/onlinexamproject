import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Question ID is required']
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Answer is required']
  },
  isCorrect: {
    type: Boolean,
    default: null
  },
  marksAwarded: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  }
});

const examAttemptSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now
  },
  endTime: {
    type: Date
  },
  answers: {
    type: [answerSchema],
    default: []
  },
  score: {
    type: Number
  },
  passed: {
    type: Boolean
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned', 'timed-out'],
    default: 'in-progress'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  tabSwitchCount: {
    type: Number,
    default: 0
  },
  suspiciousActivity: {
    type: Boolean,
    default: false
  },
  suspiciousActivityLogs: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
examAttemptSchema.index({ userId: 1, examId: 1 });
examAttemptSchema.index({ status: 1 });

const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);

export default ExamAttempt;