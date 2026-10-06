import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  college: {
    type: String,
    required: true,
    trim: true
  },

  graduationYear: {
    type: Number,
    required: true
  },

  collegeId: {
    type: String,
    required: true,
    trim: true
  },
  collegeIdDocument: {
  type: String,
  default: null
  },

  collegeIdVerified: {
  type: Boolean,
  default: false
  },
  collegeIdVerifiedAt: {
  type: Date,
  default: null
},

verificationExpiresAt: {
  type: Date,
  default: null
},
  emailVerified: {
  type: Boolean,
  default: false
},

  emailVerificationOtp: {
  type: String,
  default: null
},

  emailVerificationOtpExpires: {
  type: Date,
  default: null
},
  role: {
    type: String,
    default: 'student'
  }

}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);