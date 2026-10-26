import { bookmarkService } from '../services/bookmarkService.js';

export const bookmarkController = {
  toggleInternship: async (req, res, next) => {
    try {
      const result = await bookmarkService.toggleInternship(req.user.id, req.params.id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  toggleCandidate: async (req, res, next) => {
    try {
      const result = await bookmarkService.toggleCandidate(req.user.id, req.params.id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  getMyBookmarks: async (req, res, next) => {
    try {
      const { type } = req.query;
      const bookmarks = await bookmarkService.getMyBookmarks(req.user.id, type);
      res.json({ success: true, data: bookmarks });
    } catch (error) {
      next(error);
    }
  },
};
