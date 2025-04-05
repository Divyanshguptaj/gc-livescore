const User = require("../../models/User");
const Profile = require("../../models/Profile");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a default profile

    const savedProfile = await Profile.save();

    // Create new user with the associated profile
    const newUser = new User({
      name,
      email,
      password,
      profile: savedProfile._id, // Link profile to user
    });

    // Save user
    const savedUser = await newUser.save();

    // Update profile with user ID
    savedProfile.user = savedUser._id;
    await savedProfile.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: savedUser,
      profile: savedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser };