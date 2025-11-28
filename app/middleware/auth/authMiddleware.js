const jwt = require("jsonwebtoken");
const UsersModel = require("../../Models/UsersModel");

const authMiddleware = async (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Not authorized, no token provided"
      });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        status: false,
        message: "Not authorized, invalid token"
      });
    }

    // Get user from database (exclude password)
    const user = await UsersModel.findById(decoded.id).select("-Password");

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Not authorized, user not found"
      });
    }

    // Attach decoded user info to request
    req.user = {
      _id: user._id,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      isLawyer: user.isLawyer,
      isAdmin: user.isAdmin || false,
      isSuperAdmin: user.isSuperAdmin || false,
      ContactNumber: user.ContactNumber,
      Expertise: user.Expertise,
      State: user.State,
      FeePerCase: user.FeePerCase,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: "Not authorized, token expired"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: "Not authorized, invalid token"
      });
    }

    return res.status(401).json({
      status: false,
      message: "Not authorized, token invalid or expired"
    });
  }
};

module.exports = authMiddleware;
