import React from 'react';

interface MatchHeaderProps {
  team1: string;
  team2: string;
  battingTeam: string;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ team1, team2, battingTeam }) => (
  <>
    <div className="bg-green-700 text-white text-center py-3 rounded-t-xl font-bold text-lg">
      {team1} v/s {team2}
    </div>
    <div className="bg-white shadow-md border px-6 py-4">
      <div className="text-xl font-bold text-black">{battingTeam}, 1st inning</div>
    </div>
  </>
);

export default MatchHeader;