import VerificationRequest from '../models/VerificationRequest.js';
import User from '../models/User.js';

export const verificationController = {
  // Student submits verification request
  submit: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { type, institution, department, docName, docUrl, notes } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const request = await VerificationRequest.create({
        user: userId,
        role: user.role,
        type: type || 'College ID Document',
        institution: institution || user.college || '',
        department: department || user.branch || '',
        docName: docName || 'Uploaded_Document.pdf',
        docUrl: docUrl || '',
        notes: notes || '',
        status: 'pending',
      });

      res.status(201).json({
        success: true,
        message: 'Verification request submitted for admin review.',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current user's verification items status
  getMyStatus: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const [user, requests] = await Promise.all([
        User.findById(userId),
        VerificationRequest.find({ user: userId }).sort({ createdAt: -1 }),
      ]);

      const items = [
        {
          title: 'Email Verification',
          description: 'Verify your university or personal email address using OTP.',
          status: user?.emailVerified ? 'Completed' : 'Pending',
        },
        {
          title: 'Phone Verification',
          description: 'Verify your phone number.',
          status: user?.phone ? 'Completed' : 'Pending',
        },
        {
          title: 'College ID Verification',
          description: 'Upload your student ID card or official university enrollment document.',
          status: user?.collegeIdVerified
            ? 'Completed'
            : requests.some((r) => r.status === 'pending')
            ? 'In Review'
            : 'Pending',
        },
      ];

      res.json({
        success: true,
        data: {
          items,
          requests,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
