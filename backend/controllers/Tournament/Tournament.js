import Tournament from "../../models/Tournament.js";

// 🎯 Create a New Tournament
export const createTournament = async (req, res) => {
    try {
        console.log("createtournament");
        const { name, location, startDate, endDate, format, type, description } = req.body;
        console.log(req.body);

        // Validate required fields
        if (!name || !location || !startDate || !endDate || !format || !type) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newTournament = new Tournament({ name, location, startDate, endDate, format, type, description });

        // Try to save the new tournament
        await newTournament.save();
        res.status(201).json({ success: true, message: "Tournament created successfully", tournament: newTournament });

    } catch (error) {
        // Check if the error is a duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Tournament name should be unique" });
        }
        // Handle other types of errors (server error)
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 📋 Get All Tournaments
export const getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate("teams");
        res.status(200).json({ success: true, tournaments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 🔍 Get a Specific Tournament by ID
export const getTournamentById = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id).populate("teams");
        if (!tournament) {
            return res.status(404).json({ success: false, message: "Tournament not found" });
        }

        res.status(200).json({ success: true, tournament });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ✏️ Update Tournament Details
export const updateTournament = async (req, res) => {
    try {
        const { name, location, startDate, endDate, teams } = req.body;

        const updatedTournament = await Tournament.findByIdAndUpdate(
            req.params.id,
            { name, location, startDate, endDate, teams },
            { new: true }
        );

        if (!updatedTournament) {
            return res.status(404).json({ success: false, message: "Tournament not found" });
        }

        res.status(200).json({ success: true, message: "Tournament updated successfully", tournament: updatedTournament });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ❌ Delete a Tournament
export const deleteTournament = async (req, res) => {
    try {
        const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);

        if (!deletedTournament) {
            return res.status(404).json({ success: false, message: "Tournament not found" });
        }

        res.status(200).json({ success: true, message: "Tournament deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 🔗 Add Teams to a Tournament 
export const addTeam = async (req, res) => {
    try {
        console.log("object1")
        console.log(req.body)
        const { tournamentId, teamId } = req.body;
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ success: false, message: "Tournament not found" });
        }

        // Check if team already exists in the tournament
        if (tournament.teams.includes(teamId)) {
            return res.status(400).json({ success: false, message: "Team already added to this tournament" });
        }

        tournament.teams.push(teamId);
        await tournament.save();

        res.status(200).json({
            success: true,
            message: "Team added to tournament successfully",
            tournament,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
