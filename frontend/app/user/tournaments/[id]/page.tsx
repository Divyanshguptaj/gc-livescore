'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Tournament, Match } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiCalendar, FiMapPin, FiUsers, FiAward, FiPlus, FiEdit2 } from 'react-icons/fi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { toast } from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function TournamentDetailPage({ params }: { params: { id: string } }) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentRes, matchesRes] = await Promise.all([
          axios.get(`${BASE_URL}/tournament/getTournamentById/${id}`),
          axios.get(`${BASE_URL}/tournament/${id}/getMatchByTournamentId`)
        ]);
        setTournament(tournamentRes.data.tournament);
        setMatches(matchesRes.data.matches);
      } catch (err) {
        setError('Failed to load tournament data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [tournamentRes, matchesRes] = await Promise.all([
        axios.get(`${BASE_URL}/tournament/${id}`),
        axios.get(`${BASE_URL}/tournament/${id}/getMatchByTournamentId`)
      ]);
      setTournament(tournamentRes.data.tournament);
      setMatches(matchesRes.data.matches);
      toast.success('Data refreshed successfully!', {
        position: 'bottom-right',
        style: {
          background: '#4BB543',
          color: '#fff'
        }
      });
    } catch (err) {
      toast.error('Failed to refresh data', {
        position: 'bottom-right',
        style: {
          background: '#FF3333',
          color: '#fff'
        }
      });
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  if (!tournament) return <ErrorMessage error="Tournament not found" onRetry={() => router.push('/tournaments')} />;

  const handleMatchClick = async (matchId: string) => {
    try {
      // const res = await axios.get(`${BASE_URL}/tournament/match/${matchId}`);
      // const matchData = res.data.match;
  
      // Option 1: If you store match data in global state or pass it via context, do it here.
      // Option 2: If your match details page fetches its own data by ID, you can simply navigate:
      router.push(`/user/matches/${matchId}`);
    } catch (err) {
      toast.error('Failed to load match details', {
        position: 'bottom-right',
        style: {
          background: '#FF3333',
          color: '#fff'
        }
      });
      console.error('Match fetch error:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {tournament.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tournament.status === 'Upcoming' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white' 
                  : tournament.status === 'Ongoing' 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white'
              }`}>
                {tournament.status}
              </span>
              <div className="flex items-center text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <FiCalendar className="mr-2 text-blue-500" />
                <span className="text-sm">
                  {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {tournament.endDate && ` - ${new Date(tournament.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </span>
              </div>
              <div className="flex items-center text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <FiMapPin className="mr-2 text-red-500" />
                <span className="text-sm">{tournament.location}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
            disabled={loading}
          >
            <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {/* {refreshing ? 'Refreshing...' : 'Refresh Data'} */}
            RefreshData
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Matches */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Match Schedule</h2>
                  {/* <button 
                    onClick={() => router.push(`/tournaments/${id}/new-match`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                  >
                    <FiPlus /> Add Match
                  </button> */}
                </div>

                <AnimatePresence>
                  {matches.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10"
                    >
                      <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiCalendar className="text-gray-400 text-3xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">No matches scheduled</h3>
                      <p className="text-gray-500 mt-1">Add matches to see them listed here</p>
                    </motion.div>
                  ) : (
                    <ul className="divide-y divide-gray-200/50">
                      {matches.map((match, index) => (
                        <motion.li 
                        key={match._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="py-4 px-4 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                        onClick={() => handleMatchClick(match._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {match.teams[0]?.name || 'Team 1'} vs {match.teams[1]?.name || 'Team 2'}
                            </p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <span>
                                {new Date(match.date).toLocaleString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{match.venue}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            match.status === 'completed' 
                              ? 'bg-green-100/80 text-green-800' 
                              : match.status === 'ongoing' 
                                ? 'bg-blue-100/80 text-blue-800 animate-pulse' 
                                : 'bg-gray-100/80 text-gray-800'
                          }`}>
                            {match.status}
                          </span>
                        </div>
                      </motion.li>
                      
                      ))}
                    </ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tournament Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tournament Summary</h3>
                {tournament.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">{tournament.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center text-blue-600 mb-2">
                      <FiUsers className="mr-2" />
                      <span className="text-sm font-medium">Teams</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-800">
                      {tournament.teams.length}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center text-purple-600 mb-2">
                      <FiAward className="mr-2" />
                      <span className="text-sm font-medium">Format</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-800">
                      {tournament.format}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              {/* <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tournament Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/tournaments/${id}/new-match`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                  >
                    <FiPlus className="h-5 w-5" />
                    Add New Match
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/tournaments/${id}/edit`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
                  >
                    <FiEdit2 className="h-5 w-5" />
                    Edit Tournament
                  </motion.button>
                </div>
              </div> */}
            </motion.div>

            {/* Standings Card */}
            {tournament.standings && tournament.standings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Standings</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pos</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pts</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NRR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {tournament.standings
                          .sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate)
                          .map((standing, index) => (
                            <motion.tr 
                              key={standing.team._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 * index }}
                              className={index < 3 ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/50" : ""}
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {standing.team.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-semibold">
                                {standing.points}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className={`font-mono ${standing.netRunRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {standing.netRunRate.toFixed(2)}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}