const express = require("express");
const UserRouter = express.Router();
const UserController = require("../Controllers/UserController");
const authMiddleware = require("../middleware/auth/authMiddleware");
const validate = require("../middleware/validation/validate");
const { signupSchema, loginSchema, updateUserSchema } = require("../middleware/validation/userValidation");

// Users
UserRouter.post("/signup", validate(signupSchema), UserController.signup);
UserRouter.post("/login", validate(loginSchema), UserController.login);
UserRouter.post("/logout", UserController.logout);
UserRouter.get("/me", authMiddleware, (req, res) => {
    // Return user info from decoded JWT (already sanitized in middleware)
    res.status(200).send({ 
        status: true, 
        user: req.user 
    });
});
UserRouter.get("/all", authMiddleware, UserController.fetchall);
UserRouter.get("/:id", authMiddleware, UserController.fetchUserById);
UserRouter.delete("/:id", UserController.userDelete);
UserRouter.put("/", authMiddleware, validate(updateUserSchema), UserController.updateUser);

module.exports = UserRouter;
