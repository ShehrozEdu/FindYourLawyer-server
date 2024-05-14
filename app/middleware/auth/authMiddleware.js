const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UsersModel = require("../../Models/UsersModel");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await UsersModel.findById(decoded?.id).select("-password");
        
        if (user) {
          req.user = user;
          next();
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Invalid token");
      }
    } else {
      throw new Error("Authorization header missing or invalid");
    }
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
});

module.exports = authMiddleware;
