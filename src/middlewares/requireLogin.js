import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // authorization === Bearer eweaghrfyj
    if (!authorization) {
      return res.status(401).json({
        msg: "You must login, to continue",
        status: 401,
      });
    }
    const token = authorization.replace("Bearer ", "");
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({
          msg: "You must login, to continue",
          status: 401,
        });
      }
      const { _id } = payload;
      userModel.findById(_id).then((userdata) => {
        req.user = userdata;

        next();
      });
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      status: 500,
    });
  }
};

export { verifyToken };
