const Ball = require("../models/Ball");
const Match = require("../models/Match");
const Innings = require("../models/Innings");

// 🎯 Add a Ball Event
const addBall = async (req, res) => {
    try {
        const { matchId, inningsId, bowler, batsman, runs, extras, wicket, ballNumber, overNumber } = req.body;

        if (!matchId || !inningsId || !bowler || !batsman || !ballNumber || !overNumber) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Validate if match and innings exist
        const match = await Match.findById(matchId);
        const innings = await Innings.findById(inningsId);

        if (!match || !innings) {
            return res.status(404).json({ success: false, message: "Match or Innings not found" });
        }

        const newBall = new Ball({
            match: matchId,
            innings: inningsId,
            bowler,
            batsman,
            runs,
            extras,
            wicket,
            ballNumber,
            overNumber
        });

        await newBall.save();
        res.status(201).json({ success: true, message: "Ball event recorded", ball: newBall });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 📋 Get All Balls for a Match
const getBallsByMatch = async (req, res) => {
    try {
        const balls = await Ball.find({ match: req.params.matchId }).populate("bowler batsman");
        res.status(200).json({ success: true, balls });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 🔍 Get a Specific Ball Event
const getBallById = async (req, res) => {
    try {
        const ball = await Ball.findById(req.params.id).populate("bowler batsman");

        if (!ball) {
            return res.status(404).json({ success: false, message: "Ball event not found" });
        }

        res.status(200).json({ success: true, ball });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ✏️ Update Ball Event
const updateBall = async (req, res) => {
    try {
        const { runs, extras, wicket, ballNumber, overNumber } = req.body;

        const updatedBall = await Ball.findByIdAndUpdate(
            req.params.id,
            { runs, extras, wicket, ballNumber, overNumber },
            { new: true }
        );

        if (!updatedBall) {
            return res.status(404).json({ success: false, message: "Ball event not found" });
        }

        res.status(200).json({ success: true, message: "Ball event updated", ball: updatedBall });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ❌ Delete a Ball Event
const deleteBall = async (req, res) => {
    try {
        const deletedBall = await Ball.findByIdAndDelete(req.params.id);

        if (!deletedBall) {
            return res.status(404).json({ success: false, message: "Ball event not found" });
        }

        res.status(200).json({ success: true, message: "Ball event deleted" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    addBall,
    getBallsByMatch,
    getBallById,
    updateBall,
    deleteBall
};
