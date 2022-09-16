const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },

  subtitle: {
    type: String,
    required: [true, "subtitle is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  services_no: {
    type: Number,
  },
});

const Services = mongoose.model("Service", ServicesSchema);

module.exports = Services;
