import React from 'react';
import { Player } from '../../../types';

interface PlayerSelectionModalProps {
  isOpen: boolean;
  title: string;
  players: Player[];
  selectedId: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  isOpen,
  title,
  players,
  selectedId,
  onSelect,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select a player</option>
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!selectedId}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;