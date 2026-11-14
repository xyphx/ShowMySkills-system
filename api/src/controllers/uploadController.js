import fs from 'node:fs';
import { formatFileUrl } from '../services/uploadService.js';
import storageService from '../services/storageService.js';
import User from '../models/User.js';

/**
 * Helper to upload a locally-saved multer file to XyphX Centralized Storage
 * with automatic fallback to local URL if offline or unconfigured.
 */
async function processUploadToCentralizedStorage(req, subfolder) {
  let fileUrl = formatFileUrl(req, req.file, subfolder);
  let fileId = null;

  if (storageService.isConfigured() && req.file?.path) {
    try {
      const buffer = await fs.promises.readFile(req.file.path);
      const userId = req.user?.id || 'usr_anonymous';
      const result = await storageService.uploadFile({
        userId,
        buffer,
        fileName: req.file.originalname || req.file.filename,
        mimeType: req.file.mimetype,
      });
      if (result?.url) {
        fileUrl = result.url;
        fileId = result.fileId;
      }
    } catch (storageErr) {
      console.warn(`[StorageService] Centralized upload fallback to local for ${subfolder}:`, storageErr.message);
    }
  }

  return { fileUrl, fileId };
}

export const uploadController = {
  // Upload user avatar & optionally attach to profileIcon
  handleAvatarUpload: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No avatar image uploaded' });
      }

      const { fileUrl, fileId } = await processUploadToCentralizedStorage(req, 'avatars');

      // If user is logged in, auto-update profileIcon
      if (req.user?.id) {
        const updateFields = { profileIcon: fileUrl };
        if (fileId) updateFields.profileIconFileId = fileId;
        await User.findByIdAndUpdate(req.user.id, { $set: updateFields });
      }

      res.status(201).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          url: fileUrl,
          fileId,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Upload candidate resume & optionally attach to resumeUrl
  handleResumeUpload: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No resume document uploaded' });
      }

      const { fileUrl, fileId } = await processUploadToCentralizedStorage(req, 'resumes');

      if (req.user?.id) {
        const updateFields = { resumeUrl: fileUrl };
        if (fileId) updateFields.resumeFileId = fileId;
        await User.findByIdAndUpdate(req.user.id, { $set: updateFields });
      }

      res.status(201).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          url: fileUrl,
          fileId,
          filename: req.file.filename,
          size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Upload certification proof document
  handleCertificateUpload: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No certificate document uploaded' });
      }

      const { fileUrl, fileId } = await processUploadToCentralizedStorage(req, 'certificates');

      res.status(201).json({
        success: true,
        message: 'Certificate uploaded successfully',
        data: {
          url: fileUrl,
          fileId,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Upload company brand logo
  handleLogoUpload: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No logo image uploaded' });
      }

      const { fileUrl, fileId } = await processUploadToCentralizedStorage(req, 'company-logos');

      if (req.user?.id) {
        await User.findByIdAndUpdate(req.user.id, {
          $set: { 'companyProfile.logo': fileUrl, profileIcon: fileUrl },
        });
      }

      res.status(201).json({
        success: true,
        message: 'Company logo uploaded successfully',
        data: {
          url: fileUrl,
          fileId,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Upload chat attachment
  handleAttachmentUpload: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No attachment uploaded' });
      }

      const { fileUrl, fileId } = await processUploadToCentralizedStorage(req, 'chat-attachments');

      res.status(201).json({
        success: true,
        message: 'Chat attachment uploaded successfully',
        data: {
          url: fileUrl,
          fileId,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Upload internship poster image
  handleInternshipPosterUpload: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No poster image uploaded' });
      }

      const fileUrl = formatFileUrl(req, req.file, 'internship-posters');

      res.status(201).json({
        success: true,
        message: 'Internship poster uploaded successfully',
        data: {
          url: fileUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default uploadController;
