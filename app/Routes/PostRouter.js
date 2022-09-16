const express = require("express");
const PostRouter = express.Router();
const PostController = require("../Controllers/PostController");
const authMiddleware = require("../middleware/auth/authMiddleware");

//POST
PostRouter.post("/", authMiddleware, PostController.CreatePost);
PostRouter.get("/", PostController.AllPosts);
PostRouter.put("/:id", authMiddleware, PostController.UpdatePost);
PostRouter.delete("/:id", authMiddleware, PostController.DeletePost);

module.exports = PostRouter;
