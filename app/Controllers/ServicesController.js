const expressAsyncHandler = require("express-async-handler");
const ServicesModel = require("../Models/ServiceModel");
const Services = require("../Resources/Services.json");

const ServiceController = {
  getServices: expressAsyncHandler(async function (req, res) {
    try {
      let result = await ServicesModel.find();
      res.status(200).send({
        status: true,
        Services: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addServices: expressAsyncHandler(async function (req, res) {
    try {
      let result = await ServicesModel.insertMany(Services);
      res.status(200).send({
        status: true,
        message: "Services added successfully",
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

module.exports = ServiceController;
