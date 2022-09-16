const express = require("express");
const UserRouter = express.Router();
const UserController = require("../Controllers/UserController");
const authMiddleware = require("../middleware/auth/authMiddleware");

// UserRouter.get("/");

//Users
UserRouter.post("/signup", UserController.signup);
UserRouter.post("/login", UserController.login);
UserRouter.get("/all", authMiddleware, UserController.fetchall);
UserRouter.delete("/:id", UserController.userDelete);
UserRouter.put("/", authMiddleware, UserController.updateUser);

module.exports = UserRouter;
