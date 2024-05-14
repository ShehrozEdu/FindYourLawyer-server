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

      // Generate JWT token
      const authToken = token(data._id); // Assuming _id is present in req.body

      const newUser = new UsersModel({
        FirstName: data.FirstName ? data.FirstName : undefined,
        LastName: data.LastName ? data.LastName : undefined,
        Email: data.Email,
        Password: hashPassword,
        token: authToken,
        FeePerCase: data.FeePerCase,
        Expertise: data.Expertise,
        ContactNumber: data.ContactNumber,
        isLawyer: data.isLawyer !== undefined ? data.isLawyer : false,
        State: data.State ? data.State : undefined,
      });

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
    const data = req.body;
    try {
      const result = await UsersModel.findOne({
        Email: data.Email,
      });
      if (result) {
        const matchPass = await bcrypt.compare(data.Password, result.Password);
        if (matchPass) {
          const { _id, Email, FirstName, LastName, isLawyer } = result;
          const authToken = token(_id); // Assuming token function generates a JWT token
          res.status(200).send({
            status: true,
            result: {
              _id,
              Email,
              FirstName,
              LastName,
              token: authToken,
              isLawyer,
            },
            message: "Login successful.",
          });
        } else {
          // Password mismatch
          res.status(401).send({
            status: false,
            message: "Invalid email or password.",
          });
        }
      } else {
        // User not found
        res.status(401).send({
          status: false,
          message: "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({
        status: false,
        message: "Server error.",
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
  fetchUserById: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const user = await UsersModel.findById(id);
      if (!user) {
        return res.status(404).send({
          status: false,
          message: "User not found",
        });
      }

      res.status(200).send({
        status: true,
        user,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Server error",
        error,
      });
    }
  }),
};
module.exports = UserController;
