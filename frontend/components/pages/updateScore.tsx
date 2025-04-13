'use client';
import React, { useEffect, useState } from 'react';

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
  striker,
  nonStriker,
  bowler,
}) => {
  const [runs, setRuns] = useState(92);
  const [wickets, setWickets] = useState(4);
  const [overs, setOvers] = useState('4.4');
  const [crr, setCrr] = useState('19.71');

  const [thisOver, setThisOver] = useState<string[]>(['2', '1', '4', '0', '1', 'WD']);

  const [currentRun, setCurrentRun] = useState<number | null>(null);
  const [ballType, setBallType] = useState<string>('normal');
  const [isWicket, setIsWicket] = useState<boolean>(false);

  const handleAddToOver = (value: string) => {
    setThisOver((prev) => [...prev, value]);
    // Update runs/wickets/overs based on logic and value
  };

  const handleBallUpdate = () => {
    const payload = {
      matchId: match._id,
      battingTeamId: battingTeam._id,
      strikerId: striker._id,
      nonStrikerId: nonStriker._id,
      bowlerId: bowler._id,
      runs: currentRun,
      ballType,
      isWicket,
    };
    console.log('Ball Update Payload:', payload);
    // Send to backend
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="bg-green-700 text-white text-center py-3 rounded-t-xl font-bold text-lg">
        {match.teams[0].name} v/s {match.teams[1].name}
      </div>

      {/* Inning Info */}
      <div className="bg-white shadow-md border px-6 py-4">
        <div className="text-xl font-bold text-black">
          {battingTeam.name}, 1st inning
        </div>
        <div className="text-3xl font-bold mt-1 text-green-600">
          {runs} - {wickets} <span className="text-gray-600 text-lg">({overs})</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">CRR: {crr}</div>
      </div>

      {/* Batters Info */}
      <div className="mt-4 grid grid-cols-3 text-center text-sm bg-green-700 p-3 rounded font-medium">
        <div>{striker.name}*</div>
        <div>5 (8)</div>
        <div>SR: 62.50</div>

        <div>{nonStriker.name}</div>
        <div>9 (3)</div>
        <div>SR: 300.00</div>
      </div>

      {/* Bowler Info */}
      <div className="mt-2 text-sm text-center text-gray-700">
        <div>{bowler.name} - 0.4 overs, 9 runs</div>
      </div>

      {/* This Over */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        {thisOver.map((ball, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full bg-gray-200 text-sm font-semibold text-gray-800"
          >
            {ball}
          </span>
        ))}
      </div>

      {/* Extras */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-800">
        {['Wide', 'No Ball', 'Bye', 'Leg Bye'].map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input
              type="radio"
              name="ballType"
              value={type.toLowerCase()}
              checked={ballType === type.toLowerCase()}
              onChange={() => setBallType(type.toLowerCase())}
            />
            {type}
          </label>
        ))}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isWicket}
            onChange={() => setIsWicket(!isWicket)}
          />
          Wicket
        </label>
      </div>

      {/* Run Buttons */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[0, 1, 2, 3, 4, 5, 6].map((run) => (
          <button
            key={run}
            className="bg-gray-200 hover:bg-gray-300 rounded-full text-lg py-2 text-gray-800 font-semibold"
            onClick={() => {
              setCurrentRun(run);
              handleAddToOver(run.toString());
            }}
          >
            {run}
          </button>
        ))}
      </div>

      {/* Update Button */}
      <div className="mt-6">
        <button
          onClick={handleBallUpdate}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold"
        >
          Update Ball
        </button>
      </div>
    </div>
  );
};

export default LiveUpdatePage;
