import { Router } from 'express';
import { launchpadController } from '../controllers/launchpadController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { clickRateLimiter } from '../middleware/security.js';

const router = Router();

/**
 * @openapi
 * /api/launchpad:
 *   get:
 *     summary: Discover curated top-tech verified internships & launchpad programs
 *     description: Retrieve hand-curated tier-1 opportunities (e.g. Google Summer of Code, MLH, Microsoft Explore) with filters by batch year, skills, or search keywords.
 *     tags:
 *       - Launchpad
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by position title, company, or overview
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Filter by primary technical skill
 *       - in: query
 *         name: batch
 *         schema:
 *           type: string
 *         description: Graduation batch year (e.g. 2026, 2027)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of launchpad programs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LaunchpadItem'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *   post:
 *     summary: Create new launchpad opportunity (Admin)
 *     description: Publish a new curated opportunity to the Launchpad directory.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Launchpad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - position
 *               - company
 *               - applyUrl
 *             properties:
 *               position:
 *                 type: string
 *                 example: 'Google Summer of Code 2026'
 *               company:
 *                 type: string
 *                 example: 'Google Open Source'
 *               location:
 *                 type: string
 *                 example: 'Global / Remote'
 *               stipend:
 *                 type: string
 *                 example: '$3,000 - $6,000 USD'
 *               batchYear:
 *                 type: string
 *                 example: '2026'
 *               applyUrl:
 *                 type: string
 *                 format: uri
 *                 example: 'https://summerofcode.withgoogle.com'
 *               skills:
 *                 type: array
 *                 items: { type: string }
 *                 example: ['Git', 'Python', 'C++']
 *               featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Launchpad opportunity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/LaunchpadItem'
 */
router.get('/', launchpadController.list);
router.post('/', authMiddleware, launchpadController.create);

/**
 * @openapi
 * /api/launchpad/{id}:
 *   get:
 *     summary: Retrieve single launchpad opportunity details
 *     description: Get full details, requirements, and metadata for a specific launchpad opportunity.
 *     tags:
 *       - Launchpad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Launchpad item MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d030'
 *     responses:
 *       200:
 *         description: Launchpad opportunity details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/LaunchpadItem'
 *       404:
 *         description: Launchpad opportunity not found
 */
router.get('/:id', launchpadController.getById);

/**
 * @openapi
 * /api/launchpad/{id}/click:
 *   post:
 *     summary: Record click telemetry on external application link
 *     description: Increments outbound click count when a student navigates to apply on external site.
 *     tags:
 *       - Launchpad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Launchpad item MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d030'
 *     responses:
 *       200:
 *         description: Click recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 clicks: { type: integer, example: 1841 }
 *       404:
 *         description: Opportunity not found
 */
router.post('/:id/click', clickRateLimiter, launchpadController.recordClick);

export default router;
