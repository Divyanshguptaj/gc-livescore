import express from 'express';
import { login, signUp, changePassword, sendOTP } from '../controllers/Auth.js'; 
import { resetPasswordToken, resetPassword } from '../controllers/User/ResetPassword.js';
import { auth, isAdmin, isUser } from '../middlewares/Auth.js';
const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/changepassword',auth, changePassword); 
router.post('/reset-password-token',auth, resetPasswordToken)
router.post('/reset-password', resetPassword)
router.post('/sendotp', sendOTP);
 
export default router;