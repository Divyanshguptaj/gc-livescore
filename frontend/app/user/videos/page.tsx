'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiUpload, FiFilter, FiX, FiClock, FiEye, FiCalendar } from 'react-icons/fi';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration?: number;
  views: number;
  createdAt: string;
  tournament?: {
    _id: string;
    name: string;
  };
  match?: {
    _id: string;
    team1: string;
    team2: string;
  };
}

interface Tournament {
  _id: string;
  name: string;
}

interface Match {
  _id: string;
  team1: string;
  team2: string;
  tournament: string;
}

const VideoGallery = () => {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calculatedDurations, setCalculatedDurations] = useState<Record<string, number>>({});
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [filters, setFilters] = useState({
    tournament: '',
    match: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, tournamentsRes] = await Promise.all([
          axios.get(`${BASE_URL}/newsAndBlogs/getVideos`),
          axios.get(`${BASE_URL}/tournament/getTournaments`)
        ]);

        setVideos(videosRes.data.data);
        setFilteredVideos(videosRes.data.data);
        setTournaments(tournamentsRes.data.tournaments);

        videosRes.data.data.forEach(video => {
          if (!video.duration && video.videoUrl) {
            calculateVideoDuration(video);
          }
        });
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (filters.tournament) {
        try {
          const res = await axios.get(`${BASE_URL}/tournament/${filters.tournament}/getMatchByTournamentId`);
          setMatches(res.data.matches);
        } catch (err) {
          console.error('Failed to fetch matches', err);
        }
      } else {
        setMatches([]);
      }
    };

    fetchMatches();
  }, [filters.tournament]);

  useEffect(() => {
    let result = [...videos];
    if (filters.tournament) {
        result = result.filter(video =>
            // console.log(video.tournamentId._id, filters.tournament) 
          video.tournamentId._id === filters.tournament // Check against tournamentId directly
        );
      }
    
      // Filter by matchId
      if (filters.match) {
        result = result.filter(video => 
          video.matchId._id === filters.match // Check against matchId directly
        );
      }
    
    
    setFilteredVideos(result);
  }, [filters, videos]);

  const calculateVideoDuration = (video: Video) => {
    const videoElement = document.createElement('video');
    videoElement.src = video.videoUrl;
    videoElement.preload = 'metadata';

    videoElement.onloadedmetadata = () => {
      const duration = Math.round(videoElement.duration);
      setCalculatedDurations(prev => ({
        ...prev,
        [video._id]: duration
      }));
    };

    videoElement.onerror = () => {
      console.warn(`Failed to load metadata for video: ${video.title}`);
    };
  };

  const getDuration = (video: Video) => {
    return video.duration ?? calculatedDurations[video._id] ?? 0;
  };

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVideoClick = (video: Video, e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`videoData-${video._id}`, JSON.stringify(video));
    router.push(`/user/videos/${video._id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'tournament' && { match: '' })
    }));
  };

  const resetFilters = () => {
    setFilters({
      tournament: '',
      match: ''
    });
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header and Upload Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Gallery</h1>
            <p className="text-gray-600 mt-1">Browse and manage your video collection</p>
          </div>
          <Link 
            href="/upload" 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <FiUpload className="mr-2" />
            Upload Video
          </Link>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 hover:text-blue-600 mb-4 transition-colors"
          >
            <FiFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-black block text-sm font-medium text-gray-700 mb-2">Tournament</label>
                  <select
                    name="tournament"
                    value={filters.tournament}
                    onChange={handleFilterChange}
                    className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" className='text-black '>All Tournaments</option>
                    {tournaments.map(tournament => (
                      <option key={tournament._id} value={tournament._id} className='text-black '>
                        {tournament.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-black block text-sm font-medium text-gray-700 mb-2">Match</label>
                  <select
                    name="match"
                    value={filters.match}
                    onChange={handleFilterChange}
                    className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!filters.tournament}
                  >
                    <option value="" className='text-black '>All Matches</option>
                    {matches.map(match => (
                      <option key={match._id} value={match._id} className='text-black '>
                        {match.teams[0].name} vs {match.teams[1].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg transition-colors"
                    disabled={!filters.tournament && !filters.match}
                  >
                    <FiX className="mr-2" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {videos.length === 0 ? 'No videos available' : 'No videos match your filters'}
              </h3>
              <p className="text-gray-500 mb-6">
                {videos.length === 0 
                  ? 'Upload your first video to get started' 
                  : 'Try adjusting your filters to see more results'}
              </p>
              {videos.length === 0 ? (
                <Link 
                  href="/upload" 
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FiUpload className="mr-2" />
                  Upload Video
                </Link>
              ) : (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FiX className="mr-2" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Link
                key={video._id}
                href={`/user/videos/${video._id}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                onClick={(e) => handleVideoClick(video, e)}
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnailUrl || '/placeholder-video.jpg'}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-video.jpg';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 text-xs rounded">
                    {formatDuration(getDuration(video))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center">
                      <FiCalendar className="mr-1" />
                      {formatDate(video.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <FiEye className="mr-1" />
                      {video.views?.toLocaleString?.() || 0} views
                    </span>
                  </div>
                  {video.tournament && (
                    <div className="mt-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {video.tournament.name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;