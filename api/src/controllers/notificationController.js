import Notification from '../models/Notification.js';

export const notificationController = {
  // Get all notifications for current user
  list: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(30);

      const unreadCount = await Notification.countDocuments({
        user: userId,
        unread: true,
      });

      res.json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  },

  // Mark all or specific notifications as read
  markAsRead: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { notificationId } = req.body;

      if (notificationId) {
        await Notification.findOneAndUpdate(
          { _id: notificationId, user: userId },
          { $set: { unread: false } }
        );
      } else {
        await Notification.updateMany(
          { user: userId, unread: true },
          { $set: { unread: false } }
        );
      }

      res.json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
      next(error);
    }
  },
};
