const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    matchesPlayed: {
      type: Number,
      default: 0,
    },
    runsScored: {
      type: Number,
      default: 0,
    },
    ballsFaced: {
      type: Number,
      default: 0,
    },
    fours: {
      type: Number,
      default: 0,
    },
    sixes: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    battingStrikeRate: {
      type: Number,
      default: 0,
    },
    wicketsTaken: {
      type: Number,
      default: 0,
    },
    oversBowled: {
      type: Number,
      default: 0,
    },
    runsConceded: {
      type: Number,
      default: 0,
    },
    bowlingEconomy: {
      type: Number,
      default: 0,
    },
    bestBowlingFigures: {
      type: String,
      default: "0/0", // Format: "wickets/runs"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
