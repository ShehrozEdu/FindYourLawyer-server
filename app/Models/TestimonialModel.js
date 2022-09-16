const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestimonialSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  position: {
    type: String,
    required: [true, "Position is required"],
  },
  description: {
    type: String,
  },
  image: { type: String },
});

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

module.exports = Testimonial;
