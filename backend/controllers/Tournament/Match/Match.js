import Match from "../../../models/Match.js";
import Tournament from "../../../models/Tournament.js";
import Innings from "../../../models/Inning.js";
import Over from '../../../models/Over.js';
import mongoose from "mongoose";
import Ball from '../../../models/Ball.js'
import Team from '../../../models/Team.js'
// import { Request, Response } from 'express';
// import Inning from "../../../models/Inning.js";

// import PlayerStats from '../../../models/PlayerStats.js';
export const initializeMatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { matchId, battingTeamId, strikerId, nonStrikerId, bowlerId } = req.body;

    // 1. Verify the match exists
    const match = await Match.findById(matchId).session(session);
    if (!match) {
      throw new Error('Match not found');
    }

    // 2. Get full team details including players
    const battingTeam = await Team.findById(battingTeamId).session(session);
    if (!battingTeam) {
      throw new Error('Batting team not found');
    }

    // 3. Determine bowling team
    const bowlingTeamId = match.teams.find(teamId => teamId.toString() !== battingTeamId.toString());
    if (!bowlingTeamId) {
      throw new Error('Could not determine bowling team');
    }

    const bowlingTeam = await Team.findById(bowlingTeamId).session(session);
    if (!bowlingTeam) {
      throw new Error('Bowling team not found');
    }

    // 4. Initialize batsmen stats for all batting team players
    const battingTeamStats = battingTeam.players.map(playerId => ({
      player: playerId,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      outType: null,
      bowler: null,
      fielder: null,
      strikeRate: 0
    }));

    // 5. Initialize bowler stats for all bowling team players
    const bowlingTeamStats = bowlingTeam.players.map(playerId => ({
      player: playerId,
      noOfBatting : playerId==strikerId ? 1 : playerId==nonStrikerId ? 2 : 0,
      oversBowled: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      wides: 0,
      noBalls: 0
    }));

    // 6. Create 5 overs for first inning
    const firstInningOverIds = [];
    for (let i = 1; i <= 5; i++) {
      const over = new Over({
        matchId,
        overNumber: i,
        deliveries: [],
        totalRuns: 0,
        totalWickets: 0,
        bowlerId, // You might want to prompt for different bowlers later
      });
      const savedOver = await over.save({ session });
      firstInningOverIds.push(savedOver._id);
    }

    // 7. Create first inning with all players' stats
    const firstInning = new Innings({
      match: matchId,
      battingTeam: battingTeamId,
      bowlingTeam: bowlingTeamId,
      overs: firstInningOverIds,
      totalRuns: 0,
      totalWickets: 0,
      batsmenStats: battingTeamStats,
      bowlersStats: bowlingTeamStats,
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0
      },
      currentBatsmen: [strikerId, nonStrikerId],
      currentBowlers: [bowlerId]
    });
    const savedFirstInning = await firstInning.save({ session });

    // Link each over to the first inning
    await Over.updateMany(
      { _id: { $in: firstInningOverIds } },
      { $set: { inning: savedFirstInning._id } },
      { session }
    );

    // 8. Initialize stats for second inning (roles reversed)
    const secondInningBattingStats = bowlingTeam.players.map(playerId => ({
      player: playerId,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      outType: null,
      bowler: null,
      fielder: null,
      strikeRate: 0
    }));

    const secondInningBowlingStats = battingTeam.players.map(playerId => ({
      player: playerId,
      oversBowled: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      wides: 0,
      noBalls: 0
    }));

    // 9. Create 5 overs for second inning
    const secondInningOverIds = [];
    for (let i = 1; i <= 5; i++) {
      const over = new Over({
        matchId,
        overNumber: i,
        deliveries: [],
        totalRuns: 0,
        totalWickets: 0,
        bowlerId, // Same note: update during live play
      });
      const savedOver = await over.save({ session });
      secondInningOverIds.push(savedOver._id);
    }

    // 10. Create second inning with all players' stats
    const secondInning = new Innings({
      match: matchId,
      battingTeam: bowlingTeamId,
      bowlingTeam: battingTeamId,
      overs: secondInningOverIds,
      totalRuns: 0,
      totalWickets: 0,
      batsmenStats: secondInningBattingStats,
      bowlerStats: secondInningBowlingStats,
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0
      },
      currentBatsmen: [], // Will be set when second inning starts
      currentBowlers: []  // Will be set when second inning starts
    });
    const savedSecondInning = await secondInning.save({ session });

    // Link each over to the second inning
    await Over.updateMany(
      { _id: { $in: secondInningOverIds } },
      { $set: { inning: savedSecondInning._id } },
      { session }
    );

    // 11. Update match with innings
    match.innings = [savedFirstInning._id, savedSecondInning._id];
    match.status = 'in_progress';
    await match.save({ session });

    // 12. Commit transaction
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Match initialized successfully with 5 overs per inning',
      data: {
        matchId,
        currentInning: savedFirstInning,
        secondInning: savedSecondInning,
        currentOver: firstInningOverIds[0] // First over of first inning
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error initializing match:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize match'
    });
  } finally {
    session.endSession();
  }
};

// 🏏 Create a New Match
export const createMatch = async (req, res) => {
  try {
    const { tournamentId, teams, date, venue, time } = req.body;
    if (
      !tournamentId ||
      !teams ||
      teams.length !== 2 ||
      !date ||
      !venue ||
      !time
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    // Validate if the tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    // Create the match
    const newMatch = new Match({
      tournament: tournamentId,
      teams,
      date,
      venue,
      time,
    });
    await newMatch.save();
    // Automatically create innings for the match

    let inningsToCreate = tournament.format === "Test" ? 4 : 2;
    let innings = [];

    for (let i = 0; i < inningsToCreate; i++) {
      // const teamIndex = i % 2;
      const inningsData = new Innings({
        match: newMatch._id,
      });
      await inningsData.save();
      innings.push(inningsData._id);
    }
    // Update match with innings details
    newMatch.innings = innings;
    await newMatch.save();

    res.status(201).json({
      success: true,
      message: "Match and innings created successfully",
      match: newMatch,
      innings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 📋 Get All Matches
export const getMatches = async (req, res) => {
  try {
    // console.log("object")
    const matches = await Match.find()
      .populate("tournament")
      .populate("innings")
      .populate({
        path: "teams",
        populate: [
          { path: "players" },
          { path: "substitutes" },
        ],
      });

    res.status(200).json({ success: true, matches });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// 🔍 Get a Specific Match by ID
export const getMatchByTournamentId = async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.id }).populate([
      { path: "tournament" },
      { path: "teams" },
      { path: "innings" } // now correctly populating innings instead of scorecard
    ]);

    if (!matches || matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matches found for this tournament",
      });
    }

    res.status(200).json({ success: true, matches });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getMatchesById = async (req, res) => {
  try {
    const matchId = req.params.id;

    // Fetch match and populate related data
    const match = await Match.findById(matchId)
      .populate({
        path: 'tournament',
        model: 'Tournament',
        // populate: {
        //   path: 'teams matches',
        //   model: 'Team'
        // }
      })
      .populate({
        path: 'teams',
        model: 'Team',
        populate: {
          path: 'players substitutes',
          model: 'User'
        }
      })
      .populate({
        path: 'innings',
        model: 'Innings',
        populate: [
          {
            path: 'battingTeam bowlingTeam',
            model: 'Team'
          },
          {
            path: 'overs',
            model: 'Over',
            populate: {
              path: 'deliveries',
              model: 'Ball',
              populate: [
                { path: 'batsman bowler', model: 'User' }
              ]
            }
          }
        ]
      });

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    // console.log("match", match)
    // Structure matchInfo
    const matchInfo = {
      _id: match._id,
      date: match.date,
      venue: match.venue,
      result: match.result,
      teams: match.teams.map(t => ({ _id: t._id, name: t.name })),
      tournament: {
        _id: match.tournament._id,
        name: match.tournament.name,
        format: match.tournament.format
      }
    };
    console.log("matchinfo", matchInfo)
    // Structure tournamentInfo
    const tournamentInfo = {
      name: match.tournament.name,
      format: match.tournament.format,
      status: match.tournament.status,
      teams: match.tournament.teams.map(team => ({
        _id: team._id,
        name: team.name
      })),
      matches: match.tournament.matches.map(m => ({
        _id: m._id,
        date: m.date,
        venue: m.venue
      }))
    };
    // console.log("tournamentInfo", tournamentInfo)
    // Structure teamsInfo
    const teamsInfo = match.teams.map(team => ({
      _id: team._id,
      name: team.name,
      players: team.players.map(p => ({ _id: p._id, name: p.name })),
      substitutes: team.substitutes.map(s => ({ _id: s._id, name: s.name }))
    }));
    // console.log("teamsInfo",teamsInfo)
    // Structure innings summary
    const innings = match.innings.map(inning => ({
      _id: inning._id,
      battingTeam: {
        _id: inning.battingTeam._id,
        name: inning.battingTeam.name
      },
      bowlingTeam: {
        _id: inning.bowlingTeam._id,
        name: inning.bowlingTeam.name
      },
      totalRuns: inning.totalRuns,
      totalWickets: inning.totalWickets,
      oversPlayed: inning.totalOvers
    }));
    // console.log("match", match);
    // console.log("innings", innings);
    // Structure fullScorecard
    const fullScorecard = match.innings.map(inning => ({
      _id: inning._id,
      battingTeam: {
        _id: inning.battingTeam._id,
        name: inning.battingTeam.name
      },
      bowlingTeam: {
        _id: inning.bowlingTeam._id,
        name: inning.bowlingTeam.name
      },
      totalRuns: inning.totalRuns,
      totalWickets: inning.totalWickets,
      oversPlayed: inning.totalOvers,
      overs: inning.overs.map(over => ({
        overNumber: over.overNumber,
        bowlerId: {
          _id: over.bowler?._id,
          name: over.bowler?.name
        },
        // totalRuns: over.balls.deliveries((sum, b) => sum + b.runs, 0),
        // totalWickets: over.deliveries.filter(b => b.isWicket).length,
        balls: over.deliveries.map((ball, i) => ({
          ballNumber: i + 1,
          batsman: {
            _id: ball.batsman?._id,
            name: ball.batsman?.name
          },
          runs: ball.runs,
          isWicket: ball.isWicket,
          wicketType: ball.wicketType || null
        }))
      })),
      batsmenStats: inning.batsmenStats?.map(player => ({
        player: {
          _id: player._id,
          name: player.name
        },
        runs: player.runs || 0,
        ballsFaced: player.ballsFaced || 0,
        status: player.status || "Not Available"
      })) || [],
      bowlersStats: inning.bowlersStats?.map(player => ({
        player: {
          _id: player._id,
          name: player.name
        },
        overs: player.overs || 0,
        wickets: player.wickets || 0,
        runsConceded: player.runsConceded || 0
      })) || []
    }));
    // console.log("fullScorecard", fullScorecard)
    // Structure ballByBall
    const ballByBall = match.innings.flatMap(inning =>
      inning.overs.flatMap(over =>
        over.deliveries.map((ball, i) => ({
          overNumber: over.overNumber,
          ballNumber: i + 1,
          batsman: {
            _id: ball.batsman?._id,
            name: ball.batsman?.name
          },
          bowler: {
            _id: ball.bowler?._id,
            name: ball.bowler?.name
          },
          runs: ball.runs,
          isWicket: ball.isWicket,
          wicketType: ball.wicketType || null
        }))
      )
    );
    // console.log("ballByBall", ballByBall)
    console.log("response")
    // Send response
    // return res.json(200);
    return res.status(200).json({
      success: true,
      data: {
        matchInfo,
        tournamentInfo,
        teamsInfo,
        innings,
        fullScorecard,
        ballByBall
      }
    });
  } catch (error) {
    console.error('Error fetching full match details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// ✏️ Update Match Details
export const updateMatch = async (req, res) => {
  try {
    const { teams, date, venue, status, scorecard } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      { teams, date, venue, status, scorecard },
      { new: true }
    ).populate("tournament teams scorecard");

    if (!updatedMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Match updated successfully",
        match: updatedMatch,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ❌ Delete a Match
export const deleteMatch = async (req, res) => {
  try {
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);

    if (!deletedMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Match deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✏️ Update Match Details (for updating innings)
export const updateMatchDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      matchId,
      battingTeamId,
      strikerId,
      nonStrikerId,
      bowlerId,
      runs,
      ballType,
      legalDeliveries,
      isWicket,
      overNumber,
      ballNumber
    } = req.body;

    // 1. Find the match and current inning
    const match = await Match.findById(matchId).session(session);
    if (!match) throw new Error('Match not found');

    const currentInning = await Innings.findOne({
      match: matchId,
      battingTeam: battingTeamId,
    }).session(session).populate('overs');

    if (!currentInning) throw new Error('No active inning found for batting team');

    // 2. Find the correct over using overNumber
    console.log(overNumber, ballNumber) 
    const over = currentInning.overs.find(o => o.overNumber === (overNumber+1));
    console.log(over)
    if (!over) throw new Error(`Over ${overNumber} not found`);

    const populatedOver = await Over.findById(over._id).session(session);

    // 3. Create and save the ball record
    const ball = new Ball({
      tournament: match.tournament,
      match: matchId,
      overNumber,
      ballNumber : legalDeliveries,
      bowler: bowlerId,
      batsman: strikerId,
      runs,
      extraType: ballType === 'normal' ? 'none' : ballType,
      extras: ['wide', 'no ball'].includes(ballType) ? 1 : 0,
      isWicket,
      wicketType: isWicket ? 'bowled' : 'none',
      dismissedBatsman: isWicket ? strikerId : null
    });
    await ball.save({ session });

    // 4. Update over
    populatedOver.deliveries.push(ball._id);
    populatedOver.totalRuns += runs;

    if (ballType === 'wide' || ballType === 'no ball') {
      populatedOver.totalRuns += 1;
    }

    if (isWicket) {
      populatedOver.totalWickets += 1;
    }

    // Initialize extras if not present
    populatedOver.extras ||= { wides: 0, noBalls: 0, byes: 0, legByes: 0 };

    switch (ballType) {
      case 'wide': populatedOver.extras.wides += 1; break;
      case 'no ball': populatedOver.extras.noBalls += 1; break;
      case 'bye': populatedOver.extras.byes += runs; break;
      case 'leg bye': populatedOver.extras.legByes += runs; break;
    }

    populatedOver.isCompleted = populatedOver.deliveries.filter(
      async (ballId) => {
        const b = await Ball.findById(ballId);
        return b && !['wide', 'no ball'].includes(b.extraType);
      }
    ).length >= 6;

    await populatedOver.save({ session });

    // 5. Update inning
    currentInning.totalRuns += runs;
    if (ballType === 'wide' || ballType === 'no ball') currentInning.totalRuns += 1;
    if (isWicket) currentInning.totalWickets += 1;

    currentInning.extras ||= { wides: 0, noBalls: 0, byes: 0, legByes: 0 };

    switch (ballType) {
      case 'wide': currentInning.extras.wides += 1; break;
      case 'no ball': currentInning.extras.noBalls += 1; break;
      case 'bye': currentInning.extras.byes += runs; break;
      case 'leg bye': currentInning.extras.legByes += runs; break;
    }

    // if (!['wide', 'no ball'].includes(ballType)) {
    currentInning.oversPlayed = overNumber;
    // }

    // 6. Update batsman stats
    let batsmanStat = currentInning.batsmenStats.find(stat =>
      stat.player.toString() === strikerId
    );
    if (!batsmanStat) {
      batsmanStat = {
        player: strikerId,
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        status: "Not Out"
      };
      currentInning.batsmenStats.push(batsmanStat);
    }

    if (ballType === 'normal') {
      batsmanStat.runs += runs;
      batsmanStat.ballsFaced += 1;
      if (runs === 4) batsmanStat.fours += 1;
      if (runs === 6) batsmanStat.sixes += 1;
    } else if (ballType === 'bye' || ballType === 'leg bye') {
      batsmanStat.ballsFaced += 1;
    }
    batsmanStat.strikeRate = (batsmanStat.runs / batsmanStat.ballsFaced) * 100;

    if (isWicket) batsmanStat.status = "Out";

    // 7. Update bowler stats
    let bowlerStat = currentInning.bowlersStats.find(stat =>
      stat.player.toString() === bowlerId
    );
    if (!bowlerStat) {
      bowlerStat = {
        player: bowlerId,
        overs: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        economy: 0
      };
      currentInning.bowlersStats.push(bowlerStat);
    }

    bowlerStat.runsConceded += runs;
    if (ballType === 'wide' || ballType === 'no ball') bowlerStat.runsConceded += 1;
    if (isWicket) bowlerStat.wickets += 1;
    // const legalBallsInOver = newThisOver.filter(b => !b.includes('WD') && !b.includes('NB')).length;
    console.log("legalDel", legalDeliveries)
    // const fullOvers = Math.floor(legalDeliveries / 6);
    const fullOvers = overNumber;
    let remainingBalls = legalDeliveries%6;
    // legalDeliveries==6 ? fullOvers += 1 : remainingBalls = legalDeliveries%6;
    bowlerStat.overs = fullOvers + (remainingBalls / 10);
    bowlerStat.economy = bowlerStat.runsConceded / (bowlerStat.overs || 1);

    // 8. Fall of wickets
    if (isWicket) {
      currentInning.fallOfWickets.push({
        wicketNumber: currentInning.totalWickets,
        playerOut: strikerId,
        runsAtFall: currentInning.totalRuns,
        oversAtFall: fullOvers + (remainingBalls / 10)
      });
    }

    // 9. Check inning & match completion
    if (currentInning.totalWickets >= 10 || overNumber >= 5) {
      currentInning.isCompleted = true;

      const completedInnings = await Innings.countDocuments({
        match: matchId,
        isCompleted: true
      }).session(session);

      if (completedInnings === 2) {
        match.status = 'completed';
        match.result = determineMatchResult(match);
      }
    } 

    await currentInning.save({ session });
    await match.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: {
        match,
        inning: currentInning,
        over: populatedOver,
        ball
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating match details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update match details'
    });
  } finally {
    session.endSession();
  }
};

function determineMatchResult(match) {
  return 'Match completed'; // You can enhance this later.
}
