const express = require('express');
const router = express.Router();
const {login, signUp, changePassword, sendOTP} = require('../controllers/Auth')
const {resetPasswordToken, resetPassword} = require('../controllers/ResetPassword')
const {auth, isAdmin, isUser} = require("../middlewares/Auth");
 
router.post('/login', login);
router.post('/signup', signUp);
router.post('/changepassword',auth, changePassword); 
router.post('/reset-password-token',auth, resetPasswordToken)
router.post('/reset-password', resetPassword)
router.post('/sendotp', sendOTP);

module.exports = router;