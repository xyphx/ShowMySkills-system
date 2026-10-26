import { Router } from 'express';
import { applicationController } from '../controllers/applicationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { submissionRateLimiter } from '../middleware/security.js';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/applications/apply:
 *   post:
 *     summary: Submit an application to an internship opening
 *     description: Candidate applies to an active internship posting. Automatically captures candidate profile snapshot (reputation score, skills, resume).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Applications & ATS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - internshipId
 *             properties:
 *               internshipId:
 *                 type: string
 *                 description: MongoDB ObjectId of target internship opening
 *                 example: '67bb8e7d206f4a38b9c1d010'
 *               notes:
 *                 type: string
 *                 description: Optional applicant cover note or pitch
 *                 example: 'I have hands-on experience building full stack apps with React and Node.js.'
 *     responses:
 *       201:
 *         description: Application submitted successfully
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
 *                   example: 'Application submitted successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Missing required internshipId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Target internship posting not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict - Application already submitted for this opening
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/apply', submissionRateLimiter, applicationController.apply);

/**
 * @openapi
 * /api/applications/my-applications:
 *   get:
 *     summary: Retrieve current student's submitted applications
 *     description: Returns all internship applications submitted by the authenticated student with populated internship opening details.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Applications & ATS
 *     responses:
 *       200:
 *         description: List of submitted applications
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
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/my-applications', applicationController.getMyApplications);

/**
 * @openapi
 * /api/applications/company-applications:
 *   get:
 *     summary: Retrieve candidate applications for recruiter ATS pipeline
 *     description: Recruiter and company view of applicant pipeline. Supports filtering by application status, candidate name or skill keywords, and role title.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Applications & ATS
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, applied, reviewing, shortlisted, interview_scheduled, interviewing, rejected, hired, accepted]
 *         description: Filter candidates by ATS pipeline stage
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search candidate name, college, or skills
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by internship role title
 *     responses:
 *       200:
 *         description: Filtered candidate applications for company openings
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
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/company-applications', applicationController.getCompanyApplications);

/**
 * @openapi
 * /api/applications/{id}/status:
 *   put:
 *     summary: Update candidate hiring stage (Shortlisted, Interviewing, Hired, etc.)
 *     description: Update an applicant's ATS workflow stage, recruiter notes, and optional scheduled interview date.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Applications & ATS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the application
 *         example: '67bb8e7d206f4a38b9c1d020'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, reviewing, shortlisted, interview_scheduled, interviewing, rejected, hired, accepted]
 *                 example: 'shortlisted'
 *               notes:
 *                 type: string
 *                 example: 'Selected for round 1 technical interview.'
 *               interviewDate:
 *                 type: string
 *                 format: date-time
 *                 example: '2026-11-01T10:00:00Z'
 *     responses:
 *       200:
 *         description: Candidate status updated successfully
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
 *                   example: 'Candidate status updated to shortlisted'
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id/status', applicationController.updateStatus);

export default router;
