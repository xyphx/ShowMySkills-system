import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/chats/conversations:
 *   get:
 *     summary: Retrieve active chat threads and conversation previews
 *     description: Returns all conversations involving the authenticated user with unread counts and last message snippet.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chats & Messaging
 *     responses:
 *       200:
 *         description: List of conversations
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
 *                       id: { type: string, example: '67bb8e7d206f4a38b9c1d060' }
 *                       otherUser: { $ref: '#/components/schemas/User' }
 *                       lastMessage: { type: string, example: 'When can we connect for an interview?' }
 *                       lastMessageAt: { type: string, format: date-time }
 *                       unread: { type: integer, example: 2 }
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/conversations', chatController.getConversations);

/**
 * @openapi
 * /api/chats/conversations/{id}/messages:
 *   get:
 *     summary: Fetch message history for a conversation
 *     description: Returns chronological messages within a conversation thread.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chats & Messaging
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d060'
 *     responses:
 *       200:
 *         description: Message history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *       401:
 *         description: Unauthorized - Bearer token required
 */
router.get('/conversations/:id/messages', chatController.getMessages);

/**
 * @openapi
 * /api/chats/messages:
 *   post:
 *     summary: Send direct message to a user or thread
 *     description: Sends a text message, either referencing an existing conversationId or starting a new thread by receiverId.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chats & Messaging
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: 'Hello! I noticed your open role on the Launchpad.'
 *               receiverId:
 *                 type: string
 *                 description: Target user MongoDB ObjectId (if new thread)
 *                 example: '67bb8e7d206f4a38b9c1d002'
 *               conversationId:
 *                 type: string
 *                 description: Existing conversation thread ObjectId
 *                 example: '67bb8e7d206f4a38b9c1d060'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Missing message text or receiver/conversation ID
 */
router.post('/messages', chatController.sendMessage);

/**
 * @openapi
 * /api/chats/conversations/{id}/read:
 *   put:
 *     summary: Mark all unread messages in conversation as read
 *     description: Resets unread counter and marks all received messages as read in the specified conversation.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Chats & Messaging
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation MongoDB ObjectId
 *         example: '67bb8e7d206f4a38b9c1d060'
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Messages marked as read' }
 */
router.put('/conversations/:id/read', chatController.markAsRead);

export default router;
