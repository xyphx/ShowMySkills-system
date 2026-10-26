import mongoose from 'mongoose';

const adminApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    recommendedBy: {
      type: String,
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    photoConsent: {
      type: Boolean,
      required: true,
      default: false,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    officialOtpVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
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
    reviewNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const AdminApplication = mongoose.model(
  'AdminApplication',
  adminApplicationSchema
);
