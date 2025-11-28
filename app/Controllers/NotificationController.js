const expressAsyncHandler = require("express-async-handler");
const Notification = require("../Models/Notification");
const LawyerDashboard = require("../Models/LawyerDashboard");

const NotificationController = {
  // Get all notifications for a user
  getNotifications: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { unreadOnly } = req.query;

      const query = { user: userId };
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate('relatedCase', 'clientName description status')
        .sort({ createdAt: -1 })
        .limit(50); // Limit to last 50 notifications

      const unreadCount = await Notification.countDocuments({ 
        user: userId, 
        isRead: false 
      });

      res.status(200).json({
        status: true,
        notifications: notifications,
        unreadCount: unreadCount
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Mark notification as read
  markAsRead: expressAsyncHandler(async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      const notification = await Notification.findOne({
        _id: notificationId,
        user: userId
      });

      if (!notification) {
        return res.status(404).json({
          status: false,
          error: 'Notification not found'
        });
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      res.status(200).json({
        status: true,
        message: 'Notification marked as read',
        notification: notification
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Mark all notifications as read
  markAllAsRead: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      await Notification.updateMany(
        { user: userId, isRead: false },
        { 
          isRead: true, 
          readAt: new Date() 
        }
      );

      res.status(200).json({
        status: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Delete notification
  deleteNotification: expressAsyncHandler(async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        user: userId
      });

      if (!notification) {
        return res.status(404).json({
          status: false,
          error: 'Notification not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'Notification deleted'
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Create notification (helper function - can be called from other controllers)
  createNotification: async (userId, type, title, message, relatedCaseId = null) => {
    try {
      const notification = new Notification({
        user: userId,
        type: type,
        title: title,
        message: message,
        relatedCase: relatedCaseId
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      return null;
    }
  }
};

module.exports = NotificationController;

