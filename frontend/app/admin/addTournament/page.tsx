// app/add-tournament/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AddTournamentPage() {
  const router = useRouter();

  // useEffect(() => {
  //   const userCookie = Cookies.get("user");
  //   if (!userCookie) {
  //     router.replace("/login");
  //     return;
  //   }

  //   try {
  //     const user = JSON.parse(userCookie);
  //     if (user.role !== "admin") {
  //       router.replace("/unauthorized");
  //     }
  //   } catch (err) {
  //     console.error("Invalid user cookie", err);
  //     router.replace("/login");
  //   }
  // }, []);
  
  const [form, setForm] = useState({
    name: "",
    format: "T20",
    type: "League",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token") || "null");
    if (!token) {
      toast.error("Authentication token missing. Please login again.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/tournament/create`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      const data = response.data;
  
      if (data.success) {
        toast.success("Tournament added successfully!");
        router.push("addTeams");
      } else {
        toast.error(data.message || "Failed to add tournament.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message || "Server responded with an error."
          );
        } else if (error.request) {
          toast.error("No response received from the server.");
        } else {
          toast.error("Request error: " + error.message);
        }
      } else {
        toast.error("Unexpected error occurred.");
      }
  
      console.error("Add Tournament Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-900 p-8 rounded shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Add New Tournament</h2>

        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />

        <select
          name="format"
          value={form.format}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="T20">T20</option>
          <option value="ODI">ODI</option>
          <option value="Test">Test</option>
        </select>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="League">League</option>
          <option value="Knockout">Knockout</option>
          <option value="Round-Robin">Round-Robin</option>
          <option value="Mixed">Mixed</option>
        </select>

        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={form.startDate}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />

        <input
          type="date"
          placeholder="End Date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          min={form.startDate} 
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="text"
          name="location"
          placeholder="Venue"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Add Tournament
        </button>
      </form>
    </div>
  );
}
