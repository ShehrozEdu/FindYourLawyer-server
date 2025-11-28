const expressAsyncHandler = require("express-async-handler");
const UsersModel = require("../Models/UsersModel");

const LawyersListController = {
  getLawyersByExpertise: expressAsyncHandler(async function (req, res) {
    try {
      const { expertise, search, page = 1, limit = 9 } = req.query;
      
      // Parse pagination parameters
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 9;
      const skip = (pageNum - 1) * limitNum;

      // Build query
      let query = { isLawyer: true };

      // Add expertise filter if provided
      if (expertise) {
        const expertiseRegex = new RegExp(expertise, "i");
        query.Expertise = { $regex: expertiseRegex };
      }

      // Add search filter if provided (searches name, expertise, state)
      if (search) {
        const searchRegex = new RegExp(search, "i");
        query.$or = [
          { FirstName: { $regex: searchRegex } },
          { LastName: { $regex: searchRegex } },
          { Expertise: { $regex: searchRegex } },
          { State: { $regex: searchRegex } }
        ];
      }

      // Get total count for pagination
      const totalCount = await UsersModel.countDocuments(query);
      
      // Get paginated results
      const lawyers = await UsersModel.find(query)
        .select('-Password -token') // Exclude sensitive fields
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }); // Sort by newest first

      const totalPages = Math.ceil(totalCount / limitNum);

      res.status(200).send({
        status: true,
        lawyers,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }),
};

module.exports = LawyersListController;
