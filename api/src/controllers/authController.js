import { userService } from '../services/userService.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.authenticate(email, password);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const newUser = await userService.createUser({
        ...req.body,
        collegeIdDocument: req.file ? req.file.path : null
      });
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const user = await userService.verifyEmailOtp(email, otp);

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
};
