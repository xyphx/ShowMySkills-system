import { Router } from 'express';
import { bookmarkController } from '../controllers/bookmarkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/bookmarks/my-bookmarks:
 *   get:
 *     summary: Retrieve saved internships and starred candidates
 *     description: Returns the authenticated user's bookmarked opportunities and starred candidate profiles.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bookmarks & Saved Items
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [internship, candidate]
 *         description: Optional filter by item type
 *     responses:
 *       200:
 *         description: Saved items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string, example: '67bb8e7d206f4a38b9c1d0aa' }
 *                       itemType: { type: string, enum: [internship, candidate], example: 'internship' }
 *                       targetId: { type: string, example: '67bb8e7d206f4a38b9c1d010' }
 *                       createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/my-bookmarks', bookmarkController.getMyBookmarks);
router.get('/', bookmarkController.getMyBookmarks);

/**
 * @openapi
 * /api/bookmarks/internships/{id}:
 *   post:
 *     summary: Toggle save/bookmark for an internship opening
 *     description: Bookmarks or un-bookmarks an internship opening for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bookmarks & Saved Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target internship MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d010'
 *     responses:
 *       200:
 *         description: Bookmark toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 bookmarked: { type: boolean, example: true }
 *                 message: { type: string, example: 'Internship bookmarked' }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.post('/internships/:id', bookmarkController.toggleInternship);

/**
 * @openapi
 * /api/bookmarks/candidates/{id}:
 *   post:
 *     summary: Toggle starred status for a candidate profile
 *     description: Stars or un-stars a candidate profile for recruiter/company quick reference.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bookmarks & Saved Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target candidate user MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d001'
 *     responses:
 *       200:
 *         description: Candidate star status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 starred: { type: boolean, example: true }
 *                 message: { type: string, example: 'Candidate starred' }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.post('/candidates/:id', bookmarkController.toggleCandidate);

export default router;
