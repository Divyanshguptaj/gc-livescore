'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Tournament } from '@/types';
import { motion } from 'framer-motion';
import { TournamentSearch } from '@/components/core/tournamentPage/TournamentSearch';
import { TournamentList } from '@/components/core/tournamentPage/TournamentList';
import { EmptyState } from '@/components/core/tournamentPage/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tournament/getTournaments`);
        setTournaments(response.data.tournaments);
        setFilteredTournaments(response.data.tournaments);
      } catch (err) {
        setError('Failed to fetch tournaments. Please try again later.');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTournaments(tournaments);
    } else {
      const filtered = tournaments.filter(tournament =>
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tournament.description && tournament.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTournaments(filtered);
    }
  }, [searchTerm, tournaments]);

  const handleTournamentClick = async (tournamentId: string) => {
    router.push(`tournaments/${tournamentId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Cricket Tournaments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4"
          >
            Find and follow your favorite cricket tournaments
          </motion.p>
        </div>

        <div className="flex justify-center mb-10">
          <TournamentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {filteredTournaments.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <TournamentList 
            tournaments={filteredTournaments} 
            onTournamentClick={handleTournamentClick} 
          />
        )}
      </div>
    </div>
  );
}