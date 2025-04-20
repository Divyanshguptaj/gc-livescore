"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiAward,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Player {
  _id: string;
  name: string;
  role: string;
}

interface Tournament {
  _id: string;
  name: string;
}

interface Team {
  _id: string;
  name: string;
  logo?: string;
  players?: Player[];
  tournaments?: Tournament[];
  createdAt: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailView, setIsDetailView] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tournament/getTeams`);
        setTeams(response.data?.teams || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams =
    teams?.filter((team) => {
      const teamName = team?.name?.toLowerCase() || "";
      const playerNames =
        team?.players?.map((p) => p?.name?.toLowerCase()) || [];
      return (
        teamName.includes(searchTerm.toLowerCase()) ||
        playerNames.some((name) => name?.includes(searchTerm.toLowerCase()))
      );
    }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (isDetailView && selectedTeam) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => setIsDetailView(false)}
            className="flex items-center text-blue-600 mb-6"
            whileHover={{ x: -4 }}
          >
            <FiArrowLeft className="mr-2" />
            Back to Teams
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center">
              <img
                src={
                  selectedTeam.logo && selectedTeam.logo !== ""
                    ? selectedTeam.logo
                    : "/images/cricketTeamLogo.png"
                }
                alt={selectedTeam.name}
                className="w-40 h-40 object-contain mb-6"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-team-logo.png";
                }}
              />

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedTeam.name}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6">
                {selectedTeam.tournaments?.length ? (
                  <span className="flex items-center text-sm text-gray-600">
                    <FiAward className="mr-1 text-blue-500" />
                    {selectedTeam.tournaments.length} Tournaments
                  </span>
                ) : null}
                <span className="flex items-center text-sm text-gray-600">
                  <FiUsers className="mr-1 text-blue-500" />
                  {selectedTeam.players?.length || 0} Players
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-1 text-blue-500" />
                  Created: {formatDate(selectedTeam.createdAt)}
                </span>
              </div>

              <div className="w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Players
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedTeam.players?.map((player) => (
                    <div key={player._id} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {player.role}
                      </p>
                    </div>
                  )) || <p>No players found</p>}
                </div>
              </div>

              {selectedTeam.tournaments?.length ? (
                <div className="w-full mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Tournaments
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.tournaments.map((tournament) => (
                      <span
                        key={tournament._id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tournament.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cricket Teams
          </h1>
          <p className="text-gray-600">
            Explore all the cricket teams and their players
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams or players..."
              className="text-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No teams found matching your search</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence>
              {filteredTeams.map((team) => (
                <motion.div
                  key={team._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsDetailView(true);
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6 flex flex-col items-center">
                    <img
                      src={
                        team.logo && team.logo !== ""
                          ? team.logo
                          : "/images/cricketTeamLogo.png"
                      }
                      alt={team.name}
                      className="w-32 h-32 object-contain mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/default-team-logo.png";
                      }}
                    />

                    <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
                      {team.name}
                    </h2>

                    <div className="flex flex-wrap gap-4 justify-center">
                      <span className="flex items-center text-sm text-gray-600">
                        <FiUsers className="mr-1" />
                        {team.players?.length || 0} Players
                      </span>
                      {team.tournaments?.length ? (
                        <span className="flex items-center text-sm text-gray-600">
                          <FiAward className="mr-1" />
                          {team.tournaments.length} Tournaments
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
