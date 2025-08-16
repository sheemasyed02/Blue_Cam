import { motion } from 'framer-motion';
import { cn } from '../utils';

interface NavigationProps {
  currentPage: 'camera' | 'editor';
  onPageChange: (page: 'camera' | 'editor') => void;
  className?: string;
}

export const Navigation = ({ currentPage, onPageChange, className }: NavigationProps) => {
  return (
    <div className={cn("flex gap-1.5 lg:gap-2", className)}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onPageChange('camera')}
        className={cn(
          "px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base",
          currentPage === 'camera'
            ? "bg-serelune-500 text-white shadow-glow"
            : "bg-transparent text-moonlight-700 hover:bg-serelune-100/50"
        )}
      >
        Camera
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onPageChange('editor')}
        className={cn(
          "px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-body font-medium transition-all text-sm lg:text-base",
          currentPage === 'editor'
            ? "bg-serelune-500 text-white shadow-glow"
            : "bg-transparent text-moonlight-700 hover:bg-serelune-100/50"
        )}
      >
        Editor
      </motion.button>
    </div>
  );
};
