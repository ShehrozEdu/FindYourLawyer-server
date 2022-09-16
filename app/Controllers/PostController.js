const expressAsyncHandler = require("express-async-handler");
const PostModel = require("../Models/Post");
const isValid = require("../../utils/isValid");
// const { rawListeners } = require("../Models/Post");

const PostController = {
  CreatePost: expressAsyncHandler(async (req, res) => {
    isValid(req.body.user);
    try {
      const post = await PostModel.create(req.body);
      res.status(200).send(post);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
  AllPosts: expressAsyncHandler(async (req, res) => {
    try {
      const posts = await PostModel.find({}).populate("user");
      res.status(200).send(posts);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  UpdatePost: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    isValid(id);

    try {
      const post = await PostModel.findByIdAndUpdate(
        id,
        {
          title: req.body.title,
          description: req.body.description,
          user: req?.user?._id,
        },
        {
          new: true,
        }
      );
      console.log(post);
      res.status(200).send(post);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  DeletePost: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //Validation of ID check, else gives error
    isValid(id);
    try {
      const deleteUser = await PostModel.findOneAndDelete(id);
      res.status(200).send(deleteUser);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
};

module.exports = PostController;
