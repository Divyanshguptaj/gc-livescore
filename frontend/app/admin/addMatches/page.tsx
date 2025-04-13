'use client';
import dynamic from 'next/dynamic';
import { default as ReactSelect, Props as SelectProps } from 'react-select';
const Select = dynamic(() => import('react-select'), {
  ssr: false,
}) as unknown as <Option, IsMulti extends boolean = false>(
  props: SelectProps<Option, IsMulti>
) => JSX.Element;
import { toast } from "react-hot-toast";
import React, { JSX, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
// import Select from "react-select";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
interface Tournament {
    _id: string;
    name: string;
}

interface Team {
    _id: string;
    name: string;
}

interface OptionType {
    value: string;
    label: string;
}

interface MatchForm {
    date: string;
    time: string;
    venue: string;
}

const AddMatchPage = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<OptionType | null>(null);
    const [teamA, setTeamA] = useState<OptionType | null>(null);
    const [teamB, setTeamB] = useState<OptionType | null>(null);
    const [matchDetails, setMatchDetails] = useState<MatchForm>({
        date: "",
        time: "",
        venue: "",
    });
    
    // Fetch tournaments and teams
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tournamentRes, teamRes] = await Promise.all([
                    axios.get(`${BASE_URL}/tournament/getTournaments`),
                    axios.get(`${BASE_URL}/tournament/getTeams`),
                ]);
                setTournaments(tournamentRes.data.tournaments);
                setTeams(teamRes.data.teams);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Options for dropdowns
    const tournamentOptions = tournaments.map(t => ({
        value: t._id,
        label: t.name,
    }));

    const teamOptions = teams.map(t => ({
        value: t._id,
        label: t.name,
    }));

    // Filter Team B options to exclude Team A
    const filteredTeamBOptions = teamOptions.filter(
        t => t.value !== teamA?.value
    );

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        setMatchDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!selectedTournament || !teamA || !teamB) {
            return alert("Please select all required fields.");
        }

        const payload = {
            tournamentId: selectedTournament.value,
            teams: [teamA.value, teamB.value],
            ...matchDetails,
        };
        console.log(payload)
        try {
            const res = await axios.post(`${BASE_URL}/tournament/createMatch`, payload);
            toast.success("Match created successfully!");
            // Reset form
            setSelectedTournament(null);
            setTeamA(null);
            setTeamB(null);
            setMatchDetails({ date: "", time: "", venue: "" });
        } catch (err) {
            console.error(err);
            alert("Failed to create match.");
        }
    };

    return (
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-12 border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Create New Match</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Tournament</label>
            <Select
              options={tournamentOptions}
              value={selectedTournament}
              onChange={(selected: OptionType | null) => setSelectedTournament(selected)}
              placeholder="Select a tournament..."
              className='text-gray-700'
              isClearable
            />
          </div>
    
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Team A</label>
            <Select
              options={teamOptions}
              value={teamA}
              onChange={(selected: OptionType | null) => {
                setTeamA(selected);
                if (teamA?.value === selected?.value) setTeamA(null);
              }}
              className='text-gray-700'
              placeholder="Select Team A..."
              isClearable
            />
          </div>
    
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Team B</label>
            <Select
              options={filteredTeamBOptions}
              value={teamB}
              onChange={(selected: OptionType | null) => {
                setTeamB(selected);
                if (teamB?.value === selected?.value) setTeamB(null);
              }}
              className='text-gray-700'
              placeholder="Select Team B..."
              isDisabled={!teamA}
              isClearable
            />
          </div>
    
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={matchDetails.date}
              onChange={handleInputChange}
              className="text-gray-700 w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
    
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={matchDetails.time}
              onChange={handleInputChange}
              className="text-gray-700 w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
    
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Venue</label>
            <input
              type="text"
              name="venue"
              value={matchDetails.venue}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., City Stadium"
              required
            />
          </div>
    
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-lg transition duration-200"
            >
              Add Match
            </button>
          </div>
        </form>
      </div>
    );
    
};

export default AddMatchPage;