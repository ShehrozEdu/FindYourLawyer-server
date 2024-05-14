const expressAsyncHandler = require("express-async-handler");
const LawyerDashboard = require("../Models/LawyerDashboard");
// const article = require("../Resources/Article.json");

const Dashboard = {
  createRequest: expressAsyncHandler(async function (req, res) {
    try {
      const { clientId, lawyerId, description,income,clientName } = req.body;
      

      const caseRequest = new LawyerDashboard({
        client: clientId,
        clientName:clientName,
        lawyer: lawyerId,
        description: description,
        income: income
      });

      await caseRequest.save();
      
      res
        .status(201)
        .json({
          message: "Case request created successfully",
          description: caseRequest.description,
          clientName:caseRequest.clientName,
          income: income&&caseRequest.income,
        });

    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }),
};

module.exports = Dashboard;
