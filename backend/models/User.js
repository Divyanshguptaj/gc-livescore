import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Profile",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    matchesPlayed: [
      {
        matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
        // runsScored: { type: Number, default: 0 },
        // wicketsTaken: { type: Number, default: 0 },
      },
    ],
    totalRunsScored: {
      type: Number,
      default: 0,
    },
    totalWicketsTaken: {
      type: Number,
      default: 0,
    },
    playingType: { 
      type: String, 
      enum: ["Batsman", "Bowler", "All-Rounder", "WicketKeeper", "WicketKeeperBatsman"], 
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;