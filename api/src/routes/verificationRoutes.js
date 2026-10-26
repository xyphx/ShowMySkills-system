import { Router } from 'express';
import { verificationController } from '../controllers/verificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { submissionRateLimiter } from '../middleware/security.js';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/verifications/submit:
 *   post:
 *     summary: Submit ID document or credentials for verification audit
 *     description: Submit student university enrollment verification or company credentials for admin review and badge issuance.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: 'College ID Document'
 *               institution:
 *                 type: string
 *                 example: 'National Institute of Technology'
 *               department:
 *                 type: string
 *                 example: 'Computer Science & Engineering'
 *               docName:
 *                 type: string
 *                 example: 'College_ID_Card.pdf'
 *               docUrl:
 *                 type: string
 *                 example: 'http://localhost:5000/uploads/college-ids/student-id.pdf'
 *               notes:
 *                 type: string
 *                 example: 'Uploaded official college student ID card.'
 *     responses:
 *       201:
 *         description: Verification request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Verification request submitted for admin review.' }
 *                 data: { $ref: '#/components/schemas/VerificationRequest' }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.post('/submit', submissionRateLimiter, verificationController.submit);

/**
 * @openapi
 * /api/verifications/my-status:
 *   get:
 *     summary: Get current student/company verification milestones & documents
 *     description: Returns verification status checklist (Email Verification, Phone Verification, College ID Verification) and submitted request audit logs.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Verification
 *     responses:
 *       200:
 *         description: Verification milestones retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title: { type: string, example: 'College ID Verification' }
 *                           description: { type: string }
 *                           status: { type: string, enum: [Pending, 'In Review', Completed], example: 'Completed' }
 *                     requests:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/VerificationRequest' }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/my-status', verificationController.getMyStatus);

export default router;
