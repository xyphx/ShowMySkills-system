import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
  },
  { _id: true }
);

const skillAssessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'UI/UX Design', 'AI & Machine Learning', 'Cloud & DevOps'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 20,
    },
    passingScore: {
      type: Number,
      default: 75,
    },
    reputationPoints: {
      type: Number,
      default: 15,
    },
    badgeName: {
      type: String,
      default: 'Verified Specialist',
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    totalTaken: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 82,
    },
  },
  {
    timestamps: true,
  }
);

export const SkillAssessment =
  mongoose.models.SkillAssessment || mongoose.model('SkillAssessment', skillAssessmentSchema);
export default SkillAssessment;
