import mongoose from "mongoose";
// add organiser and description -
const TournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    format: {
      type: String,
      enum: ["T20", "ODI", "Test"],
      required: true,
    },
    type: {
      type: String,
      enum: ["League", "Knockout", "Round-Robin", "Mixed"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
    standings: [
      {
        team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        matchesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        netRunRate: { type: Number, default: 0 },
      },
    ],
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", TournamentSchema);
