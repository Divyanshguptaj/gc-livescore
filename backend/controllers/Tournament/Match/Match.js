const Match = require("../../models/Match");
const Tournament = require("../../models/Tournament");
const Innings = require("../models/Innings");

const createMatch = async (req, res) => {
    try {
        const { tournamentId, teams, date, venue, status, matchType, scorecard } = req.body;

        if (!tournamentId || !teams || teams.length !== 2 || !date || !venue || !matchType) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        // Validate if the tournament exists
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ success: false, message: "Tournament not found" });
        }

        // Create the match
        const newMatch = new Match({ tournament: tournamentId, teams, date, venue, status, scorecard });
        await newMatch.save();

        // Automatically create innings for the match
        let inningsToCreate = matchType === "Test" ? 4 : 2;
        let innings = [];

        for (let i = 0; i < inningsToCreate; i++) {
            const teamIndex = i % 2;
            const inningsData = new Innings({
                match: newMatch._id,
                battingTeam: teams[teamIndex], 
                bowlingTeam: teams[1 - teamIndex], 
                runs: 0,
                wickets: 0,
                overs: 0,
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
            innings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 📋 Get All Matches
const getMatches = async (req, res) => {
    try {
        const matches = await Match.find().populate("tournament teams scorecard");
        res.status(200).json({ success: true, matches });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 🔍 Get a Specific Match by ID
const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate("tournament teams scorecard");

        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }

        res.status(200).json({ success: true, match });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ✏️ Update Match Details
const updateMatch = async (req, res) => {
    try {
        const { teams, date, venue, status, scorecard } = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id,
            { teams, date, venue, status, scorecard },
            { new: true }
        ).populate("tournament teams scorecard");

        if (!updatedMatch) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }

        res.status(200).json({ success: true, message: "Match updated successfully", match: updatedMatch });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ❌ Delete a Match
const deleteMatch = async (req, res) => {
    try {
        const deletedMatch = await Match.findByIdAndDelete(req.params.id);

        if (!deletedMatch) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }

        res.status(200).json({ success: true, message: "Match deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    createMatch,
    getMatches,
    getMatchById,
    updateMatch,
    deleteMatch
};
