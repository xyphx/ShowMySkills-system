import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import VerificationRequest from '../models/VerificationRequest.js';

export const adminController = {
  // Platform overview summary statistics
  getOverview: async (req, res, next) => {
    try {
      const [
        totalStudents,
        totalCompanies,
        totalColleges,
        totalInternships,
        activeInternships,
        totalApplications,
        pendingVerifications,
        recentUsers,
      ] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'company' }),
        User.countDocuments({ role: 'college' }),
        Internship.countDocuments(),
        Internship.countDocuments({ status: 'active' }),
        Application.countDocuments(),
        VerificationRequest.countDocuments({ status: 'pending' }),
        User.find({ role: 'student' })
          .select('name email college branch roleTag reputationScore profileIcon createdAt')
          .sort({ createdAt: -1 })
          .limit(6),
      ]);

      res.json({
        success: true,
        data: {
          metrics: {
            totalStudents,
            totalCompanies,
            totalColleges,
            totalInternships,
            activeInternships,
            totalApplications,
            pendingVerifications,
          },
          recentUsers,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // List users with search, roleTag filter, and pagination
  getUsers: async (req, res, next) => {
    try {
      const { search, roleTag, role = 'student', page = 1, limit = 20 } = req.query;
      const filter = { role };

      if (roleTag && roleTag !== 'All') {
        filter.roleTag = roleTag;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { name: regex },
          { email: regex },
          { college: regex },
          { branch: regex },
        ];
      }

      const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password -emailVerificationOtp -passwordResetOtp')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        User.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Assign platform role tag to a student (Maintainer, Admin, Promoter, Contributor, Ambassador, Regular)
  updateRoleTag: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { roleTag } = req.body;

      const validTags = ['Admin', 'Maintainer', 'Promoter', 'Contributor', 'Ambassador', 'Regular'];
      if (!validTags.includes(roleTag)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role tag. Must be one of: ${validTags.join(', ')}`,
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $set: { roleTag } },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        message: `Student role tag updated to ${roleTag}`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Moderate internship listing (approve, suspend, feature)
  moderateInternship: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, isVerified, isFeatured } = req.body;

      const updateData = {};
      if (status) updateData.status = status;
      if (isVerified !== undefined) updateData.isVerified = isVerified;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

      const internship = await Internship.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }

      res.json({
        success: true,
        message: 'Internship moderation settings updated',
        data: internship,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteInternship: async (req, res, next) => {
    try {
      const { id } = req.params;
      const internship = await Internship.findByIdAndDelete(id);
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }
      res.json({
        success: true,
        message: 'Internship posting removed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // List verification audit requests
  getVerifications: async (req, res, next) => {
    try {
      const { status, search, type } = req.query;
      const filter = {};

      if (status && status !== 'all') {
        filter.status = status;
      }

      if (type) {
        filter.type = type;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { institution: regex },
          { department: regex },
          { docName: regex },
        ];
      }

      const requests = await VerificationRequest.find(filter)
        .populate('user', 'name email role college profileIcon')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  },

  // Review & approve/reject verification request
  reviewVerification: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'approved' or 'rejected'",
        });
      }

      const request = await VerificationRequest.findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            rejectionReason: rejectionReason || '',
            reviewedBy: req.user.id,
            reviewedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ success: false, message: 'Verification request not found' });
      }

      // If approved, update user model verification flags
      if (status === 'approved' && request.user) {
        await User.findByIdAndUpdate(request.user, {
          $set: {
            collegeIdVerified: true,
            collegeIdVerifiedAt: new Date(),
          },
        });
      }

      res.json({
        success: true,
        message: `Verification request ${status}`,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },

  // Telemetry and system analytics
  getAnalytics: async (req, res, next) => {
    try {
      const [studentCount, companyCount, activeInternships, totalApplications] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'company' }),
        Internship.countDocuments({ status: 'active' }),
        Application.countDocuments(),
      ]);

      const [shortlistedCount, interviewCount, acceptedCount, skillsAgg, collegeAgg] = await Promise.all([
        Application.countDocuments({ status: { $in: ['shortlisted', 'Shortlisted'] } }),
        Application.countDocuments({ status: { $in: ['interviewing', 'Interviewing'] } }),
        Application.countDocuments({ status: { $in: ['accepted', 'Offered', 'hired', 'Hired'] } }),
        User.aggregate([
          { $match: { role: 'student', primarySkills: { $exists: true, $ne: [] } } },
          { $unwind: '$primarySkills' },
          { $group: { _id: '$primarySkills', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
        User.aggregate([
          { $match: { role: 'student', college: { $exists: true, $ne: '' } } },
          { $group: { _id: '$college', verifiedStudents: { $sum: 1 }, avgScore: { $avg: '$reputationScore' } } },
          { $sort: { verifiedStudents: -1 } },
          { $limit: 5 },
        ]),
      ]);

      const shortlistRate = totalApplications > 0
        ? `${Math.round((shortlistedCount / totalApplications) * 100)}%`
        : '0%';

      const topSkills = skillsAgg.map((s) => ({
        skill: s._id,
        demand: Math.min(100, Math.round((s.count / (studentCount || 1)) * 100)),
        count: `${s.count} Candidates`,
      }));

      const collegeLeaderboard = collegeAgg.map((c, idx) => ({
        rank: idx + 1,
        name: c._id,
        verifiedStudents: c.verifiedStudents,
        hires: 0,
        score: Math.round(c.avgScore || 0),
      }));

      const funnel = totalApplications > 0
        ? [
            { stage: 'Applications Submitted', count: totalApplications, percent: '100%' },
            { stage: 'Recruiter Shortlisted', count: shortlistedCount, percent: `${Math.round((shortlistedCount / totalApplications) * 100)}%` },
            { stage: 'Interviews Scheduled', count: interviewCount, percent: `${Math.round((interviewCount / totalApplications) * 100)}%` },
            { stage: 'Offers & PPOs Accepted', count: acceptedCount, percent: `${Math.round((acceptedCount / totalApplications) * 100)}%` },
          ]
        : [];

      res.json({
        success: true,
        data: {
          kpi: {
            registeredStudents: studentCount,
            partnerCompanies: companyCount,
            activeInternships,
            totalApplications,
            shortlistRate,
          },
          topSkills,
          funnel,
          collegeLeaderboard,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
