import Bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { HttpStatus, Response } from "../helpers/Response.js";
import userModel from "../models/userModel.js";

// user register
const registerUser = async (req, res) => {
  try {
    const newUser = req.body;
    const reqEmail = req.body.email;
    const findEMail = await userModel.findOne({ email: reqEmail });
    if (findEMail) {
      return res
        .status(HttpStatus.ALREADY_EXISTS.code)
        .json(
          new Response(
            HttpStatus.ALREADY_EXISTS.code,
            HttpStatus.ALREADY_EXISTS.status,
            "Email alreday Exists"
          )
        );
    } else {
      const saveUser = new userModel(newUser);
      // generate salt to hash password
      const salt = await Bcrypt.genSalt(10);
      // now we set user password to hashed password
      saveUser.password = await Bcrypt.hash(saveUser.password, salt);
      await saveUser
        .save()
        .then((response) => {
          const { password, ...otherData } = response._doc;
          return res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.CREATED.code,
                HttpStatus.CREATED.status,
                "User Created",
                otherData
              )
            );
        })
        .catch((err) => {
          return res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.status,
                err.message
              )
            );
        });
    }
  } catch (error) {
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(HttpStatus.OK.code, HttpStatus.OK.status, error.message)
      );
  }
};

// user login
const loginUser = async (req, res) => {
  try {
    const body = req.body;
    const reqEmail = req.body.email;
    const checkUser = await userModel.findOne({ email: reqEmail });
    console.log("rrrrrr", checkUser, process.env.JWT_SECRET);
    if (checkUser) {
      const validPassword = await Bcrypt.compare(
        body.password,
        checkUser.password
      );
      if (validPassword) {
        const { password, ...others } = checkUser._doc;
        const token = JWT.sign({ _id: others._id }, process.env.JWT_SECRET);
        const data = { ...others, token };

        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "login successful",
              data
            )
          );
      } else {
        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "Invalid Credentials"
            )
          );
      }
    } else {
      return res
        .status(HttpStatus.OK.code)
        .json(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            "Invalid Credentials"
          )
        );
    }
  } catch (error) {
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(HttpStatus.OK.code, HttpStatus.OK.status, error.message)
      );
  }
};

// get user data
const getUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;
    //console.log("yyy", req.params.id);
    await userModel
      .findOne({ _id: userId })
      .then((resp) => {
        const { password, ...others } = resp._doc;
        return res.status(HttpStatus.OK.code).json(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,

            "user found",
            others
          )
        );
      })
      .catch((error) => {
        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              error.message
            )
          );
      });
  } catch (error) {
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(HttpStatus.OK.code, HttpStatus.OK.status, error.message)
      );
  }
};
export { registerUser, loginUser, getUserData };
