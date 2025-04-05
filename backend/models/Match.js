import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true, // Leaderboard is specific to a tournament
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Match", MatchSchema);
