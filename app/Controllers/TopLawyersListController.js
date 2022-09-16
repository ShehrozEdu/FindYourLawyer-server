const expressAsyncHandler = require("express-async-handler");
const TopLawyersListModel = require("../Models/TopLawyers");
const TopLawyers = require("../Resources/TopLawyersList.json");

const TopLawyersListController = {
  getTopLawyersList: expressAsyncHandler(async function (req, res) {
    try {
      let result = await TopLawyersListModel.find();
      res.status(200).send({
        status: true,
        TopLawyers: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addTopLawyersList: expressAsyncHandler(async function (req, res) {
    try {
      let result = await TopLawyersListModel.insertMany(TopLawyers);
      res.status(200).send({
        status: true,
        message: "News added successfully",
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

module.exports = TopLawyersListController;
