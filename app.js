require("dotenv").config();
const Razorpay = require("razorpay");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const UserRouter = require("./app/Routes/Userrouter");
// const PostRouter = require("./app/Routes/PostRouter");
const Routers = require("./app/Routes/OtherRouters");
const razor = require("./app/Controllers/Payment");
// const nodemailer = require("nodemailer");
const {
  errorHandler,
  notFound,
} = require("./app/middleware/error/ErrorHandling");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors
app.use(cors());

//other Router
app.use("/api", Routers);

//Err Handler
app.use(errorHandler);
app.use(notFound);
//Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Connected to PORT 5000");
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
