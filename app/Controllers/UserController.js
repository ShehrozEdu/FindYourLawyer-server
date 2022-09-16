const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const token = require("../Config/token");
const isValid = require("../../utils/isValid");
const expressAsyncHandler = require("express-async-handler");
const UserController = {
  signup: expressAsyncHandler(async (req, res) => {
    let data = req.body;
    let pass = data.Password;
    let saltRounds = 10;
    try {
      let salt = await bcrypt.genSalt(saltRounds);
      let hashPassword = await bcrypt.hash(pass, salt);
      //Creating Users Instance
      const newUser = new UsersModel({
        FirstName: data.FirstName ? data.FirstName : undefined,
        LastName: data.LastName ? data.LastName : undefined,
        Email: data.Email,
        Password: hashPassword,
        // ContactNo: data.ContactNo,
      });

      // check if there is an existing email
      let result = await UsersModel.findOne({ Email: data.Email });

      if (result) {
        res.status(200).send({
          status: false,
          message: "Email already exists, use other one",
        });
      } else {
        let saveResult = await newUser.save();
        res.status(200).send({
          status: true,
          result: saveResult,
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  login: expressAsyncHandler(async (req, res) => {
    let data = req.body;
    try {
      let result = await UsersModel.findOne({
        Email: data.Email,
      });
      if (result) {
        let matchPass = await bcrypt.compare(data.Password, result.Password);

        if (matchPass) {
          let { _id, Email, FirstName, LastName, isLawyer } = result;
          res.status(200).send({
            status: true,
            result: {
              _id,
              Email,
              FirstName,
              LastName,
              token: token(result?._id),
              isLawyer,
            },
            message: "Login successfully !!!",
          });
        } else {
          res.status(200).send({
            status: false,
            message: "Password is wrong.",
          });
        }
      } else {
        res.status(200).send({
          status: false,
          message: "Username is wrong.",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  fetchall: expressAsyncHandler(async (req, res) => {
    try {
      const users = await UsersModel.find({});
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),

  userDelete: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //Validation of ID check, else gives error
    isValid(id);
    try {
      const deleteUser = await UsersModel.findByIdAndDelete(id);
      res.status(200).send(deleteUser);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
  updateUser: expressAsyncHandler(async (req, res) => {
    const { _id } = req?.user;

    isValid(_id);

    try {
      const user = await UsersModel.findByIdAndUpdate(
        _id,
        {
          FirstName: req?.body?.FirstName,
          LastName: req?.body?.LastName,
          Email: req?.body?.Email,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }),
};
module.exports = UserController;
