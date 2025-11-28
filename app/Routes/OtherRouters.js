const express = require("express");
const OtherRouters = express.Router();
const BooksController = require("../Controllers/BooksController");
const ServicesController = require("../Controllers/ServicesController");
const TestimonialsController = require("../Controllers/TestimonialsController");
const PracticeController = require("../Controllers/PracticeController");
const NewsController = require("../Controllers/NewsController");
const TopLawyersListController = require("../Controllers/TopLawyersListController");
const LawyersListController = require("../Controllers/LawyersListControllers");
const PaymentController = require("../Controllers/PaymentController");
const Dashboard = require("../Controllers/Dashboard");
const CaseLawyers = require("../Controllers/CaseLawyers");
const BlogController = require("../Controllers/BlogController");
const CaseStatusController = require("../Controllers/CaseStatusController");
const AnalyticsController = require("../Controllers/AnalyticsController");
const NotificationController = require("../Controllers/NotificationController");
const CalendarController = require("../Controllers/CalendarController");
const DocumentController = require("../Controllers/DocumentController");
const ReviewController = require("../Controllers/ReviewController");
const authMiddleware = require("../middleware/auth/authMiddleware");

//Books
OtherRouters.post("/add-books", BooksController.addBooks);
OtherRouters.get("/books", BooksController.getBooks);

//Services
OtherRouters.post("/add-services", ServicesController.addServices);
OtherRouters.get("/services", ServicesController.getServices);

//Testimonial
OtherRouters.post("/add-testimonials", TestimonialsController.addTestimonials);
OtherRouters.get("/testimonials", TestimonialsController.getTestimonials);

//Practice
OtherRouters.post("/add-practices", PracticeController.addPractice);
OtherRouters.get("/practices", PracticeController.getPractice);
OtherRouters.get("/getpracticebyid/:id", PracticeController.getPracticeById);

//News
OtherRouters.post("/add-news", NewsController.addNews);
OtherRouters.get("/news", NewsController.getNews);

//TopLawyers
OtherRouters.post(
  "/add-topLawyers",
  TopLawyersListController.addTopLawyersList
);
OtherRouters.get("/topLawyers", TopLawyersListController.getTopLawyersList);

//LawyersList
// OtherRouters.post("/add-LawyersList", LawyersListController.addLawyersList);
OtherRouters.get("/lawyersListExpertise", LawyersListController.getLawyersByExpertise);




//Cases
OtherRouters.get("/all-cases", CaseLawyers.getAllCasesLawyers);
OtherRouters.get("/my-cases/:lawyerId", CaseLawyers.getCasesByLawyerId);
OtherRouters.post("/case-requests/create", authMiddleware, Dashboard.createRequest);

//Case Status Management
OtherRouters.put("/cases/:caseId/status", authMiddleware, CaseStatusController.updateCaseStatus);
OtherRouters.get("/cases/:caseId/status-history", authMiddleware, CaseStatusController.getCaseStatusHistory);
OtherRouters.get("/cases", authMiddleware, CaseStatusController.getCasesByStatus);

//Analytics
OtherRouters.get("/dashboard/analytics/:lawyerId", authMiddleware, AnalyticsController.getAnalytics);

//Notifications
OtherRouters.get("/notifications", authMiddleware, NotificationController.getNotifications);
OtherRouters.put("/notifications/:notificationId/read", authMiddleware, NotificationController.markAsRead);
OtherRouters.put("/notifications/read-all", authMiddleware, NotificationController.markAllAsRead);
OtherRouters.delete("/notifications/:notificationId", authMiddleware, NotificationController.deleteNotification);

//Calendar
OtherRouters.get("/calendar/events", authMiddleware, CalendarController.getEvents);
OtherRouters.post("/calendar/events", authMiddleware, CalendarController.createEvent);
OtherRouters.put("/calendar/events/:eventId", authMiddleware, CalendarController.updateEvent);
OtherRouters.delete("/calendar/events/:eventId", authMiddleware, CalendarController.deleteEvent);
OtherRouters.get("/calendar/availability/:lawyerId", CalendarController.getAvailability);

//Documents
OtherRouters.post("/documents/upload", authMiddleware, DocumentController.uploadMiddleware, DocumentController.uploadDocument);
OtherRouters.get("/documents", authMiddleware, DocumentController.getDocuments);
OtherRouters.get("/documents/:documentId/download", authMiddleware, DocumentController.downloadDocument);
OtherRouters.put("/documents/:documentId", authMiddleware, DocumentController.updateDocument);
OtherRouters.delete("/documents/:documentId", authMiddleware, DocumentController.deleteDocument);

//Reviews
OtherRouters.post("/reviews", authMiddleware, ReviewController.createReview);
OtherRouters.get("/reviews/lawyer/:lawyerId", ReviewController.getLawyerReviews);
OtherRouters.get("/reviews/my-reviews", authMiddleware, ReviewController.getUserReviews);
OtherRouters.put("/reviews/:reviewId/respond", authMiddleware, ReviewController.respondToReview);


//Blogs
OtherRouters.post("/blogs/create-blog", BlogController.create);
OtherRouters.get("/all-blogs", BlogController.getAll);
OtherRouters.get("/all-blogs/:blogId", BlogController.getById);
OtherRouters.put("/all-blogs/:blogId", BlogController.update);
OtherRouters.delete("/all-blogs/:blogId", BlogController.delete);


//CONTact
OtherRouters.post("/payment", PaymentController.payment); // react
OtherRouters.post("/callback", PaymentController.callback); // react


module.exports = OtherRouters;
