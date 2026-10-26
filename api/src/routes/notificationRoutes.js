import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Retrieve real-time notifications for the authenticated user
 *     description: Returns the user's latest 30 notifications and total unread count.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 unreadCount: { type: integer, example: 3 }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/', notificationController.list);

/**
 * @openapi
 * /api/notifications/mark-read:
 *   put:
 *     summary: Mark notifications as read
 *     description: Mark all unread notifications as read, or mark a single specific notification by passing notificationId.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notifications
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: Optional ID of a specific notification to mark as read
 *                 example: '67bb8e7d206f4a38b9c1d070'
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Notifications marked as read' }
 */
router.put('/mark-read', notificationController.markAsRead);

export default router;
