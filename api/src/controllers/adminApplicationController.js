import { adminApplicationService } from '../services/adminApplicationService.js';

export const adminApplicationController = {
  sendApplicantOtp: async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await adminApplicationService.sendApplicantOtp(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  verifyApplicantOtp: async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const result = await adminApplicationService.verifyApplicantOtp(email, otp);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  sendOfficialOtp: async (req, res, next) => {
    try {
      const { applicantEmail, verificationToken } = req.body;
      const result = await adminApplicationService.sendOfficialOtp(
        applicantEmail,
        verificationToken
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  submitApplication: async (req, res, next) => {
    try {
      const {
        name,
        email,
        phone,
        dob,
        recommendedBy,
        notes,
        photoConsent,
        officialOtp,
        verificationToken,
      } = req.body;

      const result = await adminApplicationService.submitApplication({
        name,
        email,
        phone,
        dob,
        recommendedBy,
        notes,
        photoConsent,
        officialOtp,
        verificationToken,
        photoFile: req.file,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  listApplications: async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }
      const applications = await adminApplicationService.listApplications(filter);
      res.json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  },

  approveApplication: async (req, res, next) => {
    try {
      const { id } = req.params;
      const coreAdminId = req.user ? req.user.id : null;
      const result = await adminApplicationService.approveApplication(
        id,
        coreAdminId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  rejectApplication: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const coreAdminId = req.user ? req.user.id : null;
      const result = await adminApplicationService.rejectApplication(
        id,
        coreAdminId,
        reason
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
