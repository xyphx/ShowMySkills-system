import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      default: 'Just now',
    },
    unread: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ['application', 'message', 'verification', 'profile_view', 'system'],
      default: 'system',
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
