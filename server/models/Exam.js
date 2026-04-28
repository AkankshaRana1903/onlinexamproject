import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['mcq', 'subjective'],
    required: [true, 'Question type is required']
  },
  options: {
    type: [String],
    required: function() {
      return this.type === 'mcq';
    }
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: function() {
      return this.type === 'mcq';
    }
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1']
  }
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.startDate < value; // Ensures endDate is after startDate
      },
      message: 'End date must be after start date'
    }
  },
  questions: [{
    text: { type: String, required: true },
    type: { type: String, enum: ['mcq'], default: 'mcq' },
    options: [{ type: String }],
    correctAnswer: { type: String },
    marks: { type: Number, default: 1 }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Virtual for calculating if exam is currently available
examSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate && this.isActive;
});

// Add index for efficient querying
examSchema.index({ startDate: 1, endDate: 1, isActive: 1 });
examSchema.index({ createdBy: 1 });
examSchema.index({ category: 1 });

const Exam = mongoose.model('Exam', examSchema);

export default Exam;