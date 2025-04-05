const express = require("express");
const { createTournament, getTournaments, getTournamentById, updateTournament, deleteTournament } = require("../controllers/Tournament/Tournament");
const { createMatch, getMatches, getMatchById, updateMatch, deleteMatch } = require("../controllers/Tournament/Match/Match");
const { addBall, getBallsByMatch, getBallById, updateBall, deleteBall } = require("../controllers/Tournament/Match/Ball");
const { updateInnings, getInningsByMatch, deleteInnings } = require("../controllers/Tournament/Match/Inning");
const { getLeaderboard, updateLeaderboard, resetLeaderboard } = require("../controllers/Tournament/Leaderboard");
const { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addPlayerToTeam  } = require("../controllers/Tournament/Team");

const router = express.Router();

// 🏆 Tournament Routes
router.post("/create", createTournament);
router.get("/", getTournaments);
router.get("/:id", getTournamentById);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);

// 🏏 Match Routes
router.post("/create", createMatch);
router.get("/", getMatches);
router.get("/:id", getMatchById);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch);

// Ball Routes -
router.post("/add", addBall);
router.get("/match/:matchId", getBallsByMatch);
router.get("/:id", getBallById);
router.put("/update/:id", updateBall);
router.delete("/delete/:id", deleteBall);

// Inning routes -
router.get("/:matchId", getInningsByMatch);
router.put("/:inningsId", updateInnings);
router.delete("/:inningsId", deleteInnings);


// 🔹 Leaderboard routes - 
router.get("/:tournamentId", getLeaderboard);
router.put("/:playerId", updateLeaderboard);
router.delete("/:tournamentId", resetLeaderboard);


// 🔹 Create a new team
router.post("/createTeam", createTeam);
router.get("/getTeams", getTeams);
router.get("/:teamId", getTeamById);
router.put("/:teamId", updateTeam);
router.patch("/:teamId/addPlayer", addPlayerToTeam);
router.delete("/:teamId", deleteTeam);

module.exports = router;
