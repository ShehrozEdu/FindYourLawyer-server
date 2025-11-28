const ApiError = require("./ApiError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status: status,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = { errorHandler, notFound };
