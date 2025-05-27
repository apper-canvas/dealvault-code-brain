import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-soft"
        >
          <ApperIcon name="Search" className="w-12 h-12 md:w-16 md:h-16 text-white" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-surface-800 dark:text-surface-200 mb-4">
          Deal Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
          Looks like this page went hunting for a better deal and never came back. 
          Let's get you back to tracking your lifetime deals!
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300 transform hover:scale-105"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;