import { motion } from 'framer-motion';
import { cn } from '../utils';

interface NavigationProps {
  currentPage: 'camera' | 'editor';
  onPageChange: (page: 'camera' | 'editor') => void;
  className?: string;
}

export const Navigation = ({ currentPage, onPageChange, className }: NavigationProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onPageChange('camera')}
        className={cn(
          "px-4 py-2 rounded-lg font-body font-medium transition-all",
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
          "px-4 py-2 rounded-lg font-body font-medium transition-all",
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
