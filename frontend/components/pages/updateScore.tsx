'use client';
import React, { useState } from 'react';
import { Match, Team, Player, PlayerStats, BowlerStatsModel } from './types';
import MatchHeader from './MatchHeader';
import Scoreboard from './Scoreboard';
import BatsmenStats from './BatsmenStats';
import BowlerStats from './BowlerStats';
import OverTracker from './OverTracker';
import BallInputForm from './BallInputForm';
import PlayerSelectionModal from './PlayerSelectionModal';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface LiveUpdatePageProps {
  match: Match;
  battingTeam: Team;
  striker: Player;
  nonStriker: Player;
  bowler: Player;
}

const LiveUpdatePage: React.FC<LiveUpdatePageProps> = ({
  match,
  battingTeam,
  striker: initialStriker,
  nonStriker: initialNonStriker,
  bowler: initialBowler,
}) => {
  const [gameState, setGameState] = useState({
    runs: 0,
    wickets: 0,
    balls: 0,
    thisOver: [] as string[],
    striker: initialStriker,
    nonStriker: initialNonStriker,
    bowler: initialBowler,
    strikerStats: { runs: 0, balls: 0 },
    nonStrikerStats: { runs: 0, balls: 0 },
    bowlerStats: { runs: 0, balls: 0, overs: 0 },
  });

  const [inputState, setInputState] = useState({
    ballType: 'normal',
    isWicket: false,
    currentRun: null as number | null,
  });

  const [modalState, setModalState] = useState({
    showNewBatter: false,
    showNewBowler: false,
    newBatterId: '',
    newBowlerId: '',
    awaitingAction: false,
  });

  const [history, setHistory] = useState<any[]>([]);
  const bowlingTeam = match.teams.find((t) => t._id !== battingTeam._id)!;

  const rotateStrike = () => {
    setGameState(prev => ({
      ...prev,
      striker: prev.nonStriker,
      nonStriker: prev.striker,
      strikerStats: prev.nonStrikerStats,
      nonStrikerStats: prev.strikerStats,
    }));
  };

  const handleBallUpdate = async () => {
    if (inputState.currentRun === null || modalState.awaitingAction) return;
    
    const { ballType, isWicket, currentRun } = inputState;
    const isIllegalDelivery = ballType === 'wide' || ballType === 'no ball';
    const isExtra = ballType !== 'normal';
    const legalDelivery = !isIllegalDelivery;
    const totalRuns = isExtra ? (ballType === 'wide' || ballType === 'no ball' ? 1 + (currentRun || 0) : currentRun) : currentRun;

    // Save current state for undo
    setHistory(prev => [...prev, gameState]);

    // Calculate new state
    const newStrikerStats = ballType === 'normal' 
      ? { ...gameState.strikerStats, runs: gameState.strikerStats.runs + (currentRun || 0), balls: gameState.strikerStats.balls + 1 }
      : (ballType === 'bye' || ballType === 'leg bye')
        ? { ...gameState.strikerStats, balls: gameState.strikerStats.balls + 1 }
        : gameState.strikerStats;

    const newBowlerStats = {
      ...gameState.bowlerStats,
      runs: gameState.bowlerStats.runs + (totalRuns || 0),
      balls: legalDelivery ? gameState.bowlerStats.balls + 1 : gameState.bowlerStats.balls,
      overs: legalDelivery ? Math.floor((gameState.bowlerStats.balls + 1) / 6) : gameState.bowlerStats.overs,
    };

    const newBalls = legalDelivery ? gameState.balls + 1 : gameState.balls;
    const newRuns = gameState.runs + (totalRuns || 0);
    const newWickets = isWicket ? gameState.wickets + 1 : gameState.wickets;

    const delivery = getDeliveryNotation(ballType, currentRun);
    const newThisOver = [...gameState.thisOver, delivery];

    // Check for strike rotation
    const shouldRotate = 
      (ballType === 'normal' || ballType === 'bye' || ballType === 'leg bye') && (currentRun || 0) % 2 === 1 ||
      (ballType === 'wide' && (currentRun || 0) % 2 === 1) //|| 
      //  && (currentRun || 0) % 2 === 1;

    // Check for over completion (6 legal deliveries)
    const legalBallsInOver = newThisOver.filter(b => !b.includes('WD') && !b.includes('NB')).length;

    // Update game state
    setGameState(prev => ({
      ...prev,
      runs: newRuns,
      wickets: newWickets,
      balls: newBalls,
      thisOver: newThisOver,
      newStrikerStats : newStrikerStats,
      bowlerStats: newBowlerStats,
      striker: shouldRotate ? prev.nonStriker : prev.striker,
      nonStriker: shouldRotate ? prev.striker : prev.nonStriker,
      strikerStats: shouldRotate ? prev.nonStrikerStats : newStrikerStats,
      nonStrikerStats: shouldRotate ? newStrikerStats : prev.nonStrikerStats,
    }));

    // Handle wicket
    if (isWicket) {
      setModalState(prev => ({ ...prev, showNewBatter: true, awaitingAction: true }));
      return;
    }

    // Handle over completion
    if (legalBallsInOver >= 6) {
      rotateStrike();
      setModalState(prev => ({ ...prev, showNewBowler: true, awaitingAction: true }));
      return;
    }

    // Reset inputs
    setInputState({
      ballType: 'normal',
      isWicket: false,
      currentRun: null,
    });
  };

  const handleNewBatterSelect = () => {
    const newBatter = battingTeam.players.find((p) => p._id === modalState.newBatterId);
    if (newBatter) {
      setGameState(prev => ({
        ...prev,
        striker: newBatter,
        strikerStats: { runs: 0, balls: 0 },
      }));
      setModalState(prev => ({
        ...prev,
        showNewBatter: false,
        newBatterId: '',
        awaitingAction: false,
      }));
      setInputState({
        ballType: 'normal',
        isWicket: false,
        currentRun: null,
      });
    }
  };

  const handleNewBowlerSelect = () => {
    const newBowler = bowlingTeam.players.find((p) => p._id === modalState.newBowlerId);
    if (newBowler) {
      setGameState(prev => ({
        ...prev,
        bowler: newBowler,
        bowlerStats: { runs: 0, balls: 0, overs: 0 },
        thisOver: [],
      }));
      setModalState(prev => ({
        ...prev,
        showNewBowler: false,
        newBowlerId: '',
        awaitingAction: false,
      }));
      setInputState({
        ballType: 'normal',
        isWicket: false,
        currentRun: null,
      });
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setGameState(lastState);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  const getDeliveryNotation = (type: string, runs: number | null) => {
    console.log(type,runs )
    if (type === 'wicket') return runs && runs > 0 ? `W+${runs}` : 'W';
    if (type === 'normal') return `${runs}`;
    if (type === 'wide') return runs && runs > 0 ? `WD+${runs}` : 'WD';
    if (type === 'no ball') return runs && runs > 0 ? `NB+${runs}` : 'NB';
    if (type === 'bye') return `B${runs}`;
    if (type === 'leg bye') return `LB${runs}`;
    return '';
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <MatchHeader 
        team1={match.teams[0].name} 
        team2={match.teams[1].name} 
        battingTeam={battingTeam.name}
      />
      
      <Scoreboard 
        runs={gameState.runs} 
        wickets={gameState.wickets} 
        overs={gameState.balls}
      />
      
      <BatsmenStats 
        striker={gameState.striker} 
        nonStriker={gameState.nonStriker}
        strikerStats={gameState.strikerStats}
        nonStrikerStats={gameState.nonStrikerStats}
      />
      
      <BowlerStats 
        bowler={gameState.bowler}
        bowlerStats={gameState.bowlerStats}
      />
      
      <OverTracker balls={gameState.thisOver} />
      
      <BallInputForm
        ballType={inputState.ballType}
        isWicket={inputState.isWicket}
        currentRun={inputState.currentRun}
        awaitingAction={modalState.awaitingAction}
        onBallTypeChange={(type) => setInputState(prev => ({ ...prev, ballType: type }))}
        onWicketChange={(isWicket) => setInputState(prev => ({ ...prev, isWicket }))}
        onRunSelect={(run) => setInputState(prev => ({ ...prev, currentRun: run }))}
        onUpdateBall={handleBallUpdate}
        onUndo={handleUndo}
        canUndo={history.length > 0}
      />
      
      <PlayerSelectionModal
        isOpen={modalState.showNewBatter}
        title="Select New Batter"
        players={battingTeam.players.filter(p => p._id !== gameState.nonStriker._id)}
        selectedId={modalState.newBatterId}
        onSelect={(id) => setModalState(prev => ({ ...prev, newBatterId: id }))}
        onConfirm={handleNewBatterSelect}
        onClose={() => setModalState(prev => ({ ...prev, showNewBatter: false }))}
      />
      
      <PlayerSelectionModal
        isOpen={modalState.showNewBowler}
        title="Select New Bowler"
        players={bowlingTeam.players.filter(p => p._id !== gameState.bowler._id)}
        selectedId={modalState.newBowlerId}
        onSelect={(id) => setModalState(prev => ({ ...prev, newBowlerId: id }))}
        onConfirm={handleNewBowlerSelect}
        onClose={() => setModalState(prev => ({ ...prev, showNewBowler: false }))}
      />
    </div>
  );
};

export default LiveUpdatePage;