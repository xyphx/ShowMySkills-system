import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'applied',
        'reviewing',
        'shortlisted',
        'interview_scheduled',
        'interviewing',
        'rejected',
        'hired',
        'accepted',
      ],
      default: 'applied',
    },
    candidateSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      college: { type: String, default: '' },
      department: { type: String, default: '' },
      score: { type: Number, default: 85 },
      avatar: { type: String, default: null },
      skills: { type: [String], default: [] },
      portfolioUrl: { type: String, default: '' },
      resumeUrl: { type: String, default: '' },
    },
    notes: {
      type: String,
      default: '',
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ internship: 1, student: 1 }, { unique: true });
applicationSchema.index({ company: 1, status: 1 });

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
