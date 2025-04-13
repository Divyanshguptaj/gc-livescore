import React from 'react';

interface OverTrackerProps {
  balls: string[];
}

const OverTracker: React.FC<OverTrackerProps> = ({ balls }) => (
  <div className="mt-4 flex justify-center items-center space-x-2">
    {balls.map((ball, i) => (
      <span key={i} className="px-3 py-1 rounded-full bg-gray-200 text-sm font-semibold text-gray-800">
        {ball}
      </span>
    ))}
  </div>
);

export default OverTracker;