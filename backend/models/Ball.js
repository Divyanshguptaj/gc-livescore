import mongoose from "mongoose";

const BallSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    overNumber: {
      type: Number,
      required: true,
    },
    ballNumber: {
      type: Number,
      required: true,
    },
    bowler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batsman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    runs: {
      type: Number,
      required: true,
      default: 0,
    },
    extras: {
      type: Number,
      default: 0,
    },
    extraType: {
      type: String,
      enum: ["wide", "no-ball", "leg-bye", "bye", "none"],
      default: "none",
    },
    isWicket: {
      type: Boolean,
      default: false,
    },
    wicketType: {
      type: String,
      enum: ["bowled", "caught", "lbw", "run-out", "stumped", "hit-wicket", "none"],
      default: "none",
    },
    dismissedBatsman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fielder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Ball = mongoose.model("Ball", BallSchema);
export default Ball;