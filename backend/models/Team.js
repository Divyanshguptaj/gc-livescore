import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    substitutes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matchesPlayed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
  },
  { timestamps: true }
);

// Middleware to enforce a maximum of 11 players
TeamSchema.pre("save", function (next) {
  if (this.players.length > 11) {
    return next(new Error("A team cannot have more than 11 players."));
  }
  if (this.substitutes.length > 4) {
    return next(new Error("A team cannot have more than 4 substitutes."));
  }
  next();
});


export default mongoose.model("Team", TeamSchema);
