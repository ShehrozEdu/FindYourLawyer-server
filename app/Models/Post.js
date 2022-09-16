const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Author is required"],
    },

    description: {
      type: String,
      required: [true, "description is required"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/06/09/22/56/lady-justice-2388500_960_720.jpg",
    },
  },
  {
    toJSOn: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
