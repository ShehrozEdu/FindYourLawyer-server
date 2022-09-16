const expressAsyncHandler = require("express-async-handler");
const NewsModel = require("../Models/NewsModel");
const News = require("../Resources/News.json");

const NewsController = {
  getNews: expressAsyncHandler(async function (req, res) {
    try {
      let result = await NewsModel.find();
      res.status(200).send({
        status: true,
        News: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addNews: expressAsyncHandler(async function (req, res) {
    try {
      let result = await NewsModel.insertMany(News);
      res.status(200).send({
        status: true,
        message: "News added successfully",
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

module.exports = NewsController;
