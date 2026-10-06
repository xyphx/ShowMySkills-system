import { Router } from 'express';
import { authController } from '../controllers/authController.js';
//import { validateAuth } from '../validators/authValidator.js';
import {
  validateLogin, validateRegister} from '../validators/authValidator.js';
  import multer from 'multer';
 const upload = multer({
  dest: 'uploads/college-ids/',
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed'));
    }
  }
});
const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user & retrieve token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing credentials
 */
router.post('/login', validateLogin, authController.login);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  '/register',
  upload.single('collegeIdFile'),
  validateRegister,
  authController.register
);
router.post('/verify-email', authController.verifyEmail);
export default router;
