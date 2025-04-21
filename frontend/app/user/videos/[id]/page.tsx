'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  createdAt: string;
  tournament?: {
    name: string;
    _id: string;
  };
  match?: {
    team1: string;
    team2: string;
    _id: string;
  };
}

const VideoDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // First try to get video from session storage
    const storedVideo = sessionStorage.getItem(`videoData-${id}`);
    if (storedVideo) {
      setVideo(JSON.parse(storedVideo));
      setLoading(false);
    }

    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/newsAndBlogs/getVideoById/${id}`);
        const videoData = response.data.data;
        setVideo(videoData);
      } catch (err) {
        setError('Failed to load video');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!video) {
    return <div className="text-center p-4">Video not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/user/videos"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Videos
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative aspect-w-16 aspect-h-9 bg-black">
          <video
            controls
            className="w-full"
            poster={video.thumbnailUrl}
            src={video.videoUrl}
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{(video.views ?? 0).toLocaleString()} views</span>
            <span className="mx-2">•</span>
            <span>{new Date(video.views ?? 0).toLocaleString()}</span>
          </div>

          {(video.tournament || video.match) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {video.tournament && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {video.tournament.name}
                  </span>
                )}
                {video.match && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {video.match.team1} vs {video.match.team2}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-gray-700">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;