const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Enter the email",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found...",
            });
        }

        // Generate Token
        const token = crypto.randomUUID();

        // Update user with token and expiry
        await User.findOneAndUpdate(
            { email },
            { token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, // 5 min expiry
            { new: true }
        );

        // Create URL
        const url = `http://localhost:3000/update-password?token=${token}`;

        // Send Mail
        await mailSender(email, "Password Reset Link", `Password Reset link: ${url}`);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Can't send mail",
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const userDetails = await User.findOne({ token });

        // Check if token is invalid or expired
        if (!userDetails || userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid or expired",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and reset token
        await User.findOneAndUpdate(
            { token },
            { password: hashedPassword, token: null, resetPasswordExpires: null },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Can't reset password",
        });
    }
}; 