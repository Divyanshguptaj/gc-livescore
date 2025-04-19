import express from "express";
import multer from 'multer';
import { createTournament, getTournaments, getTournamentById, updateTournament, deleteTournament, addTeam } from "../controllers/Tournament/Tournament.js";
import { createMatch, getMatches, getMatchByTournamentId, updateMatch, deleteMatch,updateMatchDetails,initializeMatch, getMatchesById } from "../controllers/Tournament/Match/Match.js";
import { addBall, getBallsByMatch, getBallById, updateBall, deleteBall } from "../controllers/Tournament/Match/Ball.js";
import { updateInnings, getInningsByMatch, deleteInnings } from "../controllers/Tournament/Match/Inning.js";
import { getLeaderboard, updateLeaderboard, resetLeaderboard } from "../controllers/Tournament/Leaderboard.js";
import { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addPlayersToTeam } from "../controllers/Tournament/Team.js";
import { auth, isAdmin } from "../middlewares/Auth.js";

const upload = multer();
const router = express.Router();

// 🏆 Tournament Routes
router.post("/create",auth, isAdmin, createTournament);
router.post("/addTeam",upload.none(), addTeam);
router.get("/getTournaments", getTournaments);
router.get("/getTournamentById/:id", getTournamentById);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);

// 🏏 Match Routes
router.post("/createMatch", createMatch);
router.get("/getMatches", getMatches);
router.get("/getMatchesById/:id", getMatchesById);
router.get("/:id/getMatchByTournamentId", getMatchByTournamentId);
router.post("/updateMatchDetails", updateMatchDetails);
router.post("/initialize", initializeMatch);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch);

// Ball Routes -
router.post("/add", addBall);
router.get("/match/:matchId", getBallsByMatch);
router.get("getBallById/:id", getBallById);
router.delete("/delete/:id", deleteBall);

// Inning routes -
router.get("getInningsByMatch/:matchId", getInningsByMatch);
router.put("/:inningsId", updateInnings);
router.delete("/:inningsId", deleteInnings);


// 🔹 Leaderboard routes - 
router.get("getLeaderboard/:tournamentId", getLeaderboard);
router.put("/:playerId", updateLeaderboard);
router.delete("/:tournamentId", resetLeaderboard);

// 🔹 Create a new team
router.post("/createTeam", createTeam);
router.get("/getTeams", getTeams);
router.get("getTeamById/:teamId", getTeamById);
router.put("/:teamId", updateTeam);
router.post("/addPlayers", addPlayersToTeam);
router.delete("/:teamId", deleteTeam);

export default router;
