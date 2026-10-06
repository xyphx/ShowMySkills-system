import { generateOtp } from '../utils/otp.js';
import { emailService } from './emailService.js';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export const userService = {
  authenticate: async (email, password) => {
    return { id: "123", email, token: "jwt-token-example" };
  },

  createUser: async (userData) => {
    const {
      name,
      email,
      phone,
      password,
      college,
      graduationYear,
      collegeId,
      collegeIdDocument
    } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      college,
      graduationYear,
      collegeId,
      collegeIdDocument,
      emailVerificationOtp: otp,
      emailVerificationOtpExpires: otpExpiresAt
    });

    await emailService.sendVerificationOtp(email, otp);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationOtp;

    return userResponse;
  },

  verifyEmailOtp: async (email, otp) => {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (!user.emailVerificationOtp) {
      const error = new Error(
        'No OTP found. Please request a new OTP.'
      );
      error.statusCode = 400;
      throw error;
    }

    if (user.emailVerificationOtp !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    if (
      !user.emailVerificationOtpExpires ||
      user.emailVerificationOtpExpires < new Date()
    ) {
      const error = new Error('OTP has expired');
      error.statusCode = 400;
      throw error;
    }

    user.emailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }
};