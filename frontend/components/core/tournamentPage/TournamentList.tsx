import { motion } from 'framer-motion';
import { Tournament } from '@/types';
import { TournamentCard } from './TournamentCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const TournamentList = ({ 
  tournaments, 
  onTournamentClick 
}: { 
  tournaments: Tournament[]; 
  onTournamentClick: (id: string) => void 
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament._id}
          tournament={tournament}
          onClick={() => onTournamentClick(tournament._id)}
        />
      ))}
    </motion.div>
  );
};