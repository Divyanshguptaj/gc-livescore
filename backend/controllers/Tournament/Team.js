const Team = require("../models/Team");
const User = require("../models/User");

// 🔹 Create a new team
const createTeam = async (req, res) => {
    try {
        const { name, players, tournamentId } = req.body;

        if (!name || !tournamentId || !players || players.length === 0) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newTeam = new Team({ name, players, tournament: tournamentId });
        await newTeam.save();

        res.status(201).json({ success: true, message: "Team created successfully", team: newTeam });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Get all teams
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate("players", "name email").populate("tournament", "name");
        res.status(200).json({ success: true, teams });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Get a specific team by ID
const getTeamById = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId).populate("players", "name email").populate("tournament", "name");

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        res.status(200).json({ success: true, team });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Update team (name, add/remove players)
const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, players } = req.body;

        let team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        if (name) team.name = name;
        if (players) team.players = players;

        await team.save();
        res.status(200).json({ success: true, message: "Team updated successfully", team });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Add a player to a team
const addPlayerToTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
            return res.status(400).json({ success: false, message: "Player ID is required" });
        }

        // Find the team
        let team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        // Check if player exists
        const player = await User.findById(playerId);
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }

        // Check if player is already in the team
        if (team.players.includes(playerId)) {
            return res.status(400).json({ success: false, message: "Player is already in this team" });
        }

        // Add player to the team
        team.players.push(playerId);
        await team.save();

        res.status(200).json({ success: true, message: "Player added to team successfully", team });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Delete a team
const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        await team.deleteOne();
        res.status(200).json({ success: true, message: "Team deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addPlayerToTeam };
