const jwt = require('jsonwebtoken');
require('dotenv').config();
// const User = require('../models/User');

exports.auth = async (req, res, next)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "");
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token missing",
            })
        } 
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }catch(error){
            return res.status(400).json({
                success: false,
                message: "Token is Invalid",
            })
        }
    }catch(error){
        return res.status(400).json({
            success: false,
            message: "Something went wrong while validating Token",
        })
    }
}

//isStudent 
exports.isUser = async (req, res, next)=>{
    try{
        console.log("here")
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: false,
                message: "This is a protected route for students only",
            })
        }
        next();
    }catch(error){
        return res.status(400).json({
            success: false,
            message: "User role can't verified , please try again later",
        })
    }
}

//isAdmin
exports.isAdmin = async (req, res, next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: "This is a protected route for Admin only",
            })
        }
        next();
    }catch(error){
        return res.status(400).json({
            success: false,
            message: "User role can't verified , please try again later",
        })
    }
}