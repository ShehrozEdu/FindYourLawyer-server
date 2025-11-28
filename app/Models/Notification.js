const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const NotificationSchema = new Schema({
  user: { 
    type: ObjectId, 
    ref: "user",
    required: true 
  },
  type: { 
    type: String, 
    enum: ['case_created', 'case_updated', 'case_status_changed', 'payment_received', 'message_received', 'appointment_reminder', 'system'],
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  relatedCase: { 
    type: ObjectId, 
    ref: "casesLawyer",
    default: null
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readAt: { 
    type: Date, 
    default: null 
  }
}, {
  timestamps: true
});

// Index for efficient queries
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;

