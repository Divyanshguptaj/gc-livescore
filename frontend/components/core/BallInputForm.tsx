import React from 'react';
import { BallTypeOption } from '../pages/types';

const BALL_TYPES: BallTypeOption[] = [
  { value: 'normal', label: 'NORMAL' },
  { value: 'wide', label: 'WIDE' },
  { value: 'no ball', label: 'NO BALL' },
  { value: 'bye', label: 'BYE' },
  { value: 'leg bye', label: 'LEG BYE' },
];

interface BallInputFormProps {
  ballType: string;
  isWicket: boolean;
  currentRun: number | null;
  awaitingAction: boolean;
  isLoading: boolean;
  onBallTypeChange: (type: string) => void;
  onWicketChange: (isWicket: boolean) => void;
  onRunSelect: (run: number) => void;
  onUpdateBall: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

const BallInputForm: React.FC<BallInputFormProps> = ({
  ballType,
  isWicket,
  currentRun,
  awaitingAction,
  onBallTypeChange,
  onWicketChange,
  onRunSelect,
  onUpdateBall,
  onUndo,
  canUndo,
}) => (
  <>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-800">
      {BALL_TYPES.map((type) => (
        <label key={type.value} className="flex items-center gap-2">
          <input
            type="radio"
            name="ballType"
            checked={ballType === type.value}
            onChange={() => onBallTypeChange(type.value)}
            disabled={awaitingAction}
          />
          {type.label}
        </label>
      ))}
      <label className="flex items-center gap-2 col-span-2">
        <input
          type="checkbox"
          checked={isWicket}
          onChange={(e) => onWicketChange(e.target.checked)}
          disabled={awaitingAction}
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
          } ${awaitingAction ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !awaitingAction && onRunSelect(run)}
          disabled={awaitingAction}
        >
          {run}
        </button>
      ))}
    </div>

    <div className="mt-6 flex gap-4">
      <button
        onClick={onUpdateBall}
        className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold ${
          currentRun === null || awaitingAction ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={currentRun === null || awaitingAction}
      >
        Update Ball
      </button>
      <button
        onClick={onUndo}
        className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md font-semibold disabled:opacity-50"
        disabled={!canUndo}
      >
        Undo
      </button>
    </div>
  </>
);

export default BallInputForm;