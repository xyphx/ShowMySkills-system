import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  updateInternshipAction,
  getMyInternshipActions,
} from '../controllers/internshipActionController.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/internship-actions/my-actions:
 *   get:
 *     summary: Retrieve current authenticated user's internship decisions and actions
 *     description: Returns all past interactions (accepted, rejected, saved, unsaved) performed by the candidate.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Internship Actions
 *     responses:
 *       200:
 *         description: Successfully retrieved list of candidate internship actions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '67bb8e7d206f4a38b9c1d099'
 *                       user:
 *                         type: string
 *                         example: '67bb8e7d206f4a38b9c1d001'
 *                       internship:
 *                         $ref: '#/components/schemas/Internship'
 *                       decision:
 *                         type: string
 *                         enum: [accepted, rejected]
 *                         example: 'accepted'
 *                       saved:
 *                         type: boolean
 *                         example: true
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - Valid JWT Bearer token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/my-actions', getMyInternshipActions);

/**
 * @openapi
 * /api/internship-actions/{id}/action:
 *   post:
 *     summary: Record swipe or interaction action for an internship opening
 *     description: Update decision state (accepted, rejected, saved, unsaved, skipped) for a specific active internship.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Internship Actions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the internship posting
 *         schema:
 *           type: string
 *           example: '67bb8e7d206f4a38b9c1d010'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accepted, rejected, saved, unsaved, skipped]
 *                 description: Decision action to record
 *                 example: 'accepted'
 *     responses:
 *       200:
 *         description: Action recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Internship action updated'
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid action or invalid internship ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Active internship not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/action', updateInternshipAction);

export default router;
