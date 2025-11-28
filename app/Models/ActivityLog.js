const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ActivityLogSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "user",
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'create_case',
      'update_case',
      'delete_case',
      'create_review',
      'update_review',
      'delete_review',
      'create_blog',
      'update_blog',
      'delete_blog',
      'create_booking',
      'update_booking',
      'delete_booking',
      'upload_document',
      'delete_document',
      'update_profile',
      'admin_action',
      'suspend_user',
      'activate_user',
      'verify_review',
      'hide_review',
      'show_review'
    ]
  },
  entityType: {
    type: String,
    enum: ['user', 'case', 'review', 'blog', 'booking', 'document', 'system'],
    default: 'system'
  },
  entityId: {
    type: ObjectId,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

module.exports = ActivityLog;

