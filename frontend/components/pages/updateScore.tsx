'use client';
import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Player {
  _id: string;
  name: string;
}

interface Team {
  _id: string;
  name: string;
  players: Player[];
}

interface Match {
  _id: string;
  teams: Team[];
  venue: string;
  date: string;
}

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
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [thisOver, setThisOver] = useState<string[]>([]);
  const [ballType, setBallType] = useState('normal');
  const [isWicket, setIsWicket] = useState(false);
  const [newBatterId, setNewBatterId] = useState<string>('');
  const [newBowlerId, setNewBowlerId] = useState<string>('');
  const [striker, setStriker] = useState(initialStriker);
  const [nonStriker, setNonStriker] = useState(initialNonStriker);
  const [bowler, setBowler] = useState(initialBowler);
  const [strikerStats, setStrikerStats] = useState({ runs: 0, balls: 0 });
  const [nonStrikerStats, setNonStrikerStats] = useState({ runs: 0, balls: 0 });
  const [bowlerStats, setBowlerStats] = useState({ overs: 0, balls: 0, runs: 0 });
  const [currentRun, setCurrentRun] = useState<number | null>(null);
  const [showNewBatterModal, setShowNewBatterModal] = useState(false);
  const [showNewBowlerModal, setShowNewBowlerModal] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const bowlingTeam = match.teams.find((t) => t._id !== battingTeam._id)!;

  const rotateStrike = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);

    const tempStats = strikerStats;
    setStrikerStats(nonStrikerStats);
    setNonStrikerStats(tempStats);
  };

  const getDeliveryNotation = () => {
    if (ballType === 'normal') return `${currentRun}`;
    if (ballType === 'wide') return currentRun && currentRun > 0 ? `WD+${currentRun}` : 'WD';
    if (ballType === 'no ball') return currentRun && currentRun > 0 ? `NB+${currentRun}` : 'NB';
    if (ballType === 'bye') return `B${currentRun}`;
    if (ballType === 'leg bye') return `LB${currentRun}`;
    return '';
  };


  
  const handleBallUpdate = async () => {
    if (currentRun === null) return;
    const isIllegalDelivery = ballType === 'wide' || ballType === 'no ball';
    const isExtra = ballType !== 'normal';
    const legalDelivery = !isIllegalDelivery;
    
    // const isExtra = ballType === 'wide' || ballType === 'no ball';
    // const legalDelivery = !isExtra;
  
    const newBatter = battingTeam.players.find((p) => p._id === newBatterId); // <-- ADD THIS LINE
  
    // Stop and ask for new batter if needed
    if (isWicket && !newBatter) {
      setShowNewBatterModal(true);
      return;
    }

    // If 6 legal balls already, ask for new bowler
      const newBowler = bowlingTeam.players.find((p) => p._id === newBowlerId); // <-- ADD THIS LINE

      if (legalDelivery && thisOver.filter((b) => !b.includes('WD') && !b.includes('NB')).length >= 6 && !newBowlerId) {
        setShowNewBowlerModal(true);
        return;
      }      

  
    const totalRuns = isExtra ? 1 + currentRun : currentRun;
    const delivery = getDeliveryNotation(); // This function returns things like “1”, “WD”, “NB+1”, etc.
  
    const payload = {
      matchId: match._id,
      battingTeamId: battingTeam._id,
      strikerId: striker._id,
      nonStrikerId: nonStriker._id,
      bowlerId: bowler._id,
      runs: currentRun,
      ballType,
      isWicket,
      newBatterId: isWicket ? newBatter?._id : null,
    };
  
    try {
      await fetch(`${BASE_URL}/live/updateBall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      // Add delivery to over summary
      setThisOver((prev) => [...prev, delivery]);
  
      // Update team score
      setRuns((prev) => prev + totalRuns);
  
      // Update batsman stats
      if (!isExtra) {
        setStrikerStats((prev) => ({
          runs: prev.runs + currentRun,
          balls: prev.balls + 1,
        }));
      } else if (ballType === 'bye' || ballType === 'leg bye') {
        setStrikerStats((prev) => ({
          ...prev,
          balls: prev.balls + 1,
        }));
      }
  
      // Update bowler stats
      setBowlerStats((prev) => ({
        ...prev,
        runs: prev.runs + totalRuns,
      }));
  
      // Inside legalDelivery check after incrementing ball
      if (legalDelivery) {
        setBowlerStats((prev) => {
          const totalBalls = prev.balls + 1;
          return {
            ...prev,
            balls: totalBalls,
            overs: Math.floor(totalBalls / 6),
          };
        });
        setBalls((prev) => prev + 1);
      }

  
      // Rotate strike if needed
      const rotate = 
        (ballType === 'normal' || ballType === 'bye' || ballType === 'leg bye') && currentRun % 2 === 1 ||
        (ballType === 'wide' && currentRun % 2 === 1);
  
      if (rotate) rotateStrike();
  
      // Handle wicket
      if (isWicket) {
        setWickets((prev) => prev + 1);
        setShowNewBatterModal(true);
        return;
      }
  
      // Over completion check based on legal deliveries
      const legalBalls = [...thisOver, delivery].filter((b) => !b.includes('WD') && !b.includes('NB')).length;
  
      if (legalBalls === 6) {
        setShowNewBowlerModal(true);
        rotateStrike();
        setThisOver([]); // start fresh for next over
      }
  
      // Reset inputs
      setCurrentRun(null);
      setBallType('normal');
      setIsWicket(false);
    } catch (err) {
      console.error('Update failed', err);
    }
  };
  

  const handleNewBatterSelect = () => {
    const newBatter = battingTeam.players.find((p) => p._id === newBatterId);
    if (newBatter) {
      setStriker(newBatter);
      setStrikerStats({ runs: 0, balls: 0 });
      setShowNewBatterModal(false);
      setNewBatterId('');
    }
  };

  const handleNewBowlerSelect = () => {
    const newB = bowlingTeam.players.find((p) => p._id === newBowlerId);
    if (newB) {
      setBowler(newB);
      setBowlerStats({ overs: 0, balls: 0, runs: 0 });
      setShowNewBowlerModal(false);
      setNewBowlerId('');
      setThisOver([]);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setRuns(last.runs);
    setWickets(last.wickets);
    setBalls(last.balls);
    setThisOver(last.thisOver);
    setStriker(last.striker);
    setNonStriker(last.nonStriker);
    setBowler(last.bowler);
    setStrikerStats(last.strikerStats);
    setNonStrikerStats(last.nonStrikerStats);
    setBowlerStats(last.bowlerStats);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-green-700 text-white text-center py-3 rounded-t-xl font-bold text-lg">
        {match.teams[0].name} v/s {match.teams[1].name}
      </div>
  
      <div className="bg-white shadow-md border px-6 py-4">
        <div className="text-xl font-bold text-black">{battingTeam.name}, 1st inning</div>
        <div className="text-3xl font-bold mt-1 text-green-600">
          {runs} - {wickets} <span className="text-gray-600 text-lg">({Math.floor(balls / 6)}.{balls % 6})</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">CRR: {(runs / (balls / 6 || 1)).toFixed(2)}</div>
      </div>
  
      <div className="mt-4 grid grid-cols-3 text-center text-sm bg-green-700 p-3 rounded font-medium text-white">
        <div>{striker.name}*</div>
        <div>{strikerStats.runs} ({strikerStats.balls})</div>
        <div>SR: {((strikerStats.runs / strikerStats.balls) * 100 || 0).toFixed(2)}</div>
  
        <div>{nonStriker.name}</div>
        <div>{nonStrikerStats.runs} ({nonStrikerStats.balls})</div>
        <div>SR: {((nonStrikerStats.runs / nonStrikerStats.balls) * 100 || 0).toFixed(2)}</div>
      </div>
  
      <div className="mt-2 text-sm text-center text-gray-700">
        <div>{bowler.name} - {bowlerStats.overs}.{bowlerStats.balls % 6} overs, {bowlerStats.runs} runs</div>
      </div>
  
      <div className="mt-4 flex justify-center items-center space-x-2">
        {thisOver.map((ball, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-gray-200 text-sm font-semibold text-gray-800">{ball}</span>
        ))}
      </div>
  
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-800">
        {['normal', 'wide', 'no ball', 'bye', 'leg bye'].map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input
              type="radio"
              name="ballType"
              checked={ballType === type}
              onChange={() => setBallType(type)}
            />
            {type.toUpperCase()}
          </label>
        ))}
        <label className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            checked={isWicket}
            onChange={() => setIsWicket(!isWicket)}
          />
          Wicket
        </label>
      </div>
  
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[0, 1, 2, 3, 4, 5, 6].map((run) => (
          <button
            key={run}
            className={`py-2 rounded-full font-semibold text-lg ${
              currentRun === run ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setCurrentRun(run)}
          >
            {run}
          </button>
        ))}
      </div>
  
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleBallUpdate}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold"
        >
          Update Ball
        </button>
      </div>
  
      {/* New Batter Modal */}
      {showNewBatterModal && (
        <div className="mt-6 bg-white p-4 border rounded shadow">
          <label className="font-medium block mb-1">Select New Batter</label>
          <select
            onChange={(e) => setNewBatterId(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Choose a batter</option>
            {battingTeam.players.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleNewBatterSelect}
            disabled={!newBatterId}
          >
            Confirm
          </button>
        </div>
      )}
  
      {/* New Bowler Modal */}
      {showNewBowlerModal && (
        <div className="mt-6 bg-white p-4 border rounded shadow">
          <label className="font-medium block mb-1">Select New Bowler</label>
          <select
            onChange={(e) => setNewBowlerId(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Choose a bowler</option>
            {bowlingTeam.players.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleNewBowlerSelect}
            disabled={!newBowlerId}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveUpdatePage;