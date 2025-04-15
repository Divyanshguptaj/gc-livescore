// /components/core/tournamentPage/TournamentHeader.tsx
import { Tournament } from '@/types';

interface Props {
  tournament: Tournament;
}

export default function TournamentHeader({ tournament }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {tournament.name}
      </h1>
      <p className="text-gray-600 mb-2">{tournament.description}</p>
      <div className="text-sm text-gray-500">
        <p><strong>Location:</strong> {tournament.location}</p>
        <p><strong>Dates:</strong> {new Date(tournament.startDate).toLocaleDateString()} — {new Date(tournament.endDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
} 