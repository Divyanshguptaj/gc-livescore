import { Tournament } from '@/types';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

interface Standing {
  team: {
    _id: string;
    name: string;
  };
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  netRunRate: number;
}

interface StatsOverviewProps {
  tournament: Tournament & {
    standings?: Standing[];
  };
}
 
export default function StatsOverview({ tournament }: StatsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tournament Stats</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Teams</p>
            <p className="text-2xl font-bold text-gray-900">{tournament.teams.length}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Matches</p>
            <p className="text-2xl font-bold text-gray-900">{tournament.matches?.length || 0}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Format</p>
            <p className="text-lg font-medium text-gray-900">{tournament.format}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="text-lg font-medium text-gray-900">{tournament.type}</p>
          </div>
        </div>
      </div>

      {tournament.standings && tournament.standings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Standings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">W</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">L</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tournament.standings
                  .sort((a: { points: number; netRunRate: number; }, b: { points: number; netRunRate: number; }) => b.points - a.points || b.netRunRate - a.netRunRate)
                  .map((standing: { team: { _id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; matchesPlayed: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; wins: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; losses: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; points: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; netRunRate: number; }, index: number) => (
                    <tr key={standing.team._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}. {standing.team.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{standing.matchesPlayed}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{standing.wins}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{standing.losses}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{standing.points}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {standing.netRunRate.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}