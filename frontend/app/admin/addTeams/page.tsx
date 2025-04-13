"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const AddTeamPage = () => {
  type Tournament = {
    _id: string;
    name: string;
  };
  type Team = {
    _id: string;
    name: string;
  }
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teamLogo, setTeamLogo] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tournament/getTeams`);
        setTeams(res.data.teams || []);
        toast.success("Teams loaded successfully");
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams");
      }
    };

    const fetchTournaments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tournament/getTournaments`);
        setTournaments(res.data.tournaments || []);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        toast.error("Failed to load tournaments");
      }
    };

    fetchTeams();
    fetchTournaments();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!selectedTournamentId || !selectedTeamId) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("tournamentId", selectedTournamentId);
    formData.append("teamId", selectedTeamId);
    if (teamLogo) formData.append("teamLogo", teamLogo);

    try {
      const res = await axios.post(`${BASE_URL}/tournament/addTeam`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res)
      if (res.data.success) {
        toast.success("Team added successfully");
        setSelectedTournamentId("");
        setSelectedTeamId("");
        setTeamLogo(null);
      } else {
        toast.error(res.data.message || "Failed to add team");
      }
    } catch (error) {
      const err = error as any;
      console.error("Error adding team:", error);
      toast.error(err.response?.data?.message || "Failed to add team");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Add Team to Tournament</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tournament Dropdown */}
          <div>
            <label htmlFor="tournament" className="block text-sm font-medium text-black mb-1">
              Select Tournament
            </label>
            <select
              id="tournament"
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              required
            >
              <option value="">-- Select a tournament --</option>
              {tournaments.map((tournament) => (
                <option key={tournament._id} value={tournament._id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Dropdown */}
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-black mb-1">
              Select Team
            </label>
            <select
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              required
            >
              <option value="">-- Select a team --</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Logo (Optional) */}
          {/* <div>
            <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Team Logo (optional)
            </label>
            <input
              type="file"
              id="teamLogo"
              accept="image/*"
              onChange={(e) => setTeamLogo(e.target.files[0])}
              className="w-full"
            />
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-lg font-medium transition duration-300"
          >
            Add Team
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddTeamPage;
