const express = require("express");
const AdminRouter = express.Router();
const AdminController = require("../Controllers/AdminController");
const ActivityLogController = require("../Controllers/ActivityLogController");
const AdminContentController = require("../Controllers/AdminContentController");
const { adminMiddleware } = require("../middleware/auth/adminMiddleware");

// Dashboard Statistics
AdminRouter.get("/dashboard/stats", adminMiddleware, AdminController.getDashboardStats);

// User Management
AdminRouter.get("/users", adminMiddleware, AdminController.getUsers);
AdminRouter.put("/users/:userId/status", adminMiddleware, AdminController.updateUserStatus);

// Case Management
AdminRouter.get("/cases", adminMiddleware, AdminController.getCases);
AdminRouter.put("/cases/:caseId/status", adminMiddleware, AdminController.updateCaseStatus);

// Review Management
AdminRouter.get("/reviews", adminMiddleware, AdminController.getReviews);
AdminRouter.put("/reviews/:reviewId", adminMiddleware, AdminController.updateReview);
AdminRouter.delete("/reviews/:reviewId", adminMiddleware, AdminController.deleteReview);

// Activity Logs
AdminRouter.get("/activity-logs", adminMiddleware, ActivityLogController.getActivityLogs);

// Content Management
AdminRouter.get("/blogs", adminMiddleware, AdminContentController.getBlogs);
AdminRouter.delete("/blogs/:blogId", adminMiddleware, AdminContentController.deleteBlog);
AdminRouter.get("/books", adminMiddleware, AdminContentController.getBooks);
AdminRouter.post("/books", adminMiddleware, AdminContentController.createBook);
AdminRouter.put("/books/:bookId", adminMiddleware, AdminContentController.updateBook);
AdminRouter.delete("/books/:bookId", adminMiddleware, AdminContentController.deleteBook);

module.exports = AdminRouter;

