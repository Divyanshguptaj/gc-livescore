import Team from "../../models/Team.js";
import User from "../../models/User.js";

// 🔹 Create a new team
export const createTeam = async (req, res) => {
    try {
        const { name, players, substitutes, tournamentId } = req.body;

        if (!name || !tournamentId || !players || !substitutes) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newTeam = new Team({ name, players, tournament: tournamentId, substitutes });
        await newTeam.save();

        res.status(201).json({ success: true, message: "Team created successfully", team: newTeam });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Get all teams
export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate("players", "name email").populate("tournament", "name");
        res.status(200).json({ success: true, teams });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Get a specific team by ID
export const getTeamById = async (req, res) => {
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
export const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, players, substitutes, matchesPlayed } = req.body;

        let team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        if (name) team.name = name;
        if (players) team.players = players;
        if (substitutes) team.substitutes = substitutes;
        if (matchesPlayed) team.matchesPlayed = matchesPlayed;

        await team.save();
        res.status(200).json({ success: true, message: "Team updated successfully", team });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// 🔹 Add a player to a team
export const addPlayerToTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { playerId, role = "player" } = req.body; // role can be 'player' or 'substitute'

        if (!playerId || !teamId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        const player = await User.findById(playerId);
        if (!player) {
            return res.status(404).json({ success: false, message: "User not found, first add register the player." });
        }

        // Check for duplicates
        if (team.players.includes(playerId) || team.substitutes.includes(playerId)) {
            return res.status(400).json({ success: false, message: "Player is already in another team" });
        }

        if (role === "substitute") {
            team.substitutes.push(playerId);
        } else {
            team.players.push(playerId);
        }

        await team.save();
        res.status(200).json({ success: true, message: `Player added to ${role} list successfully`, team });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Delete a team
export const deleteTeam = async (req, res) => {
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