const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const DocumentSchema = new Schema({
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String, 
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number, 
    required: true 
  },
  mimeType: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: ObjectId, 
    ref: "user",
    required: true 
  },
  case: { 
    type: ObjectId, 
    ref: "casesLawyer",
    default: null
  },
  category: { 
    type: String, 
    enum: ['contract', 'evidence', 'correspondence', 'court_document', 'invoice', 'other'],
    default: 'other'
  },
  description: { 
    type: String, 
    default: "" 
  },
  tags: [{ 
    type: String 
  }],
  isShared: { 
    type: Boolean, 
    default: false 
  },
  sharedWith: [{ 
    type: ObjectId, 
    ref: "user" 
  }]
}, {
  timestamps: true
});

// Index for efficient queries
DocumentSchema.index({ case: 1, uploadedBy: 1 });
DocumentSchema.index({ uploadedBy: 1, createdAt: -1 });

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;

