const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LawyerDashboardSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: "user" },
  lawyer: { type: Schema.Types.ObjectId, ref: "user" },
  description: String,
  clientName: String,
  consultationDate: Date, // New field for consultation date
  income: Number,
});

const LawyerDashboard = mongoose.model("casesLawyer", LawyerDashboardSchema);

module.exports = LawyerDashboard;
