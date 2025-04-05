const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/User/Profile");
const { registerUser } = require("../controllers/User/User");


router.post("/register", registerUser);
router.get("/:userId", getProfile); // Fetch user profile
router.put("/:userId", updateProfile); // Update user profile


module.exports = router;
