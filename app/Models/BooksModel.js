const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BooksSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },

  author: {
    type: String,
    required: [true, "Author is required"],
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});

const Books = mongoose.model("books", BooksSchema);

module.exports = Books;
