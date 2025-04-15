'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Match } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FiArrowLeft } from 'react-icons/fi';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function MatchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tournament/getMatchesById/${id}`);
        console.log(res.data);
        setMatch(res.data.match);
      } catch (err) {
        console.error('Error fetching match:', err);
        setError('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMatch();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  if (!match) return <ErrorMessage error="Match not found" onRetry={() => router.push('/tournaments')} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FiArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {match.teams[0]?.name} vs {match.teams[1]?.name}
        </h1>

        <div className="text-gray-600 space-y-1">
          <p><strong>Date:</strong> {new Date(match.date).toLocaleString()}</p>
          <p><strong>Venue:</strong> {match.venue}</p>
          <p><strong>Status:</strong> {match.status}</p>
          <p><strong>Format:</strong> {match.format}</p>
        </div>

        {match.result && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-800">
            <strong>Result:</strong> {match.result}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Additional Details</h2>
          <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(match, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
