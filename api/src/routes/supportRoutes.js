import { Router } from 'express';
import { supportController } from '../controllers/supportController.js';
import { submissionRateLimiter } from '../middleware/security.js';

const router = Router();

/**
 * @openapi
 * /api/support/tickets:
 *   post:
 *     summary: Submit a help desk or partnership inquiry ticket
 *     description: Submit a customer support, billing, or enterprise partnership inquiry ticket.
 *     tags:
 *       - Support & FAQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Alex Morgan'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'alex.morgan@university.edu'
 *               category:
 *                 type: string
 *                 example: 'Verification'
 *               subject:
 *                 type: string
 *                 example: 'Status of college ID review'
 *               message:
 *                 type: string
 *                 example: 'I submitted my student ID card document yesterday and wanted to ask when reviews are completed.'
 *     responses:
 *       201:
 *         description: Ticket submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Your inquiry has been received. Our team will contact you within 24 hours.' }
 *                 data: { $ref: '#/components/schemas/SupportTicket' }
 *       400:
 *         description: Missing required fields
 */
router.post('/tickets', submissionRateLimiter, supportController.submitTicket);

/**
 * @openapi
 * /api/support/faqs:
 *   get:
 *     summary: Retrieve platform knowledge base & FAQs
 *     description: Searchable repository of frequently asked questions regarding verification, plans, and recruiter ATS.
 *     tags:
 *       - Support & FAQ
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query keyword
 *     responses:
 *       200:
 *         description: List of FAQs
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
 *                       q: { type: string, example: 'How does skill verification work on ShowMySkills?' }
 *                       a: { type: string, example: 'Skill verification is performed through target technical competency assessments...' }
 *                       category: { type: string, example: 'Verification' }
 */
router.get('/faqs', supportController.getFaqs);

export default router;
