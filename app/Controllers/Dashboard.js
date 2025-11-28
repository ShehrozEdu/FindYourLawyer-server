const expressAsyncHandler = require("express-async-handler");
const LawyerDashboard = require("../Models/LawyerDashboard");
const UsersModel = require("../Models/UsersModel");
const NotificationController = require("./NotificationController");

const Dashboard = {
  createRequest: expressAsyncHandler(async function (req, res) {
    try {
      const { clientId, lawyerId, description, clientName, consultationDate } = req.body;

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
        consultationDate: new Date(consultationDate)
      });

      await caseRequest.save();

      // Create notifications for both client and lawyer
      await NotificationController.createNotification(
        clientId,
        'case_created',
        'Case Request Submitted',
        `Your case request has been submitted successfully.`,
        caseRequest._id
      );

      await NotificationController.createNotification(
        lawyerId,
        'case_created',
        'New Case Request',
        `You have a new case request from ${clientName}.`,
        caseRequest._id
      );

      res.status(201).json({
        status: true,
        message: "Case request created successfully",
        case: {
          _id: caseRequest._id,
          description: caseRequest.description,
          clientName: caseRequest.clientName,
          income: caseRequest.income,
          consultationDate: caseRequest.consultationDate,
          status: caseRequest.status,
          client: caseRequest.client,
          lawyer: caseRequest.lawyer
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }),
};

module.exports = Dashboard;
