const Innings = require("../models/Innings");
const Match = require("../models/Match");

// 🔹 Get all innings for a given match
const getInningsByMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const innings = await Innings.find({ match: matchId });

        if (!innings || innings.length === 0) {
            return res.status(404).json({ success: false, message: "No innings found for this match" });
        }

        res.status(200).json({ success: true, innings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Update innings (runs, wickets, overs, etc.)
const updateInnings = async (req, res) => {
    try {
        const { inningsId } = req.params;
        const { runs, wickets, overs } = req.body;

        const innings = await Innings.findById(inningsId);
        if (!innings) {
            return res.status(404).json({ success: false, message: "Innings not found" });
        }

        // Update fields if provided
        if (runs !== undefined) innings.runs += runs;
        if (wickets !== undefined) innings.wickets += wickets;
        if (overs !== undefined) innings.overs += overs;

        await innings.save();
        res.status(200).json({ success: true, message: "Innings updated successfully", innings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// 🔹 Delete an innings (useful for debugging, but rarely needed)
const deleteInnings = async (req, res) => {
    try {
        const { inningsId } = req.params;

        const innings = await Innings.findByIdAndDelete(inningsId);
        if (!innings) {
            return res.status(404).json({ success: false, message: "Innings not found" });
        }

        res.status(200).json({ success: true, message: "Innings deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { getInningsByMatch, updateInnings, deleteInnings };
