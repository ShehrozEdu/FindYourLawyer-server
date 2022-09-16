const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },

  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  content: {
    type: String,
  },
});

const News = mongoose.model("new", NewsSchema);

module.exports = News;
