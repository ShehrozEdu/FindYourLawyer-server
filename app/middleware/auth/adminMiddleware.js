const authMiddleware = require("./authMiddleware");

const adminMiddleware = (req, res, next) => {
  // First run auth middleware
  authMiddleware(req, res, () => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: "Not authorized, authentication required"
      });
    }

    // Check if user is admin or super admin
    if (!req.user.isAdmin && !req.user.isSuperAdmin) {
      return res.status(403).json({
        status: false,
        message: "Access denied. Admin privileges required."
      });
    }

    next();
  });
};

const superAdminMiddleware = (req, res, next) => {
  // First run auth middleware
  authMiddleware(req, res, () => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: "Not authorized, authentication required"
      });
    }

    // Check if user is super admin
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({
        status: false,
        message: "Access denied. Super admin privileges required."
      });
    }

    next();
  });
};

module.exports = { adminMiddleware, superAdminMiddleware };

