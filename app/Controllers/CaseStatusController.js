const expressAsyncHandler = require("express-async-handler");
const CaseStatus = require("../Models/CaseStatus");
const LawyerDashboard = require("../Models/LawyerDashboard");
const NotificationController = require("./NotificationController");

const CaseStatusController = {
  // Update case status and create status history entry
  updateCaseStatus: expressAsyncHandler(async (req, res) => {
    try {
      const { caseId } = req.params;
      const { status, notes } = req.body;
      const updatedBy = req.user._id; // From auth middleware

      // Validate status
      const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          status: false, 
          error: 'Invalid status. Must be one of: pending, accepted, in_progress, completed, cancelled' 
        });
      }

      // Check if case exists
      const caseRecord = await LawyerDashboard.findById(caseId);
      if (!caseRecord) {
        return res.status(404).json({ 
          status: false, 
          error: 'Case not found' 
        });
      }

      // Verify user has permission (lawyer owns the case or client owns the case)
      if (caseRecord.lawyer.toString() !== updatedBy.toString() && 
          caseRecord.client.toString() !== updatedBy.toString()) {
        return res.status(403).json({ 
          status: false, 
          error: 'You do not have permission to update this case' 
        });
      }

      // Update case status
      caseRecord.status = status;
      await caseRecord.save();

      // Create status history entry
      const statusHistory = new CaseStatus({
        case: caseId,
        status: status,
        updatedBy: updatedBy,
        notes: notes || '',
        timestamp: new Date()
      });
      await statusHistory.save();

      // Create notifications for case status change
      const statusMessages = {
        'pending': 'Case is pending review',
        'accepted': 'Your case has been accepted',
        'in_progress': 'Case is now in progress',
        'completed': 'Case has been completed',
        'cancelled': 'Case has been cancelled'
      };

      // Notify client
      if (caseRecord.client.toString() !== updatedBy.toString()) {
        await NotificationController.createNotification(
          caseRecord.client,
          'case_status_changed',
          'Case Status Updated',
          statusMessages[status] || `Case status changed to ${status}`,
          caseId
        );
      }

      // Notify lawyer
      if (caseRecord.lawyer.toString() !== updatedBy.toString()) {
        await NotificationController.createNotification(
          caseRecord.lawyer,
          'case_status_changed',
          'Case Status Updated',
          statusMessages[status] || `Case status changed to ${status}`,
          caseId
        );
      }

      res.status(200).json({
        status: true,
        message: 'Case status updated successfully',
        case: caseRecord,
        statusHistory: statusHistory
      });
    } catch (error) {
      console.error('Update case status error:', error);
      res.status(500).json({ 
        status: false, 
        error: 'Internal server error' 
      });
    }
  }),

  // Get status history for a case
  getCaseStatusHistory: expressAsyncHandler(async (req, res) => {
    try {
      const { caseId } = req.params;
      const userId = req.user._id; // From auth middleware

      // Check if case exists and user has permission
      const caseRecord = await LawyerDashboard.findById(caseId);
      if (!caseRecord) {
        return res.status(404).json({ 
          status: false, 
          error: 'Case not found' 
        });
      }

      // Verify user has permission
      if (caseRecord.lawyer.toString() !== userId.toString() && 
          caseRecord.client.toString() !== userId.toString()) {
        return res.status(403).json({ 
          status: false, 
          error: 'You do not have permission to view this case' 
        });
      }

      // Get status history
      const statusHistory = await CaseStatus.find({ case: caseId })
        .populate('updatedBy', 'FirstName LastName Email')
        .sort({ timestamp: -1 });

      res.status(200).json({
        status: true,
        statusHistory: statusHistory
      });
    } catch (error) {
      console.error('Get case status history error:', error);
      res.status(500).json({ 
        status: false, 
        error: 'Internal server error' 
      });
    }
  }),

  // Get cases by status for a user
  getCasesByStatus: expressAsyncHandler(async (req, res) => {
    try {
      const { status, clientId } = req.query;
      const userId = req.user._id; // From auth middleware
      const userRole = req.user.isLawyer; // From auth middleware

      // Build query based on user role or clientId parameter
      const query = {};
      if (clientId) {
        // If clientId is provided, get cases for that specific client
        query.client = clientId;
        // Only lawyers can view client cases
        if (!userRole) {
          return res.status(403).json({ 
            status: false, 
            error: 'Only lawyers can view client cases by clientId' 
          });
        }
      } else {
        // Otherwise, get cases for the current user
        if (userRole) {
          query.lawyer = userId;
        } else {
          query.client = userId;
        }
      }

      // Add status filter if provided
      if (status) {
        const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
        if (validStatuses.includes(status)) {
          query.status = status;
        }
      }

      const cases = await LawyerDashboard.find(query)
        .populate('client', 'FirstName LastName Email')
        .populate('lawyer', 'FirstName LastName Email Expertise State FeePerCase')
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: true,
        cases: cases,
        count: cases.length
      });
    } catch (error) {
      console.error('Get cases by status error:', error);
      res.status(500).json({ 
        status: false, 
        error: 'Internal server error' 
      });
    }
  }),
};

module.exports = CaseStatusController;

