import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("reachedlvl1")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }
    console.log("reachedlvl2")
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    
    console.log("reachedlvl3")
    try {
      console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('khatam')
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during token validation",
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
    console.log("isAdmin");
    if (req.user.role !== "admin") {
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
