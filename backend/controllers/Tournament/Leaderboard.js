import Leaderboard from"../../models/Leaderboard.js";
import Tournament from"../../models/Tournament.js";
import Player from"../../models/User.js";  // Since players and users are the same

// 🔹 Get leaderboard for a specific tournament
export const getLeaderboard = async (req, res) => {
    try {
        const { tournamentId } = req.params;

        // Check if tournament exists
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ success: false, message: "Tournament not found" });
        }

        // Get leaderboard entries for the tournament
        const leaderboard = await Leaderboard.find({ tournament: tournamentId }).populate("player");

        res.status(200).json({ success: true, leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Update leaderboard (update stats for a player)
export const updateLeaderboard = async (req, res) => {
    try {
        const { playerId } = req.params;
        const { tournamentId, runsScored, wicketsTaken, matchesPlayed } = req.body;

        // Find leaderboard entry for the player in the given tournament
        let leaderboardEntry = await Leaderboard.findOne({ player: playerId, tournament: tournamentId });

        if (!leaderboardEntry) {
            // If not found, create a new leaderboard entry
            leaderboardEntry = new Leaderboard({ player: playerId, tournament: tournamentId });
        }

        // Update fields if provided
        if (runsScored !== undefined) leaderboardEntry.runsScored += runsScored;
        if (wicketsTaken !== undefined) leaderboardEntry.wicketsTaken += wicketsTaken;
        if (matchesPlayed !== undefined) leaderboardEntry.matchesPlayed += matchesPlayed;

        await leaderboardEntry.save();
        res.status(200).json({ success: true, message: "Leaderboard updated", leaderboard: leaderboardEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Reset leaderboard for a tournament (optional)
export const resetLeaderboard = async (req, res) => {
    try {
        const { tournamentId } = req.params;

        await Leaderboard.deleteMany({ tournament: tournamentId });

        res.status(200).json({ success: true, message: "Leaderboard reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};