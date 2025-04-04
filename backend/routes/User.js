const express = require("express");

const { getProfile, updateProfile } = require("../controllers/Profile");
const { registerUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/:userId", getProfile); // Fetch user profile
router.put("/:userId", updateProfile); // Update user profile

module.exports = router;
