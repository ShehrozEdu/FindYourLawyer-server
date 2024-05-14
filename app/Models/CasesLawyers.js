// models/casesLawyers.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const casesLawyersSchema = new Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the User model
  },
  clientName: String,
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the User model
  },
  description: String,
  income: Number,
});

const CasesLawyer = mongoose.model("CasesLawyers", casesLawyersSchema);
module.exports = CasesLawyer;
