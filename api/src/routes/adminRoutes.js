import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Core admin privileges required',
    });
  }
  next();
};

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

/**
 * @openapi
 * /api/admin/overview:
 *   get:
 *     summary: Retrieve executive platform overview metrics and recent signups
 *     description: High-level KPI counts (total students, companies, colleges, active internships, pending verifications) and recent student registrations.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     responses:
 *       200:
 *         description: Overview analytics and metric counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     metrics:
 *                       type: object
 *                       properties:
 *                         totalStudents: { type: integer, example: 1240 }
 *                         totalCompanies: { type: integer, example: 85 }
 *                         totalColleges: { type: integer, example: 34 }
 *                         totalInternships: { type: integer, example: 210 }
 *                         activeInternships: { type: integer, example: 175 }
 *                         totalApplications: { type: integer, example: 3840 }
 *                         pendingVerifications: { type: integer, example: 18 }
 *                     recentUsers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Admin credentials required
 */
router.get('/overview', adminController.getOverview);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Manage platform users with role tag filtering
 *     description: Paginated directory of platform accounts with role tag filtering and search.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, college, or branch
 *       - in: query
 *         name: roleTag
 *         schema:
 *           type: string
 *           enum: [All, Admin, Maintainer, Promoter, Contributor, Ambassador, Regular]
 *         description: Filter students by badge role tag
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, company, college, admin]
 *           default: 'student'
 *         description: Account role type
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
 *         description: Paginated list of users
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
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/users', adminController.getUsers);

/**
 * @openapi
 * /api/admin/users/{id}/role-tag:
 *   put:
 *     summary: Assign platform community role tag
 *     description: Assign special honors/status tag (Maintainer, Admin, Promoter, Contributor, Ambassador, Regular) to a student profile.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleTag
 *             properties:
 *               roleTag:
 *                 type: string
 *                 enum: [Admin, Maintainer, Promoter, Contributor, Ambassador, Regular]
 *                 example: 'Maintainer'
 *     responses:
 *       200:
 *         description: User role tag updated successfully
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
 *                   example: 'Student role tag updated to Maintainer'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid role tag provided
 */
router.put('/users/:id/role-tag', adminController.updateRoleTag);

/**
 * @openapi
 * /api/admin/internships/{id}/moderate:
 *   put:
 *     summary: Moderate internship listing (approve, suspend, feature on Launchpad)
 *     description: Update moderation status (active, paused, closed), verification badge, or featured status.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target internship MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, paused, closed]
 *                 example: 'active'
 *               isVerified:
 *                 type: boolean
 *                 example: true
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Internship moderation updated successfully
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
 *                   example: 'Internship moderation settings updated'
 *                 data:
 *                   $ref: '#/components/schemas/Internship'
 */
router.put('/internships/:id/moderate', adminController.moderateInternship);
router.delete('/internships/:id', adminController.deleteInternship);

/**
 * @openapi
 * /api/admin/verifications:
 *   get:
 *     summary: List pending and audited college ID / business verification requests
 *     description: Review verification queue for student college ID cards and enterprise credentials.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, approved, rejected]
 *         description: Status filter
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by document type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search institution or document name
 *     responses:
 *       200:
 *         description: List of verification requests
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
 *                     $ref: '#/components/schemas/VerificationRequest'
 */
router.get('/verifications', adminController.getVerifications);

/**
 * @openapi
 * /api/admin/verifications/{id}:
 *   put:
 *     summary: Review and approve or reject verification request
 *     description: Marks verification request as approved or rejected and updates the student user model.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification request MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: 'approved'
 *               rejectionReason:
 *                 type: string
 *                 example: 'Document image was blurry and graduation date was unreadable.'
 *     responses:
 *       200:
 *         description: Verification review decision recorded
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
 *                   example: 'Verification request approved'
 *                 data:
 *                   $ref: '#/components/schemas/VerificationRequest'
 */
router.put('/verifications/:id', adminController.reviewVerification);

/**
 * @openapi
 * /api/admin/analytics:
 *   get:
 *     summary: System telemetry, conversion funnels, top skills, and college leaderboard
 *     description: Complete analytical breakdown of recruitment funnels, verified colleges, and skill distribution.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin Portal
 *     responses:
 *       200:
 *         description: Complete analytical telemetry data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     kpi:
 *                       type: object
 *                     topSkills:
 *                       type: array
 *                       items:
 *                         type: object
 *                     funnel:
 *                       type: array
 *                       items:
 *                         type: object
 *                     collegeLeaderboard:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/analytics', adminController.getAnalytics);

export default router;
