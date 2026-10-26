import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'company', 'college'],
      required: true,
    },
    type: {
      type: String,
      enum: [
        'College ID Document',
        'Corporate Entity Verification',
        'Skill Assessment Proof',
        'Email Verification',
        'Phone Verification',
      ],
      required: true,
    },
    institution: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    docName: {
      type: String,
      default: '',
    },
    docUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

verificationRequestSchema.index({ user: 1, type: 1 });
verificationRequestSchema.index({ status: 1 });

export const VerificationRequest =
  mongoose.models.VerificationRequest ||
  mongoose.model('VerificationRequest', verificationRequestSchema);
export default VerificationRequest;
