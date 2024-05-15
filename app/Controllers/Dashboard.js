const expressAsyncHandler = require("express-async-handler");
const LawyerDashboard = require("../Models/LawyerDashboard");
const UsersModel = require("../Models/UsersModel");

const Dashboard = {
  createRequest: expressAsyncHandler(async function (req, res) {
    try {
      const { clientId, lawyerId, description, clientName } = req.body;

      // Fetch the lawyer's information
      const lawyer = await UsersModel.findById(lawyerId);

      if (!lawyer || !lawyer.isLawyer) {
        return res.status(404).json({ error: "Lawyer not found" });
      }

      // Retrieve the fee per case from the lawyer's data
      const feePerCase = lawyer.FeePerCase;

      // Set the income of the case request to be the fee per case
      const caseRequest = new LawyerDashboard({
        client: clientId,
        clientName: clientName,
        lawyer: lawyerId,
        description: description,
        income: feePerCase, // Modified income to be fee per case
      });

      await caseRequest.save();

      res.status(201).json({
        message: "Case request created successfully",
        description: caseRequest.description,
        clientName: caseRequest.clientName,
        income: caseRequest.income,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }),
};

module.exports = Dashboard;
