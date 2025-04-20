import Profile from "../../models/Profile.js";
import User from "../../models/User.js"
import cloudinary from '../../config/cloudinary.js';

// Fetch user profile
export const getProfile = async (req, res) => {
  try {
    // Find the user and populate the profile and other relevant fields
    console.log("getprofile", req.user)
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude password
      .populate('profile', 'gender profileImage bio contactNumber')
      .populate('teams', 'name')
      .populate('matchesPlayed.matchId', 'matchDate opponent');
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Structure the response data
    const profileData = {
      name: user.name,
      email: user.email,
      role: user.role,
      playingType: user.playingType,
      totalRunsScored: user.totalRunsScored,
      totalWicketsTaken: user.totalWicketsTaken,
      profile: user.profile || {},
      teams: user.teams,
      matchesPlayed: user.matchesPlayed,
      createdAt: user.createdAt
    };
    console.log(profileData)
    return res.status(200).json({success: true, user: profileData});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false,  message: 'Server Error' });
  }
};

//update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const file = req.file;
    console.log(userId)
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    // Handle file upload if image was changed
    if (file) {
      // Delete old image from Cloudinary if it exists and isn't the default
      if (profile.profileImage && !profile.profileImage.includes('ui-avatars.com')) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = profile.profileImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`news-blogs/${publicId}`);
        } catch (error) {
          console.error('Error deleting old image from Cloudinary:', error);
        }
      }

      // Save new image URL from Cloudinary
      profile.profileImage = file.path;
    }

    // Update profile fields
    if (updates.bio !== undefined) profile.bio = updates.bio;
    if (updates.contactNumber !== undefined) profile.contactNumber = updates.contactNumber;
    if (updates.gender !== undefined) profile.gender = updates.gender;

    // Update user fields
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.playingType !== undefined) user.playingType = updates.playingType;

    // Save changes
    await profile.save();
    user.profile = profile._id;
    await user.save();

    // Get updated user with populated profile
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('profile')
      .populate('teams', 'name')
      .populate('matchesPlayed.matchId', 'matchDate opponent');

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// export const getProfile = async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.params.userId }).populate(
//       "user",
//       "name email role"
//     );
//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Update user profile
// export const updateProfile = async (req, res) => {
//   try {
//     const updatedProfile = await Profile.findOneAndUpdate(
//       { user: req.params.userId },
//       { $set: req.body },
//       { new: true, upsert: true }
//     );

//     res.json(updatedProfile);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile" });
//   }
// };