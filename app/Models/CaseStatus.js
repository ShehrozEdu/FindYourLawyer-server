const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CaseStatusSchema = new Schema({
  case: { 
    type: ObjectId, 
    ref: "casesLawyer",
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    required: true 
  },
  updatedBy: { 
    type: ObjectId, 
    ref: "user",
    required: true 
  },
  notes: { 
    type: String,
    default: ""
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const CaseStatus = mongoose.model("CaseStatus", CaseStatusSchema);

module.exports = CaseStatus;

