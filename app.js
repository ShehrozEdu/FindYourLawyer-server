require("dotenv").config();
const Razorpay = require("razorpay");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRouter = require("./app/Routes/Userrouter");
const PostRouter = require("./app/Routes/PostRouter");
const OtherRouters = require("./app/Routes/OtherRouters");

// const nodemailer = require("nodemailer");
const {
  errorHandler,
  notFound,
} = require("./app/middleware/error/ErrorHandling");

const app = express();
// const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors
app.use(cors());

//RAZORPAY

//user Router
app.use("/api/users", UserRouter);

//post Router
app.use("/api/posts", PostRouter);

//other Router
app.use("/api", OtherRouters);

//Err Handler
app.use(errorHandler);
app.use(notFound);
//Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to PORT 5000");
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
