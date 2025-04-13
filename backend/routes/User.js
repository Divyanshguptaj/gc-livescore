import express from "express";
const router = express.Router();

import { getProfile, updateProfile } from "../controllers/User/Profile.js";
import { registerUser, getAllUsers } from "../controllers/User/User.js";


router.post("/register", registerUser);
router.get('/getAllUsers', getAllUsers);
router.get("getProfile/:userId", getProfile); // Fetch user profile
router.put("/:userId", updateProfile); // Update user profile

export default router;