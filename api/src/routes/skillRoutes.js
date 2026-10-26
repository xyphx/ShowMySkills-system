import { Router } from 'express';
import { skillController } from '../controllers/skillController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { submissionRateLimiter } from '../middleware/security.js';

const router = Router();

/**
 * @openapi
 * /api/skills:
 *   get:
 *     summary: Discover skill assessment benchmark challenges
 *     description: Browse official standardized competency tests across engineering disciplines.
 *     tags:
 *       - Skill Assessments
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Frontend, Backend, UI/UX Design, AI & Machine Learning, Cloud & DevOps]
 *         description: Technical domain category filter
 *     responses:
 *       200:
 *         description: List of skill benchmark challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SkillAssessment'
 */
router.get('/', skillController.list);

/**
 * @openapi
 * /api/skills/my-submissions:
 *   get:
 *     summary: Retrieve current student's passed skill tests and certificate tokens
 *     description: Returns assessment history, scores achieved, and earned badge tokens.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Skill Assessments
 *     responses:
 *       200:
 *         description: List of student submissions and scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { type: object }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/my-submissions', authMiddleware, skillController.mySubmissions);

/**
 * @openapi
 * /api/skills/{id}:
 *   get:
 *     summary: Retrieve assessment questions for test-taking
 *     description: Returns assessment challenge instructions, timer, and randomized question list.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Skill Assessments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill assessment MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d040'
 *     responses:
 *       200:
 *         description: Assessment question paper retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/SkillAssessment' }
 *       404:
 *         description: Assessment not found
 */
router.get('/:id', authMiddleware, skillController.getForTaking);

/**
 * @openapi
 * /api/skills/{id}/submit:
 *   post:
 *     summary: Submit completed test answers, auto-grade, and award verified badge
 *     description: Evaluates submitted answers against answer keys, computes score percentage, and automatically updates the candidate's verified skill endorsements.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Skill Assessments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill assessment MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d040'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: object
 *                 description: Map of question IDs to selected option indices
 *                 example: { "q1": 0, "q2": 2, "q3": 1 }
 *     responses:
 *       201:
 *         description: Submission graded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Congratulations! You passed the assessment.' }
 *                 data:
 *                   type: object
 *                   properties:
 *                     score: { type: integer, example: 88 }
 *                     passed: { type: boolean, example: true }
 *                     badgeAwarded: { type: string, example: 'Certified React Specialist' }
 */
router.post('/:id/submit', authMiddleware, submissionRateLimiter, skillController.submit);

export default router;
