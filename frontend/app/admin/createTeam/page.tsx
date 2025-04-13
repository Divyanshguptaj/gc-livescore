"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";    

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const CreateTeamPage = () => {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/tournament/createTeam`, { name: teamName.trim() });

      if (res.data.success) {
        toast.success("Team created successfully!");
        setTeamName("");
        router.push("/admin/addPlayers"); // Redirect to the teams page
      } else {
        toast.error(res.data.message || "Failed to create team");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Server error");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Create a New Team</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Team Name</span>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mt-1 block w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
            placeholder="Enter your team name"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeamPage;
