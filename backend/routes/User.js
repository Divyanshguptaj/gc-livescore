import express from "express";
const router = express.Router();
import { uploadProfileImage } from '../middlewares/upload.js';
import { getProfile, updateProfile } from "../controllers/User/Profile.js";
import { registerUser, getAllUsers } from "../controllers/User/User.js";
import { auth } from '../middlewares/Auth.js';
import { detectIntent } from "../utils/chatBot.js";

router.post("/chatbot",detectIntent); 
router.post("/register", registerUser);
router.get('/getAllUsers', getAllUsers);
router.get("/getProfile",auth, getProfile); // Fetch user profile
router.put('/updateProfile', auth, uploadProfileImage, updateProfile);

export default router;