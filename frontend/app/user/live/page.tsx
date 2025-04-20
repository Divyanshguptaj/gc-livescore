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
    tournament: string;
    teams: {
        _id: string;
        name: string;
        logo?: string;
    }[];
    date: string;
    time: string;
    venue: string;
    innings: any[]; // Update this based on your innings structure
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
        // Replace with your actual API call
            const response = await axios.get(`${BASE_URL}/tournament/getMatches`);
            console.log(response.data)
            const data = response.data.matches;

        
        // Add status to each match based on current time
        const now = new Date();
        const matchesWithStatus = data.map((match: Match) => {
            const matchDateTime = new Date(match.date);
            const [hours, minutes] = match.time.split(':').map(Number);
            matchDateTime.setHours(hours, minutes, 0, 0);
            
            const endDateTime = new Date(matchDateTime);
            endDateTime.setHours(endDateTime.getHours() + 8); // Assuming matches last ~8 hours
            
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

    const filterMatches = () => {
        let filtered = [...allMatches];
        
        // Filter by time status
        if (timeFilter !== 'all') {
        filtered = filtered.filter(match => match.status === timeFilter);
        }
        
        // Filter by tournament (if implemented)
        if (tournamentFilter !== 'all') {
        filtered = filtered.filter(match => match.tournament === tournamentFilter);
        }
        
        setFilteredMatches(filtered);
    };

    const toggleMatchDetails = (matchId: string) => {
        setSelectedMatch(selectedMatch === matchId ? null : matchId);
    };

    const getMatchStatus = (match: Match) => {
        const now = new Date();
        const matchDateTime = new Date(match.date);
        const [hours, minutes] = match.time.split(':').map(Number);
        matchDateTime.setHours(hours, minutes, 0, 0);
        
        if (match.status === 'live') {
        return 'LIVE';
        } else if (match.status === 'completed') {
        return 'COMPLETED';
        } else {
        // For upcoming matches, show time until start
        const diffMs = matchDateTime.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 24) {
            return `Starts in ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
        } else {
            return `Starts ${matchDateTime.toLocaleDateString()}`;
        }
        }
    };

    const getScoreDisplay = (match: Match, teamId: string) => {
        if (!match.score || !match.score[teamId]) return '-';
        const { runs, wickets, overs } = match.score[teamId];
        return `${runs}/${wickets} (${overs.toFixed(1)} ov)`;
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Loading matches...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
            <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
            >
            <h1 className="text-3xl font-bold text-white flex items-center">
                <FaFire className="text-orange-500 mr-3" />
                Cricket Matches
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <FiFilter className="text-gray-400 mx-2" />
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="bg-gray-800 text-white py-2 pl-2 pr-8 rounded-lg focus:outline-none"
                >
                    <option value="all">All Matches</option>
                    <option value="live">Live Now</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                </select>
                </div>
                
                <button
                onClick={fetchMatches}
                disabled={refreshing}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            </motion.div>

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
                    <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleMatchDetails(match._id)}
                    >
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            match.status === 'live' 
                            ? 'bg-red-500 text-white' 
                            : match.status === 'completed'
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-blue-500 text-white'
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
                        <span className="text-gray-400 text-sm">{match.tournament}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Team 1 */}
                        <div className="text-right">
                        <div className="flex items-center justify-end">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                            {match.teams[0].logo ? (
                                <img 
                                src={match.teams[0].logo} 
                                alt={match.teams[0].name}
                                className="w-8 h-8 object-contain"
                                />
                            ) : (
                                <span className="text-xs text-gray-300">
                                {match.teams[0].name.substring(0, 2).toUpperCase()}
                                </span>
                            )}
                            </div>
                            <h3 className="text-white font-medium">{match.teams[0].name}</h3>
                        </div>
                        </div>

                        {/* Match Status */}
                        <div className="text-center">
                        <div className="bg-gray-700 rounded-lg p-3">
                            <p className="text-white font-bold text-xl">
                            {getScoreDisplay(match, match.teams[0]._id)}
                            </p>
                            <div className="my-2 border-t border-gray-600"></div>
                            <p className="text-white font-bold text-xl">
                            {getScoreDisplay(match, match.teams[1]._id)}
                            </p>
                        </div>
                        {match.status === 'live' && match.innings?.length > 0 && (
                            <p className="text-yellow-400 mt-2 text-sm font-medium">
                            {match.innings[0].battingTeam === match.teams[0]._id ? 
                                `${match.teams[1].name} need ${match.innings[0].target - match.innings[0].runs} runs` : 
                                `${match.teams[0].name} need ${match.innings[0].target - match.innings[0].runs} runs`
                            }
                            </p>
                        )}
                        </div>

                        {/* Team 2 */}
                        <div className="text-left">
                        <div className="flex items-center">
                            <h3 className="text-white font-medium">{match.teams[1].name}</h3>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center ml-3">
                            {match.teams[1].logo ? (
                                <img 
                                src={match.teams[1].logo} 
                                alt={match.teams[1].name}
                                className="w-8 h-8 object-contain"
                                />
                            ) : (
                                <span className="text-xs text-gray-300">
                                {match.teams[1].name.substring(0, 2).toUpperCase()}
                                </span>
                            )}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                    <AnimatePresence>
                    {selectedMatch === match._id && (
                        <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                        >
                        <div className="px-6 pb-6 pt-0 border-t border-gray-700">
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                            {/* Innings Details */}
                            <div>
                                <h4 className="text-white font-medium mb-3 flex items-center">
                                <GiCricketBat className="text-yellow-500 mr-2" />
                                Innings Summary
                                </h4>
                                {match.innings?.length > 0 ? (
                                <div className="space-y-4">
                                    {match.innings.map((inning, index) => (
                                    <div key={index} className="bg-gray-700 p-3 rounded-lg">
                                        <h5 className="text-white font-medium mb-2">
                                        {inning.battingTeam === match.teams[0]._id ? 
                                            match.teams[0].name : match.teams[1].name} - {inning.runs}/{inning.wickets}
                                        </h5>
                                        <p className="text-gray-300 text-sm">
                                        Overs: {inning.overs.toFixed(1)} | Run Rate: {(inning.runs / inning.overs).toFixed(2)}
                                        </p>
                                        {inning.topBatsmen && (
                                        <div className="mt-2">
                                            <p className="text-gray-400 text-xs">Top Scorers:</p>
                                            <ul className="text-gray-300 text-sm">
                                            {inning.topBatsmen.map((batsman: any, i: number) => (
                                                <li key={i}>{batsman.name}: {batsman.runs} ({batsman.balls})</li>
                                            ))}
                                            </ul>
                                        </div>
                                        )}
                                    </div>
                                    ))}
                                </div>
                                ) : (
                                <p className="text-gray-400">No innings data available</p>
                                )}
                            </div>

                            {/* Match Info */}
                            <div>
                                <h4 className="text-white font-medium mb-3 flex items-center">
                                <FaChartLine className="text-green-500 mr-2" />
                                Match Information
                                </h4>
                                <div className="bg-gray-700 p-3 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                    <p className="text-gray-400">Tournament:</p>
                                    <p className="text-white">{match.tournament}</p>
                                    </div>
                                    <div>
                                    <p className="text-gray-400">Venue:</p>
                                    <p className="text-white">{match.venue}</p>
                                    </div>
                                    <div>
                                    <p className="text-gray-400">Date:</p>
                                    <p className="text-white">
                                        {new Date(match.date).toLocaleDateString()}
                                    </p>
                                    </div>
                                    <div>
                                    <p className="text-gray-400">Time:</p>
                                    <p className="text-white">{match.time}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
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