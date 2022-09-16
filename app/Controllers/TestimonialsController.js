const expressAsyncHandler = require("express-async-handler");
const TestimonialModel = require("../Models/TestimonialModel");
const Testimonial = require("../Resources/Testimonial.json");

const TestimonialController = {
  getTestimonials: expressAsyncHandler(async function (req, res) {
    try {
      let result = await TestimonialModel.find();
      res.status(200).send({
        status: true,
        Testimonials: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addTestimonials: expressAsyncHandler(async function (req, res) {
    try {
      let result = await TestimonialModel.insertMany(Testimonial);
      res.status(200).send({
        status: true,
        message: "Testimonials added successfully",
        result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
};

module.exports = TestimonialController;
