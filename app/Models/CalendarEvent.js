const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CalendarEventSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  lawyer: { 
    type: ObjectId, 
    ref: "user",
    required: true 
  },
  client: { 
    type: ObjectId, 
    ref: "user",
    default: null
  },
  case: { 
    type: ObjectId, 
    ref: "casesLawyer",
    default: null
  },
  type: { 
    type: String, 
    enum: ['consultation', 'meeting', 'court_hearing', 'availability', 'other'],
    default: 'consultation'
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  location: { 
    type: String, 
    default: "" 
  },
  notes: { 
    type: String, 
    default: "" 
  },
  reminderSent: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Index for efficient queries
CalendarEventSchema.index({ lawyer: 1, startTime: 1 });
CalendarEventSchema.index({ client: 1, startTime: 1 });
CalendarEventSchema.index({ startTime: 1, endTime: 1 });

const CalendarEvent = mongoose.model("CalendarEvent", CalendarEventSchema);

module.exports = CalendarEvent;

