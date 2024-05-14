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
    isLawyer: {
      type: Boolean,
    },
    token: {
      type: String,
    },

    FeePerCase: {
      type: Number,
      required: function () {
        return this.isLawyer === true;
      },
    },
    ContactNumber: {
      type: Number,
      required: function () {
        return this.isLawyer === true;
      },
    },
    Expertise: {
      type: String,
      required: function () {
        return this.isLawyer === true;
      },
    },
    State: {
      type: String,
      required: function () {
        return this.isLawyer === true;
      },
    },
 
  },
  {
    timestamps: true,
  }
);

const UsersModel = mongoose.model("user", UsersSchema);

module.exports = UsersModel;
