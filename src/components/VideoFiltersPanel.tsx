import { motion } from 'framer-motion';
import { cn } from '../utils';
import { videoFilters, type VideoFilterEffect } from '../filters/videoFilters';

interface VideoFiltersPanelProps {
  onFilterApply: (filter: string) => void;
  activeFilter?: string;
  className?: string;
  isRecording?: boolean;
}

interface VideoFilterThumbnailProps {
  filter: VideoFilterEffect;
  isActive: boolean;
  onClick: () => void;
  isRecording?: boolean;
}

const VideoFilterThumbnail = ({ filter, isActive, onClick, isRecording }: VideoFilterThumbnailProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0"
    >
      <button
        onClick={onClick}
        disabled={isRecording}
        className={cn(
          "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-gradient-to-br backdrop-blur-sm",
          isActive
            ? "border-serelune-400 shadow-lg shadow-serelune-300/30 from-serelune-100/50 to-serelune-200/30"
            : "border-moonlight-200/50 hover:border-moonlight-300/70 from-moonlight-100/30 to-moonlight-200/20",
          isRecording && "opacity-75 cursor-not-allowed"
        )}
      >
        {/* Video Filter Preview */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ filter: filter.cssFilter === 'none' ? '' : filter.cssFilter }}
        >
          {/* Video Icon */}
          <svg className="w-6 h-6 text-moonlight-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        
        {/* Active Indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-serelune-500 rounded-full shadow-glow animate-pulse">
            <div className="absolute inset-1 bg-white rounded-full"></div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && isActive && (
          <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>
      
      {/* Filter Name */}
      <p className="text-xs text-moonlight-700 text-center mt-1 font-medium truncate w-16">
        {filter.name}
      </p>
    </motion.div>
  );
};

export const VideoFiltersPanel = ({ 
  onFilterApply, 
  activeFilter, 
  className,
  isRecording = false 
}: VideoFiltersPanelProps) => {

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-moonlight-800 font-title font-semibold text-base flex items-center">
          <svg className="w-5 h-5 mr-2 text-serelune-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Video Filters
        </h3>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-sm font-medium">REC</span>
          </div>
        )}
      </div>

      {/* Active Filter Display */}
      {activeFilter && (
        <div className="p-2 bg-serelune-100/20 backdrop-blur-sm border border-serelune-200/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-serelune-500 rounded-full animate-pulse"></div>
            <span className="text-serelune-700 text-sm font-medium">
              {videoFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filter Active'}
            </span>
          </div>
        </div>
      )}

      {/* Filters Grid */}
      <div className="overflow-x-auto">
        <div className="flex space-x-3 pb-2">
          {videoFilters.map((filter) => (
            <VideoFilterThumbnail
              key={filter.id}
              filter={filter}
              isActive={activeFilter === filter.cssFilter}
              onClick={() => onFilterApply(filter.cssFilter)}
              isRecording={isRecording}
            />
          ))}
        </div>
      </div>

      {/* Recording Notice */}
      {isRecording && (
        <div className="p-2 bg-red-100/20 backdrop-blur-sm border border-red-200/30 rounded-lg">
          <p className="text-xs text-red-700 text-center">
            Filters are locked during recording
          </p>
        </div>
      )}
    </div>
  );
};