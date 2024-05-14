const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // This should match the name you used when creating the Lawyer model
  },
  createdAt: {
    type: Date,
    default: Date.now
}
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
