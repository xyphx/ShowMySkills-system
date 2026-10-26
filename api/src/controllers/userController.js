import { userService } from '../services/userService.js';

export const userController = {
  // Search and list students/candidates for People directory
  getUsers: async (req, res, next) => {
    try {
      const {
        search = '',
        role = 'student',
        roleTag,
        college,
        skill,
        page = 1,
        limit = 20,
      } = req.query;

      const result = await userService.searchUsers({
        search,
        role,
        roleTag,
        college,
        skill,
        page: Number(page),
        limit: Number(limit),
      });

      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get specific user public profile by ID
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  // Update authenticated user's profile
  updateProfile: async (req, res, next) => {
    try {
      const updatedUser = await userService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user preferences & security settings
  updateSettings: async (req, res, next) => {
    try {
      const updatedUser = await userService.updateSettings(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Settings saved successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
};
