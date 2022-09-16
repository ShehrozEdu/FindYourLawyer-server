const expressAsyncHandler = require("express-async-handler");
const BooksModel = require("../Models/BooksModel");
const books = require("../Resources/Books.json");

const BooksController = {
  getBooks: expressAsyncHandler(async function (req, res) {
    try {
      let result = await BooksModel.find();
      res.status(200).send({
        status: true,
        books: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  addBooks: expressAsyncHandler(async function (req, res) {
    try {
      let result = await BooksModel.insertMany(books);
      res.status(200).send({
        status: true,
        message: "Books added successfully",
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

module.exports = BooksController;
