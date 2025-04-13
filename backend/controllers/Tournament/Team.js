import Team from "../../models/Team.js";
import User from "../../models/User.js";

// 🔹 Create a new team
export const createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
          return res.status(400).json({ success: false, message: "Team already exists" });
        }

        const newTeam = new Team({ name });
        await newTeam.save();

        res.status(201).json({ success: true, message: "Team created successfully", team: newTeam });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Get all teams
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({})
      .populate("players", "name email")

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
export const addPlayersToTeam = async (req, res) => {
    try {
        const { teamId, players = [], substitutes = [] } = req.body;

        if (!teamId || (!players.length && !substitutes.length)) {
            return res.status(400).json({
                success: false,
                message: "Team ID and at least one player or substitute is required.",
            });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found." });
        }

        // Remove duplicates from input
        const uniquePlayers = [...new Set(players)];
        const uniqueSubs = [...new Set(substitutes)];

        // Check overlap (players can't be both player & sub)
        const overlap = uniquePlayers.filter(id => uniqueSubs.includes(id));
        if (overlap.length) {
            return res.status(400).json({
                success: false,
                message: `Users ${overlap.join(', ')} are in both players and substitutes.`,
            });
        }

        // Validate users exist
        const allIds = [...uniquePlayers, ...uniqueSubs];
        const existingUsers = await User.find({ _id: { $in: allIds } });
        const existingIds = existingUsers.map(user => user._id.toString());

        const invalidIds = allIds.filter(id => !existingIds.includes(id));
        if (invalidIds.length) {
            return res.status(400).json({
                success: false,
                message: `These user IDs do not exist: ${invalidIds.join(', ')}`,
            });
        }

        // Filter out users already in this team
        const newPlayers = uniquePlayers.filter(id =>
            !team.players.includes(id) && !team.substitutes.includes(id)
        );
        const newSubs = uniqueSubs.filter(id =>
            !team.players.includes(id) && !team.substitutes.includes(id)
        );

        // Add to team
        team.players.push(...newPlayers);
        team.substitutes.push(...newSubs);
        await team.save();

        res.status(200).json({
            success: true,
            message: "Team updated with new players and substitutes.",
            added: {
                players: newPlayers,
                substitutes: newSubs
            },
            skipped: {
                alreadyInTeam: allIds.filter(id =>
                    team.players.includes(id) || team.substitutes.includes(id)
                ),
                invalidIds,
                duplicatesInRequest: overlap
            },
            team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
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