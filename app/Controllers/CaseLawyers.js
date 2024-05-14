
const CasesLawyers = require("../models/CasesLawyers");

const CaseLawyers = {
    getAllCasesLawyers: async (req, res) => {
        try {
            const casesLawyers = await CasesLawyers.find({});
            res.json({ status: "success", casesLawyers: casesLawyers });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getCasesByLawyerId: async (req, res) => {
        try {
            const { lawyerId } = req.params;
            // console.log("Lawyer ID:", lawyerId);
            const casesLawyers = await CasesLawyers.find({ lawyer: lawyerId });
            res.json({ status: "success", casesLawyers: casesLawyers });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = CaseLawyers;
