const express = require("express");
const OtherRouters = express.Router();
const BooksController = require("../Controllers/BooksController");
const ServicesController = require("../Controllers/ServicesController");
const TestimonialsController = require("../Controllers/TestimonialsController");
const PracticeController = require("../Controllers/PracticeController");
const NewsController = require("../Controllers/NewsController");
const TopLawyersListController = require("../Controllers/TopLawyersListController");
const LawyersListController = require("../Controllers/LawyersListControllers");
const ArticleController = require("../Controllers/ArticleController");
const PaymentController = require("../Controllers/PaymentController");

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
OtherRouters.post("/add-LawyersList", LawyersListController.addLawyersList);
OtherRouters.get("/lawyersList", LawyersListController.getLawyersList);

//article
OtherRouters.post("/add-blogs", ArticleController.addArticle);
OtherRouters.get("/blogs", ArticleController.getArticle);

//CONTact
OtherRouters.post("/payment", PaymentController.payment); // react
OtherRouters.post("/callback", PaymentController.callback); // react

module.exports = OtherRouters;
