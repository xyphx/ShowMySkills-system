import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { adminApplicationController } from '../controllers/adminApplicationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authRateLimiter, otpRateLimiter } from '../middleware/security.js';

const uploadDir = 'uploads/admin-photos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `admin-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP image files are allowed for photos'));
    }
  },
});

// Middleware to ensure caller is an authorized core admin
const requireCoreAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Core admin privileges required',
    });
  }
  next();
};

const router = Router();

/**
 * @openapi
 * /api/admin-applications/send-applicant-otp:
 *   post:
 *     summary: Send OTP to applicant email for email verification
 *     description: Initiates admin verification step 1 by sending a 6-digit OTP code to the applicant email.
 *     tags:
 *       - Admin Application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'admin.candidate@university.edu'
 *     responses:
 *       200:
 *         description: OTP code dispatched to applicant email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Verification OTP sent to your email' }
 *       429:
 *         description: Too many verification attempts
 */
router.post(
  '/send-applicant-otp',
  otpRateLimiter,
  adminApplicationController.sendApplicantOtp
);

/**
 * @openapi
 * /api/admin-applications/verify-applicant-otp:
 *   post:
 *     summary: Verify OTP sent to applicant email
 *     description: Step 2 of admin verification — validates the 6-digit OTP and returns an authorization verification token.
 *     tags:
 *       - Admin Application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'admin.candidate@university.edu'
 *               otp:
 *                 type: string
 *                 example: '839201'
 *     responses:
 *       200:
 *         description: Applicant email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 verificationToken: { type: string, example: 'eyJhbGciOiJI...' }
 *       400:
 *         description: Invalid or expired OTP code
 */
router.post(
  '/verify-applicant-otp',
  otpRateLimiter,
  adminApplicationController.verifyApplicantOtp
);

/**
 * @openapi
 * /api/admin-applications/send-official-otp:
 *   post:
 *     summary: Send authorization code to fixed official ShowMySkills email address
 *     description: Step 3 of admin verification — sends an authorization security token to the secure platform organization mailbox.
 *     tags:
 *       - Admin Application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicantEmail
 *               - verificationToken
 *             properties:
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *                 example: 'admin.candidate@university.edu'
 *               verificationToken:
 *                 type: string
 *                 example: 'eyJhbGciOiJI...'
 *     responses:
 *       200:
 *         description: Official authorization code dispatched to secure platform administrators
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Official authorization code sent' }
 */
router.post(
  '/send-official-otp',
  otpRateLimiter,
  adminApplicationController.sendOfficialOtp
);

/**
 * @openapi
 * /api/admin-applications/submit:
 *   post:
 *     summary: Submit an application for admin access
 *     description: Final step — submits identity profile, photo proof, consent, and official OTP for executive review.
 *     tags:
 *       - Admin Application
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - officialOtp
 *               - photoConsent
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Morgan Vance'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'morgan.vance@university.edu'
 *               phone:
 *                 type: string
 *                 example: '+919876543210'
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: '2000-08-20'
 *               recommendedBy:
 *                 type: string
 *                 example: 'Lead Maintainer'
 *               notes:
 *                 type: string
 *                 example: 'Applying for campus Ambassador and event admin lead.'
 *               photoConsent:
 *                 type: boolean
 *                 example: true
 *               officialOtp:
 *                 type: string
 *                 example: '492015'
 *               verificationToken:
 *                 type: string
 *                 example: 'eyJhbGciOiJI...'
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo ID verification image (JPG, PNG, WebP)
 *     responses:
 *       201:
 *         description: Admin application submitted successfully for review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Admin application submitted successfully' }
 *       400:
 *         description: Validation failed (missing photo consent, invalid official OTP)
 */
router.post(
  '/submit',
  authRateLimiter,
  upload.single('photo'),
  adminApplicationController.submitApplication
);

/**
 * @openapi
 * /api/admin-applications:
 *   get:
 *     summary: List admin applications (Authorized Core Admins only)
 *     description: Retrieve all pending or reviewed admin access applications.
 *     tags:
 *       - Admin Application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, approved, rejected]
 *         description: Application status filter
 *     responses:
 *       200:
 *         description: List of admin applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { type: object }
 *       403:
 *         description: Forbidden - Core admin credentials required
 */
router.get(
  '/',
  authMiddleware,
  requireCoreAdmin,
  adminApplicationController.listApplications
);

/**
 * @openapi
 * /api/admin-applications/{id}/approve:
 *   post:
 *     summary: Approve an admin application and grant admin access (Authorized Core Admins only)
 *     description: Approves an applicant, elevates their account to admin, and sends confirmation credentials.
 *     tags:
 *       - Admin Application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin application MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Application approved and admin account provisioned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Application approved successfully' }
 *       404:
 *         description: Admin application not found
 */
router.post(
  '/:id/approve',
  authMiddleware,
  requireCoreAdmin,
  adminApplicationController.approveApplication
);

/**
 * @openapi
 * /api/admin-applications/{id}/reject:
 *   post:
 *     summary: Reject an admin application (Authorized Core Admins only)
 *     description: Rejects an admin application with optional feedback reason.
 *     tags:
 *       - Admin Application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin application MongoDB ObjectId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: 'Insufficient credentials or verification mismatch.'
 *     responses:
 *       200:
 *         description: Application rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Application rejected' }
 *       404:
 *         description: Admin application not found
 */
router.post(
  '/:id/reject',
  authMiddleware,
  requireCoreAdmin,
  adminApplicationController.rejectApplication
);

export default router;
