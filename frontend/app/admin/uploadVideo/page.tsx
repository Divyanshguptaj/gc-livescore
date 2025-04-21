'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Tournament {
  _id: string;
  name: string;
}

interface Match {
  _id: string;
  team1: string;
  team2: string;
  date: string;
}

const UploadVideo = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tournamentId: '',
    matchId: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    // Fetch tournaments when component mounts
    const fetchTournaments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tournament/getTournaments`);
        setTournaments(res.data.tournaments);
        setIsLoadingTournaments(false);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setIsLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fetchMatches = async (tournamentId: string) => {
    if (!tournamentId) {
      setMatches([]);
      return;
    }

    setIsLoadingMatches(true);
    try {
      const res = await axios.get(`${BASE_URL}/tournament/${tournamentId}/getMatchByTournamentId`);
      setMatches(res.data.matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tournamentId = e.target.value;
    setFormData(prev => ({ ...prev, tournamentId, matchId: '' }));
    fetchMatches(tournamentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('video', file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tournamentId', formData.tournamentId);
    formDataToSend.append('matchId', formData.matchId);

    try {
      const res = await axios.post(`${BASE_URL}/newsAndBlogs/uploadVideo`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      router.push(`/user/videos`);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Match Video</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tournament
            </label>
            <select
              name="tournamentId"
              value={formData.tournamentId}
              onChange={handleTournamentChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoadingTournaments}
            >
              <option value="">Select Tournament</option>
              {isLoadingTournaments ? (
                <option>Loading tournaments...</option>
              ) : (
                tournaments.map((tournament) => (
                  <option key={tournament._id} value={tournament._id}>
                    {tournament.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Match
            </label>
            <select
              name="matchId"
              value={formData.matchId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!formData.tournamentId || isLoadingMatches}
            >
              <option value="">Select Match</option>
              {isLoadingMatches ? (
                <option>Loading matches...</option>
              ) : (
                matches.map((match) => (
                  <option key={match._id} value={match._id}>
                    {match?.teams[0].name} vs {match?.teams[1].name} ({new Date(match.date).toLocaleDateString()})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            placeholder="E.g., Final Match Highlights"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Brief description of the video content"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video File
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            MP4, MOV, or AVI. Max 100MB.
          </p>
        </div>

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="mt-1 text-sm text-gray-500">
              Uploading: {progress}% complete
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading || !file || !formData.tournamentId || !formData.matchId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;