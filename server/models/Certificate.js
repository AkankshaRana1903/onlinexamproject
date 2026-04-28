import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  examTitle: {
    type: String,
    required: [true, 'Exam title is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required']
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: [true, 'Issue date is required']
  },
  expiryDate: {
    type: Date
  },
  certificateNumber: {
    type: String,
    unique: true,
    required: [true, 'Certificate number is required']
  },
  verificationUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Generate a unique certificate number before saving
certificateSchema.pre('save', async function(next) {
  if (this.isNew) {
    const prefix = 'CERT';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.certificateNumber = `${prefix}-${timestamp}-${random}`;
    
    // Generate verification URL
    this.verificationUrl = `/verify-certificate/${this.certificateNumber}`;
  }
  next();
});

// Add indexes for efficient querying
certificateSchema.index({ userId: 1 });
certificateSchema.index({ certificateNumber: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;