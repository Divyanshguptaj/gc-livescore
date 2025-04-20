'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiClock, FiMapPin, FiFilter } from 'react-icons/fi';
import { FaFire, FaChartLine } from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Match {
  _id: string;
  tournament: {
    _id: string;
    name: string;
  };
  teams: {
    _id: string;
    name: string;
    logo?: string;
  }[];
  date: string;
  time: string;
  venue: string;
  innings: any[];
  status: 'upcoming' | 'live' | 'completed';
  score?: {
    [teamId: string]: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
}

const LiveMatchesPage = () => {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [tournamentFilter, setTournamentFilter] = useState<string>('all');

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [allMatches, timeFilter, tournamentFilter]);

  const fetchMatches = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${BASE_URL}/tournament/getMatches`);
      console.log(response.data)
      const data = response.data.matches;

      const now = new Date();
      const matchesWithStatus = data.map((match: Match) => {
        const matchDateTime = new Date(match.date);
        const [hours, minutes] = match.time.split(':').map(Number);
        matchDateTime.setHours(hours, minutes, 0, 0);
        
        const endDateTime = new Date(matchDateTime);
        endDateTime.setHours(endDateTime.getHours() + 8);
        
        let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
        if (now > endDateTime) {
          status = 'completed';
        } else if (now >= matchDateTime && now <= endDateTime) {
          status = 'live';
        }
        
        return { ...match, status };
      });
      
      setAllMatches(matchesWithStatus);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  function toggleMatchDetails(_id: string) {
    setSelectedMatch((prev) => (prev === _id ? null : _id));
  }
  function getMatchStatus(match: Match) {
    if (match.status === 'live') return 'Live';
    if (match.status === 'completed') return 'Completed';
    return 'Upcoming';
  }
  function getScoreDisplay(match: Match, teamId: string) {
    const score = match.score?.[teamId];
    if (!score) return '--/--';
  
    return `${score.runs}/${score.wickets} (${score.overs.toFixed(1)})`;
  }
      
  const filterMatches = () => {
    let filtered = [...allMatches];
    
    if (timeFilter !== 'all') {
      filtered = filtered.filter(match => match.status === timeFilter);
    }
    
    if (tournamentFilter !== 'all') {
      filtered = filtered.filter(match => match.tournament.name === tournamentFilter);
    }
    
    setFilteredMatches(filtered);
  };

  // ... (keep other helper functions the same)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header and filters remain the same */}
        
        {filteredMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-xl p-8 text-center"
          >
            <p className="text-gray-400 text-xl">
              {allMatches.length === 0 ? 'No matches found' : 'No matches match your filters'}
            </p>
          </motion.div>
        ) : (
            <div className="space-y-6">
            {filteredMatches.map((match) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6 cursor-pointer" onClick={() => toggleMatchDetails(match._id)}>
                  <div className="flex justify-between items-center mb-4">
                    {/* Match status + date/time/venue */}
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                        match.status === 'live' ? 'bg-red-500 text-white' : 
                        match.status === 'completed' ? 'bg-gray-600 text-gray-300' : 'bg-blue-500 text-white'
                      }`}>
                        {match.status === 'live' && (
                          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                        )}
                        {getMatchStatus(match)}
                      </span>
                      <span className="ml-3 text-gray-400 text-sm flex items-center">
                        <FiClock className="mr-1" />
                        {new Date(match.date).toLocaleDateString()} at {match.time}
                      </span>
                      <span className="ml-3 text-gray-400 text-sm flex items-center">
                        <FiMapPin className="mr-1" />
                        {match.venue}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">{match.tournament.name}</span>
                  </div>
          
                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        {match.teams[0].logo ? (
                          <img src={match.teams[0].logo} alt={match.teams[0].name} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-xs text-gray-300">{match.teams[0].name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="text-white font-medium">{match.teams[0].name}</span>
                    </div>
                    <span className="text-gray-400">vs</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{match.teams[1].name}</span>
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        {match.teams[1].logo ? (
                          <img src={match.teams[1].logo} alt={match.teams[1].name} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-xs text-gray-300">{match.teams[1].name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
          
                {/* Expanded details on click */}
                <AnimatePresence>
                  {selectedMatch === match._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-gray-700"
                    >
                      <div className="px-6 py-4">
                        <p className="text-gray-300">
                          <span className="text-white font-semibold">{match.teams[0].name}</span> vs{' '}
                          <span className="text-white font-semibold">{match.teams[1].name}</span>
                        </p>
                        <p className="text-gray-400 mt-1">Venue: {match.venue}</p>
                        <p className="text-gray-400">Date: {new Date(match.date).toLocaleDateString()}</p>
                        <p className="text-gray-400">Time: {match.time}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
        )}
      </div>
    </div>
  );
};

export default LiveMatchesPage;