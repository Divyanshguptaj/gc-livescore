import mongoose from "mongoose";
// import avatar from '../assets/avatar.png'

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
        default: "../assets/avatar.png", 
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

export default mongoose.model("Profile", ProfileSchema);