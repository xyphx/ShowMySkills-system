import LaunchpadItem from '../models/LaunchpadItem.js';

export const launchpadController = {
  // List all launchpad programs with search and filters
  list: async (req, res, next) => {
    try {
      const { search, skill, batch, page = 1, limit = 20 } = req.query;
      const filter = {};

      if (batch) {
        filter.batchYear = new RegExp(batch, 'i');
      }

      if (skill) {
        filter.skills = new RegExp(skill, 'i');
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { position: regex },
          { company: regex },
          { skills: regex },
          { oneLiner: regex },
        ];
      }

      const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

      const [items, total] = await Promise.all([
        LaunchpadItem.find(filter)
          .sort({ displayOrder: 1, createdAt: 1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        LaunchpadItem.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get details of a single launchpad opportunity
  getById: async (req, res, next) => {
    try {
      const item = await LaunchpadItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Launchpad opportunity not found' });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  // Record application link click telemetry
  recordClick: async (req, res, next) => {
    try {
      const item = await LaunchpadItem.findByIdAndUpdate(
        req.params.id,
        { $inc: { clickCount: 1 } },
        { new: true }
      );
      if (!item) {
        return res.status(404).json({ success: false, message: 'Opportunity not found' });
      }
      res.json({ success: true, clicks: item.clickCount });
    } catch (error) {
      next(error);
    }
  },

  // Create a new launchpad opportunity (Admin)
  create: async (req, res, next) => {
    try {
      const item = await LaunchpadItem.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },
};
