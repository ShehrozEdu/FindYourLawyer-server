const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ReviewSchema = new Schema({
  lawyer: { 
    type: ObjectId, 
    ref: "user",
    required: true 
  },
  client: { 
    type: ObjectId, 
    ref: "user",
    required: true 
  },
  case: { 
    type: ObjectId, 
    ref: "casesLawyer",
    default: null
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  title: { 
    type: String, 
    default: "" 
  },
  comment: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  lawyerResponse: {
    response: { type: String, default: "" },
    respondedAt: { type: Date, default: null }
  },
  isVisible: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Index for efficient queries
ReviewSchema.index({ lawyer: 1, createdAt: -1 });
ReviewSchema.index({ client: 1 });
ReviewSchema.index({ case: 1 });

// Prevent duplicate reviews for the same case
ReviewSchema.index({ case: 1, client: 1 }, { unique: true, sparse: true });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;

