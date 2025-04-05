const Profile = require("../../models/Profile");

// Fetch user profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      "name email role"
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const mail = req.user.email;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password fields cannot be empty",
      });
    }
    // Find user by email
    const user = await User.findOne({ email: mail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare old password with stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Can't change the Password!",
    });
  }
};

module.exports = { getProfile, updateProfile };
