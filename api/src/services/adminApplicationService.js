import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { AdminApplication } from '../models/AdminApplication.js';
import { OtpVerification } from '../models/OtpVerification.js';
import { User } from '../models/User.js';
import { emailService } from './emailService.js';

// Fixed destination on the server — never trust client-supplied destination
const GET_OFFICIAL_EMAIL = () =>
  process.env.OFFICIAL_ADMIN_EMAIL ||
  process.env.BREVO_SENDER_EMAIL ||
  'admin@showmyskills.com';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_COOLDOWN_MS = 60 * 1000; // 60 seconds between resends
const MAX_ATTEMPTS = 5;
const MAX_RESENDS_WINDOW = 5;
const RESEND_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const hashOtp = (otp) => {
  return crypto
    .createHash('sha256')
    .update(String(otp).trim())
    .digest('hex');
};

const generateSecureOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const adminApplicationService = {
  /**
   * Page 1: Send OTP to the applicant's email address
   */
  sendApplicantOtp: async (email) => {
    if (!email || !email.includes('@')) {
      const err = new Error('A valid email address is required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check existing OTP record
    const existing = await OtpVerification.findOne({
      target: normalizedEmail,
      type: 'applicant_email',
    });

    const now = new Date();

    if (existing) {
      // Cooldown check
      const elapsedSinceLastSend = now.getTime() - existing.lastSentAt.getTime();
      if (elapsedSinceLastSend < RATE_LIMIT_COOLDOWN_MS) {
        const remainingSec = Math.ceil(
          (RATE_LIMIT_COOLDOWN_MS - elapsedSinceLastSend) / 1000
        );
        const err = new Error(
          `Please wait ${remainingSec} seconds before requesting a new code.`
        );
        err.statusCode = 429;
        throw err;
      }

      // Resend limit window check
      const isWithinResendWindow =
        now.getTime() - existing.updatedAt.getTime() < RESEND_WINDOW_MS;
      if (isWithinResendWindow && existing.resendCount >= MAX_RESENDS_WINDOW) {
        const err = new Error(
          'Maximum resend attempts reached. Please try again after 15 minutes.'
        );
        err.statusCode = 429;
        throw err;
      }
    }

    const plainOtp = generateSecureOtp();
    const otpHash = hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await OtpVerification.findOneAndUpdate(
      { target: normalizedEmail, type: 'applicant_email' },
      {
        otpHash,
        expiresAt,
        attempts: 0,
        resendCount: existing ? existing.resendCount + 1 : 1,
        lastSentAt: now,
        verified: false,
        verifiedAt: null,
        used: false,
        verificationToken: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send email (plain OTP is never logged or returned)
    await emailService.sendVerificationOtp(normalizedEmail, plainOtp);

    return {
      success: true,
      message: 'Verification code sent to your email address.',
    };
  },

  /**
   * Page 1: Verify the applicant's email OTP
   */
  verifyApplicantOtp: async (email, otp) => {
    if (!email || !otp) {
      const err = new Error('Email and verification code are required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const record = await OtpVerification.findOne({
      target: normalizedEmail,
      type: 'applicant_email',
    });

    if (!record || record.used) {
      const err = new Error(
        'No active verification code found. Please request a new code.'
      );
      err.statusCode = 400;
      throw err;
    }

    if (record.expiresAt < new Date()) {
      const err = new Error(
        'Verification code has expired. Please request a new code.'
      );
      err.statusCode = 400;
      throw err;
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      record.expiresAt = new Date();
      await record.save();
      const err = new Error(
        'Too many failed attempts. Code has been invalidated. Please request a new code.'
      );
      err.statusCode = 429;
      throw err;
    }

    const incomingHash = hashOtp(otp);
    if (incomingHash !== record.otpHash) {
      record.attempts += 1;
      await record.save();
      const remaining = MAX_ATTEMPTS - record.attempts;
      const err = new Error(
        `Invalid verification code. ${remaining} attempt(s) remaining.`
      );
      err.statusCode = 400;
      throw err;
    }

    // Success: Generate verification proof token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    record.verified = true;
    record.verifiedAt = new Date();
    record.verificationToken = verificationToken;
    await record.save();

    return {
      success: true,
      message: 'Email verified successfully.',
      verificationToken,
    };
  },

  /**
   * Page 2: Send authorization code to the fixed official ShowMySkills email address
   */
  sendOfficialOtp: async (applicantEmail, verificationToken) => {
    if (!applicantEmail || !verificationToken) {
      const err = new Error(
        'Applicant email and verification token are required'
      );
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = String(applicantEmail).trim().toLowerCase();

    // Verify applicant has actually verified their email first
    const applicantRecord = await OtpVerification.findOne({
      target: normalizedEmail,
      type: 'applicant_email',
      verificationToken,
      verified: true,
      used: false,
    });

    if (!applicantRecord) {
      const err = new Error(
        'Applicant email must be verified before requesting official authorization.'
      );
      err.statusCode = 403;
      throw err;
    }

    const officialEmail = GET_OFFICIAL_EMAIL();
    const officialTargetKey = `official:${normalizedEmail}`;

    const existing = await OtpVerification.findOne({
      target: officialTargetKey,
      type: 'official_email',
    });

    const now = new Date();

    if (existing) {
      const elapsedSinceLastSend = now.getTime() - existing.lastSentAt.getTime();
      if (elapsedSinceLastSend < RATE_LIMIT_COOLDOWN_MS) {
        const remainingSec = Math.ceil(
          (RATE_LIMIT_COOLDOWN_MS - elapsedSinceLastSend) / 1000
        );
        const err = new Error(
          `Please wait ${remainingSec} seconds before requesting a new official code.`
        );
        err.statusCode = 429;
        throw err;
      }

      const isWithinResendWindow =
        now.getTime() - existing.updatedAt.getTime() < RESEND_WINDOW_MS;
      if (isWithinResendWindow && existing.resendCount >= MAX_RESENDS_WINDOW) {
        const err = new Error(
          'Maximum official OTP requests reached. Please wait 15 minutes.'
        );
        err.statusCode = 429;
        throw err;
      }
    }

    const plainOtp = generateSecureOtp();
    const otpHash = hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await OtpVerification.findOneAndUpdate(
      { target: officialTargetKey, type: 'official_email' },
      {
        otpHash,
        expiresAt,
        attempts: 0,
        resendCount: existing ? existing.resendCount + 1 : 1,
        lastSentAt: now,
        verified: false,
        verifiedAt: null,
        used: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send to fixed official email address (destination never client-controlled)
    await emailService.sendOfficialAdminOtp(
      officialEmail,
      plainOtp,
      normalizedEmail
    );

    return {
      success: true,
      message:
        'Official authorization code has been dispatched to the ShowMySkills administrator email.',
    };
  },

  /**
   * Page 2: Submit Admin Access Application
   */
  submitApplication: async ({
    name,
    email,
    phone,
    dob,
    recommendedBy,
    notes,
    photoConsent,
    officialOtp,
    verificationToken,
    photoFile,
  }) => {
    // 1. Validate required fields
    if (!name || !email || !phone || !dob || !recommendedBy) {
      const err = new Error(
        'Name, email, phone, date of birth, and recommender are required'
      );
      err.statusCode = 400;
      throw err;
    }

    // 1b. Validate date of birth is not in the future
    const parsedDob = new Date(dob);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    if (Number.isNaN(parsedDob.getTime())) {
      const err = new Error('Invalid date of birth format');
      err.statusCode = 400;
      throw err;
    }
    if (parsedDob > endOfToday) {
      const err = new Error('Date of birth cannot be in the future');
      err.statusCode = 400;
      throw err;
    }

    // 2. Validate photo upload and consent
    if (!photoFile) {
      const err = new Error(
        'Applicant photo is required for admin application review'
      );
      err.statusCode = 400;
      throw err;
    }

    const consentGiven =
      photoConsent === true ||
      photoConsent === 'true' ||
      photoConsent === 1 ||
      photoConsent === '1';

    if (!consentGiven) {
      const err = new Error(
        'Consent for public profile photo use is required before submitting an admin application'
      );
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 3. Verify applicant email verification token
    const applicantOtpRecord = await OtpVerification.findOne({
      target: normalizedEmail,
      type: 'applicant_email',
      verificationToken,
      verified: true,
      used: false,
    });

    if (!applicantOtpRecord) {
      const err = new Error(
        'Applicant email verification is invalid or expired. Please verify your email again.'
      );
      err.statusCode = 400;
      throw err;
    }

    // 4. Verify official OTP
    if (!officialOtp) {
      const err = new Error(
        'ShowMySkills official authorization code is required'
      );
      err.statusCode = 400;
      throw err;
    }

    const officialTargetKey = `official:${normalizedEmail}`;
    const officialOtpRecord = await OtpVerification.findOne({
      target: officialTargetKey,
      type: 'official_email',
      used: false,
    });

    if (!officialOtpRecord) {
      const err = new Error(
        'No active official authorization code found. Please request one.'
      );
      err.statusCode = 400;
      throw err;
    }

    if (officialOtpRecord.expiresAt < new Date()) {
      const err = new Error(
        'Official authorization code has expired. Please request a new code.'
      );
      err.statusCode = 400;
      throw err;
    }

    if (officialOtpRecord.attempts >= MAX_ATTEMPTS) {
      officialOtpRecord.expiresAt = new Date();
      await officialOtpRecord.save();
      const err = new Error(
        'Too many failed attempts on official authorization code. Code invalidated.'
      );
      err.statusCode = 429;
      throw err;
    }

    const incomingOfficialHash = hashOtp(officialOtp);
    if (incomingOfficialHash !== officialOtpRecord.otpHash) {
      officialOtpRecord.attempts += 1;
      await officialOtpRecord.save();
      const remaining = MAX_ATTEMPTS - officialOtpRecord.attempts;
      const err = new Error(
        `Invalid official authorization code. ${remaining} attempt(s) remaining.`
      );
      err.statusCode = 400;
      throw err;
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.role === 'admin') {
      const err = new Error(
        'An active administrator account with this email already exists.'
      );
      err.statusCode = 409;
      throw err;
    }

    // Check if an application is already pending
    const existingApplication = await AdminApplication.findOne({
      email: normalizedEmail,
      status: 'pending',
    });

    if (existingApplication) {
      const err = new Error(
        'An admin access application for this email is already pending review by core admins.'
      );
      err.statusCode = 409;
      throw err;
    }

    // 6. Mark OTPs as used (single-use enforcement)
    officialOtpRecord.used = true;
    officialOtpRecord.verified = true;
    await officialOtpRecord.save();

    applicantOtpRecord.used = true;
    await applicantOtpRecord.save();

    // 7. Store admin access request for review
    // Do NOT create an account or grant admin permissions at this stage.
    const photoUrl = photoFile.path.replace(/\\/g, '/');

    const application = await AdminApplication.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      dob: new Date(dob),
      recommendedBy: String(recommendedBy).trim(),
      photoUrl,
      photoConsent: true,
      notes: notes ? String(notes).trim() : '',
      emailVerified: true,
      officialOtpVerified: true,
      status: 'pending',
    });

    return {
      success: true,
      message:
        'Admin access application submitted successfully. Your application has been logged for review by an authorized core administrator.',
      applicationId: application._id.toString(),
    };
  },

  /**
   * Core Admin: List applications
   */
  listApplications: async (filter = {}) => {
    return AdminApplication.find(filter)
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email')
      .lean();
  },

  /**
   * Core Admin: Approve application and create/activate admin account
   */
  approveApplication: async (applicationId, coreAdminId) => {
    const application = await AdminApplication.findById(applicationId);
    if (!application) {
      const err = new Error('Application not found');
      err.statusCode = 404;
      throw err;
    }

    if (application.status !== 'pending') {
      const err = new Error(
        `Application is already marked as ${application.status}`
      );
      err.statusCode = 400;
      throw err;
    }

    if (!application.photoConsent) {
      const err = new Error(
        'Cannot approve application without verified applicant photo consent'
      );
      err.statusCode = 400;
      throw err;
    }

    // Check if user already exists
    let user = await User.findOne({ email: application.email });

    if (!user) {
      // Generate temporary random secure password
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await User.create({
        name: application.name,
        email: application.email,
        phone: application.phone,
        dob: application.dob,
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        profileIcon: application.photoUrl, // Public profile icon attached with consent
      });
    } else {
      user.role = 'admin';
      user.profileIcon = application.photoUrl;
      if (application.dob) user.dob = application.dob;
      await user.save();
    }

    application.status = 'approved';
    application.reviewedBy = coreAdminId;
    application.reviewedAt = new Date();
    await application.save();

    await emailService.sendApplicationApprovedEmail(
      application.email,
      application.name
    );

    return {
      success: true,
      message:
        'Admin access application approved. Admin account created and profile icon activated.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileIcon: user.profileIcon,
      },
    };
  },

  /**
   * Core Admin: Reject application
   */
  rejectApplication: async (applicationId, coreAdminId, reason = '') => {
    const application = await AdminApplication.findById(applicationId);
    if (!application) {
      const err = new Error('Application not found');
      err.statusCode = 404;
      throw err;
    }

    application.status = 'rejected';
    application.reviewedBy = coreAdminId;
    application.reviewedAt = new Date();
    application.reviewNotes = reason || 'Application declined by core admin';
    await application.save();

    return {
      success: true,
      message: 'Admin access application rejected.',
    };
  },
};
