'use client'
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Select, { SingleValue } from "react-select"; // Import SingleValue for types
import { RxCross1 } from "react-icons/rx";
interface PlayerOption {
  value: string; // Assuming the player ID is a string
  label: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const AddTeamPage = () => {
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [substitutes, setSubstitutes] = useState<PlayerOption[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<PlayerOption[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<SingleValue<PlayerOption>>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<SingleValue<PlayerOption>>(null);
  const [teamName, setTeamName] = useState<SingleValue<{ value: string; label: string }> | null>(null);
  const [teams, setTeams] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getAllUsers`);
      toast.success("Players fetched successfully!");
      setAvailablePlayers(res.data.users.map((user: any) => ({
        value: user._id,
        label: user.name
      })) || []);
    } catch (error) {
      toast.error("Error fetching players");
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams from the backend
  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tournament/getTeams`);
      console.log(res.data.teams)
      const transformedTeams = (res.data.teams || []).map((team: { _id: any; name: any; }) => ({
        value: team._id,
        label: team.name,
      }));
      toast.success("Teams fetched successfully!");
      setTeams(transformedTeams || []);
    } catch (error) {
      toast.error("Error fetching teams");
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAddPlayer = () => {
    if (selectedPlayer && players.length < 11) {
      setPlayers((prevPlayers) => [...prevPlayers, selectedPlayer]);
      setSelectedPlayer(null); // Reset player selection
    } else {
      toast.error("Cannot add more than 11 players.");
    }
  };

  const handleAddSubstitute = () => {
    if (selectedSubstitute && substitutes.length < 4) {
      setSubstitutes((prevSubs) => [...prevSubs, selectedSubstitute]);
      setSelectedSubstitute(null); // Reset substitute selection
    } else {
      toast.error("Cannot add more than 4 substitutes.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const teamData = {
        teamId: teamName?.value,
        players: players.map((player) => player.value), // Send player IDs
        substitutes: substitutes.map((sub) => sub.value), // Send substitute IDs
      };
      console.log(teamData);
      const res = await axios.post(`${BASE_URL}/tournament/addPlayers`, teamData);
      console.log(res.data);
      if (res.data.success) {
        if(res.data.skipped.alreadyInTeam.length > 0) {
          toast.error("Players already in team are skipped");
        }else if(res.data.skipped.duplicatesInRequest.length > 0) {
          toast.error("Duplicate players in request are skipped");
        }
        toast.success("Players added successfully!");
        // Reset fields after successful submission
        setTeamName(null);
        setPlayers([]);
        setSubstitutes([]);
      } else {
        toast.error(res.data.message || "Error creating team");
      }
    } catch (error) {
      toast.error("Error creating team");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Team</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Team Name */}
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-black mb-1">
              Team Name
            </label>
            <div className="flex items-center space-x-3">
              <Select
                id="teamName"
                value={teamName}
                onChange={(newValue) => setTeamName(newValue)}
                options={teams}
                className="w-full text-gray-700 text-black"
                placeholder="Select a team"
                isSearchable
              />
            </div>

          </div>

          {/* Select Player */}
          <div>
            <label htmlFor="players" className="block text-sm font-medium text-black mb-1">
              Add Player (Max 11)
            </label>
            <div className="flex items-center space-x-3">
              <Select
                id="players"
                value={selectedPlayer}
                onChange={setSelectedPlayer}
                options={availablePlayers.filter(
                  (player) =>
                    !players.some((p) => p.value === player.value) &&
                    !substitutes.some((s) => s.value === player.value)
                )}
                className="w-full text-gray-700 text-black"
                placeholder="Select a player"
                isSearchable
              />
              <button
                type="button"
                onClick={handleAddPlayer}
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Add Player
              </button>
            </div>
            <ul className="mt-3">
              {players.map((player, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-md mb-1 text-black flex justify-between items-center">
                  Player: {player.label}
                  <button
                    type="button"
                    onClick={() =>
                      setPlayers((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <RxCross1/>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Select Substitute */}
          <div>
            <label htmlFor="substitutes" className="block text-sm font-medium text-black mb-1">
              Add Substitute (Max 4)
            </label>
            <div className="flex items-center space-x-3">
              <Select
                id="substitutes"
                value={selectedSubstitute}
                onChange={setSelectedSubstitute}
                options={availablePlayers.filter(
                  (player) =>
                    !players.some((p) => p.value === player.value) &&
                    !substitutes.some((s) => s.value === player.value)
                )}
                className="w-full text-gray-700 text-black"
                placeholder="Select a substitute"
                isSearchable
              />
              <button
                type="button"
                onClick={handleAddSubstitute}
                className="bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Add Substitute
              </button>
            </div>
            <ul className="mt-3">
              {substitutes.map((sub, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-md mb-1 text-black flex justify-between items-center">
                  Substitute: {sub.label}
                  <button
                    type="button"
                    onClick={() =>
                      setSubstitutes((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <RxCross1/>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamPage;