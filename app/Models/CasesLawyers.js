// models/casesLawyers.js

const mongoose = require("mongoose");

const casesLawyersSchema = new mongoose.Schema({
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

module.exports = mongoose.model("CasesLawyers", casesLawyersSchema);
