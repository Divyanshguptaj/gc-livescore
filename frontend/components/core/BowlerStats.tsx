import React from 'react';
import { Player, BowlerStatsModel } from '../pages/types';

interface BowlerStatsProps {
  bowler: Player;
  bowlerStats: BowlerStatsModel;
}

const BowlerStats: React.FC<BowlerStatsProps> = ({ bowler, bowlerStats }) => (
  <div className="mt-2 text-sm text-center text-gray-700">
    <div>
      {bowler.name} - {bowlerStats.overs}.{bowlerStats.balls % 6} overs, {bowlerStats.runs} runs
    </div>
  </div>
);

export default BowlerStats;