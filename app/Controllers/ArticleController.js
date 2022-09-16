const expressAsyncHandler = require("express-async-handler");
const ArticleModel = require("../Models/ArticleContentModel");
const article = require("../Resources/Article.json");

const ArticleController = {
  getArticle: expressAsyncHandler(async function (req, res) {
    try {
      let result = await ArticleModel.find();
      res.status(200).send({
        status: true,
        Article: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addArticle: expressAsyncHandler(async function (req, res) {
    try {
      let result = await ArticleModel.insertMany(article);
      res.status(200).send({
        status: true,
        message: "article added successfully",
        result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
};

module.exports = ArticleController;
