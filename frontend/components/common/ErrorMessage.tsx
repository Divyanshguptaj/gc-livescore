import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="inline-block"
          >
            <FiAlertTriangle className="h-12 w-12 text-white mx-auto" />
          </motion.div>
          <h2 className="mt-4 text-xl font-bold text-white">Oops! Something went wrong</h2>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-600 mb-6">{error}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiRefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </motion.button>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Still having trouble?{' '}
              <a 
                href="mailto:support@cricketapp.com" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};