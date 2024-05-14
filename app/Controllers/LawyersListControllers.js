const expressAsyncHandler = require("express-async-handler");
const UsersModel = require("../Models/UsersModel");

const LawyersListController = {
  getLawyersByExpertise: expressAsyncHandler(async function (req, res) {
    try {
      const { expertise } = req.query;

      const expertiseRegex = new RegExp(expertise, "i");
      const lawyers = await UsersModel.find({ isLawyer: true, Expertise: { $regex: expertiseRegex } });

      res.status(200).send({
        status: true,
        length:lawyers.length,
        lawyers,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Server error",
        error,
      });
    }
  }),
};

module.exports = LawyersListController;
