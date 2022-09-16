const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },

  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Article = mongoose.model("article", ArticleSchema);

module.exports = Article;
