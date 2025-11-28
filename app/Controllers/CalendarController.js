const expressAsyncHandler = require("express-async-handler");
const CalendarEvent = require("../Models/CalendarEvent");
const NotificationController = require("./NotificationController");

const CalendarController = {
  // Get calendar events for a user
  getEvents: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { startDate, endDate, type } = req.query;

      const query = {
        $or: [
          { lawyer: userId },
          { client: userId }
        ]
      };

      if (startDate && endDate) {
        query.startTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (type) {
        query.type = type;
      }

      const events = await CalendarEvent.find(query)
        .populate('lawyer', 'FirstName LastName Email')
        .populate('client', 'FirstName LastName Email')
        .populate('case', 'clientName description status')
        .sort({ startTime: 1 });

      res.status(200).json({
        status: true,
        events: events
      });
    } catch (error) {
      console.error('Get calendar events error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Create a new calendar event
  createEvent: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const { title, description, startTime, endTime, client, caseId, type, location, notes } = req.body;

      // Validate required fields
      if (!title || !startTime || !endTime) {
        return res.status(400).json({
          status: false,
          error: 'Title, start time, and end time are required'
        });
      }

      // Validate time range
      if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({
          status: false,
          error: 'End time must be after start time'
        });
      }

      // Check for conflicts (for lawyers)
      if (req.user.isLawyer) {
        const conflictingEvents = await CalendarEvent.find({
          lawyer: userId,
          status: { $ne: 'cancelled' },
          $or: [
            {
              startTime: { $lt: new Date(endTime) },
              endTime: { $gt: new Date(startTime) }
            }
          ]
        });

        if (conflictingEvents.length > 0) {
          return res.status(409).json({
            status: false,
            error: 'Time slot conflicts with existing event',
            conflictingEvents: conflictingEvents
          });
        }
      }

      const event = new CalendarEvent({
        title,
        description: description || '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        lawyer: userId,
        client: client || null,
        case: caseId || null,
        type: type || 'consultation',
        location: location || '',
        notes: notes || '',
        status: 'scheduled'
      });

      await event.save();
      await event.populate('client', 'FirstName LastName Email');
      await event.populate('case', 'clientName description');

      // Create notification for client if event has a client
      if (client && client !== userId.toString()) {
        await NotificationController.createNotification(
          client,
          'appointment_reminder',
          'New Appointment Scheduled',
          `You have a new ${type || 'consultation'} scheduled for ${new Date(startTime).toLocaleString()}`,
          caseId || null
        );
      }

      res.status(201).json({
        status: true,
        message: 'Event created successfully',
        event: event
      });
    } catch (error) {
      console.error('Create calendar event error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Update a calendar event
  updateEvent: expressAsyncHandler(async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      const event = await CalendarEvent.findById(eventId);
      if (!event) {
        return res.status(404).json({
          status: false,
          error: 'Event not found'
        });
      }

      // Check permissions
      if (event.lawyer.toString() !== userId.toString() && 
          (event.client && event.client.toString() !== userId.toString())) {
        return res.status(403).json({
          status: false,
          error: 'You do not have permission to update this event'
        });
      }

      // Convert date strings to Date objects if present
      if (updateData.startTime) updateData.startTime = new Date(updateData.startTime);
      if (updateData.endTime) updateData.endTime = new Date(updateData.endTime);

      // Validate time range if both times are being updated
      if (updateData.startTime && updateData.endTime) {
        if (updateData.startTime >= updateData.endTime) {
          return res.status(400).json({
            status: false,
            error: 'End time must be after start time'
          });
        }
      }

      Object.assign(event, updateData);
      await event.save();
      await event.populate('client', 'FirstName LastName Email');
      await event.populate('case', 'clientName description');

      res.status(200).json({
        status: true,
        message: 'Event updated successfully',
        event: event
      });
    } catch (error) {
      console.error('Update calendar event error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Delete a calendar event
  deleteEvent: expressAsyncHandler(async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user._id;

      const event = await CalendarEvent.findById(eventId);
      if (!event) {
        return res.status(404).json({
          status: false,
          error: 'Event not found'
        });
      }

      // Check permissions
      if (event.lawyer.toString() !== userId.toString() && 
          (event.client && event.client.toString() !== userId.toString())) {
        return res.status(403).json({
          status: false,
          error: 'You do not have permission to delete this event'
        });
      }

      await CalendarEvent.findByIdAndDelete(eventId);

      res.status(200).json({
        status: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      console.error('Delete calendar event error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  }),

  // Get availability for a lawyer
  getAvailability: expressAsyncHandler(async (req, res) => {
    try {
      const { lawyerId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          status: false,
          error: 'Date parameter is required'
        });
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const events = await CalendarEvent.find({
        lawyer: lawyerId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' }
      }).sort({ startTime: 1 });

      res.status(200).json({
        status: true,
        events: events,
        date: date
      });
    } catch (error) {
      console.error('Get availability error:', error);
      res.status(500).json({
        status: false,
        error: 'Internal server error'
      });
    }
  })
};

module.exports = CalendarController;

