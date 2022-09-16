const expressAsyncHandler = require("express-async-handler");
const LawyersModel = require("../Models/LawyersListModel");
const Lawyers = require("../Resources/LawyersList.json");

const LawyersListController = {
  getLawyersList: expressAsyncHandler(async function (req, res) {
    let id = req.query.lid;
    id = id ? id : 0;
    try {
      let result = await LawyersModel.find({ practiceId: id });
      res.status(200).send({
        status: true,
        LawyersList: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addLawyersList: expressAsyncHandler(async function (req, res) {
    try {
      let result = await LawyersModel.insertMany(Lawyers);
      res.status(200).send({
        status: true,
        message: "LawyersList added successfully",
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

module.exports = LawyersListController;
