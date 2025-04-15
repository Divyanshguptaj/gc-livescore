import { motion } from 'framer-motion';

export const EmptyState = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <svg 
        className="mx-auto h-16 w-16 text-gray-300"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-700">
        {searchTerm ? 'No tournaments found' : 'No tournaments available'}
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        {searchTerm 
          ? 'Try adjusting your search or filter to find what you\'re looking for'
          : 'There are currently no tournaments scheduled. Check back later!'}
      </p>
    </motion.div>
  );
};