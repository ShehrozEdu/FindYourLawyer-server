const expressAsyncHandler = require("express-async-handler");
const ActivityLog = require("../Models/ActivityLog");
const UsersModel = require("../Models/UsersModel");

const ActivityLogController = {
  // Get all activity logs with filters
  getActivityLogs: expressAsyncHandler(async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        userId,
        action,
        entityType,
        dateFrom,
        dateTo,
        search
      } = req.query;

      const query = {};

      if (userId) {
        query.user = userId;
      }

      if (action) {
        query.action = action;
      }

      if (entityType) {
        query.entityType = entityType;
      }

      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      let logs = await ActivityLog.find(query)
        .populate('user', 'FirstName LastName Email isLawyer isAdmin')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Search filter (client-side for description)
      if (search) {
        const searchLower = search.toLowerCase();
        logs = logs.filter(log =>
          log.description?.toLowerCase().includes(searchLower) ||
          log.user?.FirstName?.toLowerCase().includes(searchLower) ||
          log.user?.LastName?.toLowerCase().includes(searchLower) ||
          log.user?.Email?.toLowerCase().includes(searchLower)
        );
      }

      const total = await ActivityLog.countDocuments(query);

      res.status(200).json({
        status: true,
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get activity logs error:', error);
      res.status(500).json({
        status: false,
        error: 'Failed to fetch activity logs'
      });
    }
  }),

  // Create activity log (helper function, can be called from other controllers)
  createLog: async (user, action, entityType, entityId, description, metadata = {}, req = null) => {
    try {
      const log = new ActivityLog({
        user: user._id || user,
        action,
        entityType,
        entityId,
        description,
        metadata,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
        userAgent: req?.get('user-agent') || null
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Create activity log error:', error);
      // Don't throw error, just log it - activity logging shouldn't break main functionality
      return null;
    }
  }
};

module.exports = ActivityLogController;

