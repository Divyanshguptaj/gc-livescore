import React from 'react';

interface MatchHeaderProps {
  team1: string;
  team2: string;
  battingTeam: string;
  innings: number
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ team1, team2, battingTeam,innings }) => (
  <>
    <div className="bg-green-700 text-white text-center py-3 rounded-t-xl font-bold text-lg">
      {team1} v/s {team2}
    </div>
    <div className="bg-white shadow-md border px-6 py-4">
      <div className="text-xl font-bold text-black">{battingTeam}, inning - {innings} </div>
    </div>
  </>
);

export default MatchHeader;