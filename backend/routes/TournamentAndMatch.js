import express from "express";
import { createTournament, getTournaments, getTournamentById, updateTournament, deleteTournament } from "../controllers/Tournament/Tournament.js";
import { createMatch, getMatches, getMatchById, updateMatch, deleteMatch } from "../controllers/Tournament/Match/Match.js";
import { addBall, getBallsByMatch, getBallById, updateBall, deleteBall } from "../controllers/Tournament/Match/Ball.js";
import { updateInnings, getInningsByMatch, deleteInnings } from "../controllers/Tournament/Match/Inning.js";
import { getLeaderboard, updateLeaderboard, resetLeaderboard } from "../controllers/Tournament/Leaderboard.js";
import { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addPlayerToTeam } from "../controllers/Tournament/Team.js";

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

export default router;
