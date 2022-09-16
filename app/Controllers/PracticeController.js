const expressAsyncHandler = require("express-async-handler");
const PracticeModel = require("../Models/PracticeModel");
const Practice = require("../Resources/Practice.json");

const PracticeController = {
  getPractice: expressAsyncHandler(async function (req, res) {
    // let { page, itemsPerPage } = req.body;
    // page = page ? page : 1;
    // itemsPerPage = itemsPerPage ? itemsPerPage : 3;

    // let startingIndex = page * itemsPerPage - itemsPerPage; //0
    // let lastIndex = page * itemsPerPage; // 3
    try {
      let result = await PracticeModel.find();
      // const pageResult = result.slice(startingIndex, lastIndex);
      res.status(200).send({
        status: true,
        Practice: result,
        // pageCount: Math.ceil(result.length / 2), //gives a round number
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
  getPracticeById: async function (req, res) {
    try {
      let { id } = req.params;
      let result = await PracticeModel.findById(id);

      res.status(200).send({
        status: true,
        Practice: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },

  addPractice: expressAsyncHandler(async function (req, res) {
    try {
      let result = await PracticeModel.insertMany(Practice);
      res.status(200).send({
        status: true,
        message: "Practices added successfully",
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

  getLocationByPracticeName: async (req, res) => {
    let { title } = req.query;
    try {
      let result = await PracticeModel.find({
        title: { $regex: title + ".*", $options: "i" },
      });
      res.status(200).send({
        status: true,
        practice: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
};

module.exports = PracticeController;
