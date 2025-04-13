import React from 'react';

interface ScoreboardProps {
  runs: number;
  wickets: number;
  overs: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ runs, wickets, overs }) => (
  <div className="bg-white shadow-md border px-6 py-4">
    <div className="text-3xl font-bold mt-1 text-green-600">
      {runs} - {wickets} <span className="text-gray-600 text-lg">({Math.floor(overs / 6)}.{overs % 6})</span>
    </div>
    <div className="text-sm text-gray-500 mt-1">
      CRR: {(runs / (overs / 6 || 1)).toFixed(2)}
    </div>
  </div>
);

export default Scoreboard;