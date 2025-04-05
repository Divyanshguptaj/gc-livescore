import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "");
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Token is Invalid",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while validating Token",
    });
  }
};

//isStudent
export const isUser = async (req, res, next) => {
  try {
    // console.log("here");
    if (req.user.role !== "user") {
      return res.status(400).json({
        success: false,
        message: "This is a protected route for users only",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User role can't verified , please try again later",
    });
  }
};

//isAdmin
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(400).json({
        success: false,
        message: "This is a protected route for Admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User role can't verified , please try again later",
    });
  }
};
