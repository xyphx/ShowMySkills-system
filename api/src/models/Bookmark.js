import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['internship', 'candidate'],
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      default: null,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ user: 1, itemType: 1, internship: 1 });
bookmarkSchema.index({ user: 1, itemType: 1, candidate: 1 });

export const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
