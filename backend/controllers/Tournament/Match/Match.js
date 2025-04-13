import Match from "../../../models/Match.js";
import Tournament from "../../../models/Tournament.js";
import Innings from "../../../models/Inning.js";

// 🏏 Create a New Match
export const createMatch = async (req, res) => {
  try {
    const { tournamentId, teams, date, venue, time } = req.body;
    if (
      !tournamentId ||
      !teams ||
      teams.length !== 2 ||
      !date ||
      !venue ||
      !time
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    // Validate if the tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    // Create the match
    const newMatch = new Match({
      tournament: tournamentId,
      teams,
      date,
      venue,
      time,
    });
    await newMatch.save();
    // Automatically create innings for the match

    let inningsToCreate = tournament.format === "Test" ? 4 : 2;
    let innings = [];

    for (let i = 0; i < inningsToCreate; i++) {
      // const teamIndex = i % 2;
      const inningsData = new Innings({
        match: newMatch._id,
      });
      await inningsData.save();
      innings.push(inningsData._id);
    }
    // Update match with innings details
    newMatch.innings = innings;
    await newMatch.save();

    res.status(201).json({
      success: true,
      message: "Match and innings created successfully",
      match: newMatch,
      innings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 📋 Get All Matches
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("tournament")
      .populate("innings")
      .populate({
        path: "teams",
        populate: [
          { path: "players" },
          { path: "substitutes" },
        ],
      });

    res.status(200).json({ success: true, matches });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 🔍 Get a Specific Match by ID
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate(
      "tournament teams scorecard"
    );

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res.status(200).json({ success: true, match });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✏️ Update Match Details
export const updateMatch = async (req, res) => {
  try {
    const { teams, date, venue, status, scorecard } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      { teams, date, venue, status, scorecard },
      { new: true }
    ).populate("tournament teams scorecard");

    if (!updatedMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Match updated successfully",
        match: updatedMatch,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ❌ Delete a Match
export const deleteMatch = async (req, res) => {
  try {
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);

    if (!deletedMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Match deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
