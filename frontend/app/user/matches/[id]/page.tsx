'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiAward, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Player {
  _id: string;
  name: string;
}

interface Team {
  _id: string;
  name: string;
  players: Player[];
}

interface Ball {
  ballNumber: number;
  batsman: Player;
  runs: number;
  isWicket: boolean;
  wicketType: string | null;
}

interface Over {
  overNumber: number;
  bowlerId: Player;
  balls: Ball[];
}

interface Innings {
  _id: string;
  battingTeam: Team;
  bowlingTeam: Team;
  totalRuns: number;
  totalWickets: number;
  oversPlayed: number;
  overs: Over[];
  batsmenStats: {
    player: Player;
    runs: number;
    ballsFaced: number;
    status: string;
  }[];
  bowlersStats: {
    player: Player;
    overs: number;
    wickets: number;
    runsConceded: number;
  }[];
}

interface MatchDetails {
  matchInfo: {
    _id: string;
    date: string;
    venue: string;
    result: string;
    teams: Team[];
    tournament: {
      _id: string;
      name: string;
      format: string;
    };
  };
  tournamentInfo: {
    name: string;
    format: string;
    status: string;
  };
  teamsInfo: Team[];
  innings: Innings[];
  fullScorecard: Innings[];
  ballByBall: any[];
}

export default function MatchDetailPage() {
  const { id } = useParams();
  const [matchData, setMatchData] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeInning, setActiveInning] = useState(0);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tournament/getMatchesById/${id}`);
        console.log("full scorecard", response.data.data.fullScorecard);
        // const response = await axios.get(`${BASE_URL}/tournament/getMatchesById/${id}`);
        setMatchData(response.data.data);
      } catch (error) {
        toast.error('Failed to load match details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/matches/${id}`);
      setMatchData(response.data.data);
      toast.success('Match data refreshed!');
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load match details</p>
      </div>
    );
  }

  const currentInning = matchData.fullScorecard[activeInning];
  const currentBattingTeam = currentInning?.battingTeam;
  const currentBowlingTeam = currentInning?.bowlingTeam;

  // Get current batsmen (assuming last two players in batsmenStats are current)
//   const currentBatsmen = matchData.ballByBall

  // const currentBatsmen = currentInning?.batsmenStats?.slice(-2) || [];
  const currentOver = currentInning.overs[currentInning.oversPlayed];
  const striker = currentOver.balls[currentOver.balls.length-1]?.batsman;
  let strikerDetails = { status: '', runs: 0, ballfaced: 0 };
  let currbowlerStats = { name: '', runs: 0, overs: 0.0, wickets: 0 };
  const currbowlerId = currentOver.bowlerId._id;
  //name , overs , runs , wickets

  const helperCountingbowlerStats = currentInning.bowlersStats.map((bowler)=>{
    if(currbowlerId===bowler.player._id){
      currbowlerStats.name = bowler.player.name;
      currbowlerStats.runs = bowler.runsConceded
      currbowlerStats.overs = bowler.overs
      currbowlerStats.wickets = bowler.wickets
    } 
  })

  const stikerRuns = currentInning.batsmenStats.map((batsman)=>{
    if(batsman.player?._id==striker?._id){
      strikerDetails.status = batsman?.status;
      strikerDetails.runs = batsman?.runs;
      strikerDetails.ballfaced = batsman?.ballsFaced;
    } 
  })

    // Count only **valid** deliveries (not wides or no-balls)
    const currentBallNumber = (currentOver.balls || []).filter(
    ball => (ball?.extraType !== 'wide' && ball?.extraType !== 'no ball')
    ).length;

  // Get current bowler (assuming last bowler in bowlersStats is current)
  const currentBowler = currentInning?.bowlersStats?.slice(-1)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {matchData.matchInfo.teams[0]?.name} vs {matchData.matchInfo.teams[1]?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                <FiCalendar className="mr-2 text-blue-500" />
                <span className="text-sm">
                  {new Date(matchData.matchInfo.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                <FiMapPin className="mr-2 text-red-500" />
                <span className="text-sm">{matchData.matchInfo.venue}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                <FiAward className="mr-2 text-purple-500" />
                <span className="text-sm">{matchData.tournamentInfo.name}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="h-5 w-5" />
            Refresh
          </motion.button>
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {currentBattingTeam?.name} - {currentInning?.totalRuns}/{currentInning?.totalWickets}
            </h2>
            <span className="text-gray-600">
              Overs: {currbowlerStats.overs}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Batting Team */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Batting</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">
                    {striker?.name} {'✱'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {strikerDetails.runs} ({strikerDetails.ballfaced})
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  strikerDetails.status === 'Out' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {strikerDetails.status}
                </span>
              </div>
            </div>

            {/* Bowling Team */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Bowling</h3>
              {currentBowler && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{currbowlerStats.name}</p>
                    <p className="text-sm text-gray-500">
                      {currbowlerStats.runs}-{currbowlerStats.wickets}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {currbowlerStats.overs} overs
                  </span>
                </div>
              )}
            </div>

            {/* Match Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Match Status</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  matchData.tournamentInfo.status === 'Upcoming'
                    ? 'bg-amber-100 text-amber-800'
                    : matchData.tournamentInfo.status === 'Ongoing'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                }`}>
                  {matchData.tournamentInfo.status}
                </span>
                <p className="text-sm text-gray-600">
                  {matchData.matchInfo.result || 'In progress'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Innings Selector */}
        <div className="flex gap-2 mb-6">
          {matchData.fullScorecard.map((inning, index) => (
            <button
              key={inning._id}
              onClick={() => setActiveInning(index)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeInning === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inning {index + 1}
            </button>
          ))}
        </div>

        {/* Detailed Scorecard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Batting Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Batting Card</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batsman
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Runs
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balls
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SR
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentInning.batsmenStats?.map((batsman) => (
                      <tr key={batsman.player._id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {batsman.player.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {batsman.runs}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {batsman.ballsFaced < 0 ? 0 : batsman.ballsFaced}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {batsman.ballsFaced > 0
                            ? ((batsman.runs / batsman.ballsFaced) * 100).toFixed(2)
                            : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              batsman.status === 'Out'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {batsman.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Bowling Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Bowling Card</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bowler
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        O
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        R
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Econ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentInning.bowlersStats?.map((bowler) => (
                      <tr key={bowler.player._id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {bowler.player.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {bowler.overs}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {bowler.runsConceded}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {bowler.wickets}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {bowler.overs > 0
                            ? (bowler.runsConceded / bowler.overs).toFixed(2)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Balls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Balls</h3>
            <div className="flex flex-wrap gap-2">
            {(() => {
                return (currentOver.balls || []).map((ball, i) => (
                    <div
                    key={`${currentOver.overNumber}.${i}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        ball.isWicket
                        ? 'bg-red-100 text-red-800'
                        : ball.runs === 0
                            ? 'bg-gray-100 text-gray-800'
                            : ball.runs === 4
                            ? 'bg-blue-100 text-blue-800'
                            : ball.runs === 6
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                    }`}
                    >
                    {ball.isWicket
                        ? 'W'
                        : ball.extraType === 'wide'
                        ? 'WD'
                        : ball.extraType === 'noBall'
                            ? 'NB'
                            : ball.runs}
                    </div>
                ));
                })()}

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}