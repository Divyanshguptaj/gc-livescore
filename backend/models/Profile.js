const mongoose = require("mongoose");
import avatar from '../../frontend/public/assets/avatar.png'

const ProfileSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true ,
    },

    gender:{
      type: String, 
      enum: ["Male", "Female"],
    },
    profileImage: { 
        type: String, 
        default: {avatar} 
    },

    bio: { 
        type: String, 
        maxlength: 100 
    },

    contactNumber: { 
        type: String, 
        maxlength: 10
    },

    // socialLinks: {
    //   twitter: { type: String },
    //   linkedin: { type: String },
    //   github: { type: String },
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);