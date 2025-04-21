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
    const { matchId, battingTeamId, strikerId, nonStrikerId, bowlerId, overs } = req.body;

    // 1. Validate match
    const match = await Match.findById(matchId).session(session);
    if (!match) throw new Error('Match not found');

    // 2. Get batting and bowling teams
    const battingTeam = await Team.findById(battingTeamId).session(session);
    if (!battingTeam) throw new Error('Batting team not found');

    const bowlingTeamId = match.teams.find(id => id.toString() !== battingTeamId.toString());
    if (!bowlingTeamId) throw new Error('Bowling team could not be determined');

    const bowlingTeam = await Team.findById(bowlingTeamId).session(session);
    if (!bowlingTeam) throw new Error('Bowling team not found');

    // 3. Initialize batsmen stats for first inning
    const firstInningBatsmenStats = battingTeam.players.map(playerId => ({
      player: playerId,
      runs: 0,
      ballsFaced: playerId==strikerId ? 0 : -1,
      fours: 0,
      sixes: 0,
      isOut: false,
      outType: null,
      bowler: null,
      fielder: null,
      strikeRate: 0
    }));

    // 4. Initialize bowlers stats for first inning
    const firstInningBowlersStats = bowlingTeam.players.map(playerId => ({
      player: playerId,
      oversBowled: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      wides: 0,
      noBalls: 0
    }));

    // 5. Create the first over for first inning
    const firstInningFirstOver = new Over({
      matchId,
      overNumber: 1,
      deliveries: [],
      totalRuns: 0,
      totalWickets: 0,
      bowlerId: bowlerId,
    });
    const savedFirstInningFirstOver = await firstInningFirstOver.save({ session });

    // 6. Create first inning with all overs initialized
    const firstInningOvers = [savedFirstInningFirstOver._id];
    
    // Create empty overs for the rest of the innings
    for (let i = 2; i <= overs; i++) {
      const over = new Over({
        matchId,
        overNumber: i,
        deliveries: [],
        totalRuns: 0,
        totalWickets: 0,
        bowlerId: null, // Will be set when bowler is assigned
      });
      const savedOver = await over.save({ session });
      firstInningOvers.push(savedOver._id);
    }

    const firstInning = new Innings({
      match: matchId,
      battingTeam: battingTeamId,
      bowlingTeam: bowlingTeamId,
      overs: firstInningOvers,
      totalRuns: 0,
      totalWickets: 0,
      batsmenStats: firstInningBatsmenStats,
      bowlersStats: firstInningBowlersStats,
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

    // 7. Link overs to the first inning
    await Over.updateMany(
      { _id: { $in: firstInningOvers } },
      { inning: savedFirstInning._id },
      { session }
    );

    // 8. Prepare second inning with all overs initialized
    const secondInningBatsmenStats = bowlingTeam.players.map(playerId => ({
      player: playerId,
      runs: 0,
      ballsFaced: -1,
      fours: 0,
      sixes: 0,
      isOut: false,
      outType: null,
      bowler: null,
      fielder: null,
      strikeRate: 0
    }));

    const secondInningBowlersStats = battingTeam.players.map(playerId => ({
      player: playerId,
      oversBowled: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      wides: 0,
      noBalls: 0
    }));

    // Create all overs for second inning
    const secondInningOvers = [];
    for (let i = 1; i <= overs; i++) {
      const over = new Over({
        matchId,
        overNumber: i,
        deliveries: [],
        totalRuns: 0,
        totalWickets: 0,
        bowlerId: null, // Will be set when bowler is assigned
      });
      const savedOver = await over.save({ session });
      secondInningOvers.push(savedOver._id);
    }

    const secondInning = new Innings({
      match: matchId,
      battingTeam: bowlingTeamId,
      bowlingTeam: battingTeamId,
      overs: secondInningOvers,
      totalRuns: 0,
      totalWickets: 0,
      batsmenStats: secondInningBatsmenStats,
      bowlersStats: secondInningBowlersStats,
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0
      },
      currentBatsmen: [], // Will be set when inning starts
      currentBowlers: []  // Will be set when inning starts
    });
    const savedSecondInning = await secondInning.save({ session });

    // 9. Link overs to the second inning
    await Over.updateMany(
      { _id: { $in: secondInningOvers } },
      { inning: savedSecondInning._id },
      { session }
    );

    // 10. Update match with innings
    match.innings = [savedFirstInning._id, savedSecondInning._id];
    match.status = 'in_progress';
    await match.save({ session });

    // 11. Commit
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Match initialized successfully',
      data: {
        matchId,
        currentInning: savedFirstInning,
        secondInning: savedSecondInning,
        currentOver: savedFirstInningFirstOver
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

    res.status(201).json({
      success: true,
      message: "Match and innings created successfully",
      match: newMatch,
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
    console.log("object")

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
      console.log("match", matches)
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
    model: 'Tournament'
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
        path: 'batsmenStats.player',
        model: 'User',
        select: '_id name'
      },
      {
        path: 'bowlersStats.player',
        model: 'User',
        select: '_id name'
      },
      {
        path: 'overs',
        model: 'Over',
        populate: [
          {
            path: 'deliveries',
            model: 'Ball',
            populate: [
              { path: 'bowler', model: 'User', select: '_id name' },
              { path: 'batsman', model: 'User', select: '_id name' }
            ]
          },
          {
            path: 'bowlerId',
            model: 'User',
            select: '_id name'
          }
        ]
      }
    ]
  });


    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    // console.log("match", match.innings[0].overs[0].deliveries)
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
    // console.log("matchinfo", matchInfo)
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
      overs: inning.overs,
      bowlingTeam: {
        _id: inning.bowlingTeam._id,
        name: inning.bowlingTeam.name
      },
      totalRuns: inning.totalRuns,
      totalWickets: inning.totalWickets,
      oversPlayed: inning.totalOvers
    }));
    // console.log("match", match);
    // console.log("innings", innings[0].overs);
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
      oversPlayed: inning.oversPlayed, // this is not there 
      overs: (inning.overs || []).map(over => ({
        overNumber: over.overNumber,
        bowlerId: {
          _id: over.bowlerId?._id,
          name: over.bowlerId?.name
        },
        balls: (over.deliveries || []).map((ball, i) => ({
          ballNumber: i + 1,
          batsman: {
            _id: ball.batsman?._id,
            name: ball.batsman?.name
          },
          runs: ball.runs,
          extraType: ball.extraType,
          isWicket: ball.isWicket,
          wicketType: ball.wicketType || null
        }))
      })),
      batsmenStats: inning.batsmenStats?.map(stat => ({
        player: {
          _id: stat.player?._id,
          name: stat.player?.name
        },
        runs: stat.runs || 0,
        ballsFaced: stat.ballsFaced || 0,
        status: stat.status || "Not Available"
      })) || [],
      bowlersStats: inning.bowlersStats?.map(player => ({
        player: {
          _id: player.player._id,
          name: player.player.name
        },
        overs: player.overs || 0,
        wickets: player.wickets || 0,
        runsConceded: player.runsConceded || 0
      })) || []
    }));
    console.log("fullScorecard", fullScorecard[0].overs[0].balls);

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
    // console.log(ballByBall)
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

    // 2. Find or create the current over
    
    let over = currentInning.overs.find(o => o.overNumber === (overNumber+1));
    if (!over) {
      over = new Over({ 
        overNumber,
        tournament: match.tournament,
        match: matchId,
        inning: currentInning._id,
        bowler: bowlerId,
      });
      await over.save({ session });
      currentInning.overs.push(over._id);
    }else{
      over.bowlerId = bowlerId
      await over.save({ session });
    }

    const populatedOver = await Over.findById(over._id).session(session);

    // 3. Create and save the ball record
    const ball = new Ball({
      tournament: match.tournament,
      match: matchId,
      inning: currentInning._id,
      overNumber,
      ballNumber: ballNumber,
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
      populatedOver.totalRuns += 1; // Add extra run for wide/no-ball
    }

    if (isWicket) {
      populatedOver.totalWickets += 1;
    }

    // Initialize extras if not present
    populatedOver.extras = populatedOver.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0 };

    switch (ballType) {
      case 'wide': populatedOver.extras.wides += 1; break;
      case 'no ball': populatedOver.extras.noBalls += 1; break;
      case 'bye': populatedOver.extras.byes += runs; break;
      case 'leg bye': populatedOver.extras.legByes += runs; break;
    }

    // Check if over is completed (6 legal deliveries)
    const legalDeliveriesInOver = populatedOver.deliveries.filter(d => {
      const delivery = d.extraType || 'normal';
      return !['wide', 'no ball'].includes(delivery);
    }).length;

    populatedOver.isCompleted = legalDeliveriesInOver >= 6;
    await populatedOver.save({ session });

    // 5. Update inning
    currentInning.totalRuns += runs;
    if (ballType === 'wide' || ballType === 'no ball') currentInning.totalRuns += 1;
    if (isWicket) currentInning.totalWickets += 1;

    currentInning.extras = currentInning.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0 };

    switch (ballType) {
      case 'wide': currentInning.extras.wides += 1; break;
      case 'no ball': currentInning.extras.noBalls += 1; break;
      case 'bye': currentInning.extras.byes += runs; break;
      case 'leg bye': currentInning.extras.legByes += runs; break;
    }

    // Update overs played (only count completed overs)
    currentInning.oversPlayed = Math.floor(legalDeliveries / 6);

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
    batsmanStat.strikeRate = batsmanStat.ballsFaced > 0 
      ? (batsmanStat.runs / batsmanStat.ballsFaced) * 100 
      : 0;

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

    // Calculate overs correctly (e.g., 3.2 overs = 3 overs and 2 balls)
    const fullOvers = Math.floor(legalDeliveries / 6);
    const remainingBalls = legalDeliveries % 6;
    bowlerStat.overs = fullOvers + (remainingBalls / 10);
    bowlerStat.economy = bowlerStat.overs > 0 
      ? bowlerStat.runsConceded / bowlerStat.overs 
      : 0;

    // 8. Fall of wickets
    if (isWicket) {
      currentInning.fallOfWickets.push({
        wicketNumber: currentInning.totalWickets,
        playerOut: strikerId,
        runsAtFall: currentInning.totalRuns,
        oversAtFall: bowlerStat.overs
      });
    }

    // 9. Check inning & match completion
    if (currentInning.totalWickets >= 10 || currentInning.oversPlayed >= match.oversPerInning) {
      currentInning.isCompleted = true;

      const completedInnings = await Innings.countDocuments({
        match: matchId,
        isCompleted: true
      }).session(session);

      if (completedInnings === match.teams.length) {
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
  return 'Match completed';
}
