import mongoose from 'mongoose';

const skillSubmissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillAssessment',
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    certificateToken: {
      type: String,
      default: () => `SMS-CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

skillSubmissionSchema.index({ student: 1, assessment: 1 });

export const SkillSubmission =
  mongoose.models.SkillSubmission || mongoose.model('SkillSubmission', skillSubmissionSchema);
export default SkillSubmission;
