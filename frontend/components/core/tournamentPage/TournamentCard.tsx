import { motion } from 'framer-motion';
import { Tournament } from '@/types'; 

const statusColors = {
  Upcoming: 'bg-amber-100 text-amber-800',
  Ongoing: 'bg-teal-100 text-teal-800',
  Completed: 'bg-purple-100 text-purple-800'
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 }
  }
};

export const TournamentCard = ({ tournament, onClick }: { tournament: Tournament; onClick: () => void }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{tournament.name}</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[tournament.status]}`}>
            {tournament.status}
          </span>
        </div>
        
        {tournament.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tournament.description}</p>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="flex-shrink-0 mr-2 h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {tournament.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="flex-shrink-0 mr-2 h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(tournament.startDate)}
            {tournament.endDate && ` - ${formatDate(tournament.endDate)}`}
          </div>
          
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <div className="flex items-center text-gray-600">
              <svg className="flex-shrink-0 mr-2 h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
              {tournament.teams.length} teams
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="flex-shrink-0 mr-2 h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {tournament.format}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};