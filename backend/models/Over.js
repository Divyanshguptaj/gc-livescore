import mongoose from "mongoose";  

const overSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    inning: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Innings",
      // required: true,
    },
    overNumber: {
      type: Number,
      required: true,
    },
    bowlerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      // required: true,
    },
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ball", 
      }
    ],
    totalRuns: {
      type: Number,
      required: true,
      default: 0,
    },
    totalWickets: {
      type: Number,
      default: 0,
    },
    extras: {
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Over", overSchema);