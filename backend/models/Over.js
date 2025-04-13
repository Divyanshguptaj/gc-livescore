import mongoose from "mongoose";

const overSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    inning: {
      type: Number, // 1 or 2
      required: true,
    },
    overNumber: {
      type: Number,
      required: true,
    },
    bowlerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    deliveries: [deliverySchema],
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
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Over = mongoose.model("Over", overSchema);

export default Over;
