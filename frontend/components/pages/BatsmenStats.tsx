import React from 'react';
import { Player, PlayerStats } from './types';

interface BatsmenStatsProps {
  striker: Player;
  nonStriker: Player;
  strikerStats: PlayerStats;
  nonStrikerStats: PlayerStats;
}

const BatsmenStats: React.FC<BatsmenStatsProps> = ({
  striker,
  nonStriker,
  strikerStats,
  nonStrikerStats,
}) => (
  <div className="mt-4 grid grid-cols-3 text-center text-sm bg-green-700 p-3 rounded font-medium text-white">
    <div>{striker.name}*</div>
    <div>{strikerStats.runs} ({strikerStats.balls})</div>
    <div>SR: {((strikerStats.runs / (strikerStats.balls || 1)) * 100 || 0).toFixed(2)}</div>

    <div>{nonStriker.name}</div>
    <div>{nonStrikerStats.runs} ({nonStrikerStats.balls})</div>
    <div>SR: {((nonStrikerStats.runs / (nonStrikerStats.balls || 1)) * 100 || 0).toFixed(2)}</div>
  </div>
);

export default BatsmenStats;