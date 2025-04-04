const mongoose = require("mongoose");

const ScorecardSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    innings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Innings",
      required: true,
    },
    battingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    bowlingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    totalRuns: {
      type: Number,
      default: 0,
    },
    totalWickets: {
      type: Number,
      default: 0,
    },
    oversPlayed: {
      type: Number,
      default: 0,
    },
    extras: {
      type: Number,
      default: 0,
    },
    batsmenStats: [
      {
        player: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Player who batted
        runs: { type: Number, default: 0 },
        ballsFaced: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        status: { type: String, enum: ["Not Out", "Out"], default: "Not Out" },
      },
    ],
    bowlersStats: [
      {
        player: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Player who bowled
        overs: { type: Number, default: 0 },
        maidens: { type: Number, default: 0 },
        runsConceded: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        economy: { type: Number, default: 0 },
      },
    ],
    fallOfWickets: [
      {
        wicketNumber: { type: Number },
        playerOut: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        runsAtFall: { type: Number },
        oversAtFall: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scorecard", ScorecardSchema);