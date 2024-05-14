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
OtherRouters.post("/case-requests/create", Dashboard.createRequest);


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
