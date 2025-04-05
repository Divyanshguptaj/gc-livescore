const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
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
exports.isUser = async (req, res, next) => {
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
exports.isAdmin = async (req, res, next) => {
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
