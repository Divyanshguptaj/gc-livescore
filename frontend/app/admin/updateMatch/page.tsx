'use client';

import React, { JSX, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LiveUpdatePage from '../../../components/pages/updateScore';
import { useRouter } from 'next/navigation';
import { default as ReactSelect, Props as SelectProps } from 'react-select';
import axios from 'axios';

const Select = dynamic(() => import('react-select'), { ssr: false }) as unknown as <
  Option,
  IsMulti extends boolean = false
>(
  props: SelectProps<Option, IsMulti>
) => JSX.Element;

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

interface Match {
  _id: string;
  teams: Team[];
  venue: string;
  date: string;
  format: string; // e.g., "T20", "ODI", etc.
  status: string; // e.g., "Not Started", "Live", "Completed"
}

interface MatchOption {
  value: string;
  label: string;
  matchData: Match;
}

interface PlayerOption {
  value: string;
  label: string;
}

interface InitData {
  match: Match;
  battingTeam: Team;
  striker: Player;
  nonStriker: Player;
  bowler: Player;
  currentOverId?: string;
  currentInningId?: string;
  secondInningId?: string;
  bowlingTeam?: Team;
}

const SetupMatchPage = () => {
  const router = useRouter();
  const [matchOptions, setMatchOptions] = useState<MatchOption[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchOption | null>(null);
  const [battingTeam, setBattingTeam] = useState<Team | null>(null);
  const [striker, setStriker] = useState<PlayerOption | null>(null);
  const [nonStriker, setNonStriker] = useState<PlayerOption | null>(null);
  const [bowler, setBowler] = useState<PlayerOption | null>(null);
  const [overs, setOvers] = useState<number>(20); // Default to 20 overs
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [initData, setInitData] = useState<InitData | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<{ matches: Match[] }>(`${BASE_URL}/tournament/getMatches`);
        const options = res?.data?.matches.map((match: Match) => ({
          value: match._id,
          label: `${match.teams[0].name} vs ${match.teams[1].name} - ${new Date(match.date).toLocaleDateString()} at ${match.venue}`,
          matchData: match,
        }));
        setMatchOptions(options);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      }
    };
    fetchMatches();
  }, []);

  const getPlayerOptions = (team: Team): PlayerOption[] => {
    return team.players.map((p) => ({ value: p._id, label: p.name }));
  };

  const initializeMatch = async () => {
    if (!selectedMatch || !battingTeam || !striker || !nonStriker || !bowler || !overs) return;

    setIsInitializing(true);
    try {
      const payload = {
        matchId: selectedMatch.value,
        battingTeamId: battingTeam._id,
        strikerId: striker.value,
        nonStrikerId: nonStriker.value,
        bowlerId: bowler.value,
        overs: overs
      };

      const response = await axios.post(`${BASE_URL}/tournament/initialize`, payload);
      if (!response.data.success) throw new Error('Failed to initialize match');

      const bowlingTeam = selectedMatch.matchData.teams.find(t => t._id !== battingTeam._id)!;

      setInitData({
        match: selectedMatch.matchData,
        battingTeam,
        bowlingTeam,
        striker: { _id: striker.value, name: striker.label },
        nonStriker: { _id: nonStriker.value, name: nonStriker.label },
        bowler: { _id: bowler.value, name: bowler.label },
        currentOverId: response.data.currentOver,
        currentInningId: response.data.currentInning,
        secondInningId: response.data.secondInning,
      });
      setIsMatchStarted(true);
    } catch (error) {
      console.error('Error initializing match:', error);
      alert('Failed to initialize match. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleBattingTeamSelect = (team: Team) => {
    setBattingTeam(team);
    // Reset player selections when changing batting team
    setStriker(null);
    setNonStriker(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      {isMatchStarted && initData ? (
        <LiveUpdatePage
          match={initData.match}
          battingTeam={initData.battingTeam}
          striker={initData.striker}
          nonStriker={initData.nonStriker}
          bowler={initData.bowler}
        />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            {selectedMatch ? 'Match Setup' : 'Select a Match to Start'}
          </h2>

          {!selectedMatch ? (
            <div className="space-y-4">
              <Select
                options={matchOptions}
                onChange={(val) => setSelectedMatch(val as MatchOption)}
                placeholder="Choose a match"
                className='text-gray-700'
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batting Team Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Batting Team</label>
                  <div className="flex space-x-2">
                    {selectedMatch.matchData.teams.map((team) => (
                      <button
                        key={team._id}
                        className={`flex-1 py-2 px-4 rounded ${battingTeam?._id === team._id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        onClick={() => handleBattingTeamSelect(team)}
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overs Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Number of Overs</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={overs}
                    onChange={(e) => setOvers(Number(e.target.value))}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {battingTeam && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Striker Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Striker</label>
                    <Select
                      options={getPlayerOptions(battingTeam)}
                      value={striker}
                      onChange={(val) => setStriker(val)}
                      placeholder="Select striker"
                      className='text-gray-700'
                    />
                  </div>

                  {/* Non-Striker Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Non-Striker</label>
                    <Select
                      options={getPlayerOptions(battingTeam).filter(p => !striker || p.value !== striker.value)}
                      value={nonStriker}
                      onChange={(val) => setNonStriker(val)}
                      placeholder="Select non-striker"
                      isDisabled={!striker}
                      className='text-gray-700'
                    />
                  </div>

                  {/* Bowler Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Bowler</label>
                    <Select
                      options={getPlayerOptions(selectedMatch.matchData.teams.find(t => t._id !== battingTeam._id)!)}
                      value={bowler}
                      onChange={(val) => setBowler(val)}
                      placeholder="Select bowler"
                      className='text-gray-700'
                    />
                  </div>
                </div>
              )}

              {/* Summary and Submit Button */}
              {battingTeam && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Match Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-800 font-medium">Match:</div>
                      <div className="text-gray-600 ">
                        {selectedMatch.matchData.teams[0].name} vs {selectedMatch.matchData.teams[1].name}
                      </div>
                      
                      <div className="text-gray-800 font-medium">Batting Team:</div>
                      <div className="text-gray-600">{battingTeam?.name || '-'}</div>
                      
                      <div className="text-gray-800 font-medium">Striker:</div>
                      <div className="text-gray-600">{striker?.label || '-'}</div>
                      
                      <div className="text-gray-800 font-medium">Non-Striker:</div>
                      <div className="text-gray-600">{nonStriker?.label || '-'}</div>
                      
                      <div className="text-gray-800 font-medium">Bowler:</div>
                      <div className="text-gray-600">{bowler?.label || '-'}</div>
                      
                      <div className="text-gray-800 font-medium">Overs:</div>
                      <div className="text-gray-600">{overs}</div>
                    </div>
                  </div>

                  <button
                    onClick={initializeMatch}
                    disabled={!striker || !nonStriker || !bowler || isInitializing}
                    className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isInitializing ? 'Initializing Match...' : 'Start Match'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SetupMatchPage;