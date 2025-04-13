// pages/setup-match.tsx
'use client';

import React, { JSX, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LiveUpdatePage from '../../../components/pages/updateScore';
import { useRouter } from 'next/navigation';
import { default as ReactSelect, Props as SelectProps } from 'react-select';

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

interface MatchSetupProps {
  match: Match;
  battingTeam: Team;
  striker: Player;
  nonStriker: Player;
  bowler: Player;
}


const SetupMatchPage = () => {
  const [matchOptions, setMatchOptions] = useState<MatchOption[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchOption | null>(null);
  const [battingTeam, setBattingTeam] = useState<Team | null>(null);
  const [striker, setStriker] = useState<PlayerOption | null>(null);
  const [nonStriker, setNonStriker] = useState<PlayerOption | null>(null);
  const [bowler, setBowler] = useState<PlayerOption | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tournament/getMatches`);
        const data = await res.json();
        const options = data.matches.map((match: Match) => {
          const rawDate = new Date(match.date);
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          }).format(rawDate);
          const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric', minute: 'numeric', hour12: true,
          }).format(rawDate);

          return {
            value: match._id,
            label: `${match.teams[0].name} vs ${match.teams[1].name} - ${formattedDate}, ${formattedTime} at ${match.venue}`,
            matchData: match,
          };
        });
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

  const isAllReady = selectedMatch && battingTeam && striker && nonStriker && bowler;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      {!selectedMatch ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Select a Match to Start</h2>
          <Select
            options={matchOptions}
            onChange={(val) => setSelectedMatch(val as MatchOption)}
            placeholder="Choose a match"
            className='text-gray-700'
          />
        </>
      ) : !battingTeam ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Who is Batting First?</h2>
          {selectedMatch.matchData.teams.map((team) => (
            <button
              key={team._id}
              className="block w-full bg-blue-600 text-white py-3 mb-3 rounded hover:bg-blue-700"
              onClick={() => setBattingTeam(team)}
            >
              {team.name}
            </button>
          ))}
        </>
      ) : !striker ? (
        <>
          <h2 className="text-lg font-semibold mb-2 text-black">Select Striker</h2>
          <Select
            options={getPlayerOptions(battingTeam)}
            value={striker}
            onChange={(val) => setStriker(val)}
            placeholder="Choose striker"
            className='text-gray-700'
          />
        </>
      ) : !nonStriker ? (
        <>
          <h2 className="text-lg font-semibold mb-2 text-black">Select Non-Striker</h2>
          <Select
            options={getPlayerOptions(battingTeam).filter(p => p.value !== striker.value)}
            value={nonStriker}
            onChange={(val) => setNonStriker(val)}
            placeholder="Choose non-striker"
            className='text-gray-700'
          />
        </>
      ) : !bowler ? (
        <>
          <h2 className="text-lg font-semibold mb-2 text-black">Select Bowler</h2>
          <Select
            options={getPlayerOptions(selectedMatch.matchData.teams.find(t => t._id !== battingTeam._id)!)}
            value={bowler}
            onChange={(val) => setBowler(val)}
            placeholder="Choose bowler"
            className='text-gray-700'
          />
        </>
      ) : (
        <LiveUpdatePage
          match={selectedMatch.matchData}
          battingTeam={battingTeam}
          striker={{ _id: striker.value, name: striker.label }}
          nonStriker={{ _id: nonStriker.value, name: nonStriker.label }}
          bowler={{ _id: bowler.value, name: bowler.label }}
        />
      )}
    </div>
  );
};

export default SetupMatchPage;