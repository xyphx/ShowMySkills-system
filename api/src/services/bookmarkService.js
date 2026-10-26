import Bookmark from '../models/Bookmark.js';

export const bookmarkService = {
  // Toggle saving an internship
  toggleInternship: async (userId, internshipId) => {
    const existing = await Bookmark.findOne({
      user: userId,
      itemType: 'internship',
      internship: internshipId,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return { saved: false, message: 'Internship removed from saved list' };
    }

    await Bookmark.create({
      user: userId,
      itemType: 'internship',
      internship: internshipId,
    });
    return { saved: true, message: 'Internship bookmarked successfully' };
  },

  // Toggle saving a star candidate (for recruiters)
  toggleCandidate: async (userId, candidateId) => {
    const existing = await Bookmark.findOne({
      user: userId,
      itemType: 'candidate',
      candidate: candidateId,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return { saved: false, message: 'Candidate removed from starred talent' };
    }

    await Bookmark.create({
      user: userId,
      itemType: 'candidate',
      candidate: candidateId,
    });
    return { saved: true, message: 'Candidate added to starred talent' };
  },

  // Get current user's saved items
  getMyBookmarks: async (userId, type = null) => {
    const filter = { user: userId };
    if (type) filter.itemType = type;

    return Bookmark.find(filter)
      .populate('internship')
      .populate('candidate', 'name email college branch roleTag reputationScore profileIcon skills')
      .sort({ createdAt: -1 });
  },
};
