const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    FirstName: {
      type: String,
    },
    LastName: {
      type: String,
    },
    Email: {
      type: String,
      required: [true, "Email is required"],
    },
    Password: {
      type: String,
      required: true,
    },
    // ContactNo: {
    //   type: Number,
    //   required: true,
    // },
    isLawyer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UsersModel = mongoose.model("user", UsersSchema);

module.exports = UsersModel;
