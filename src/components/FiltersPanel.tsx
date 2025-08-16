import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { vintageFilters, type FilterEffect } from '../filters/cssFilters';

interface FiltersPanelProps {
  selectedImage: string | null;
  onFilterApply: (filter: string) => void;
  activeFilter?: string;
  className?: string;
}

interface FilterThumbnailProps {
  filter: FilterEffect;
  image: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterThumbnail = ({ filter, image, isActive, onClick }: FilterThumbnailProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail Container */}
      <motion.div
        className={cn(
          "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
          isActive 
            ? "border-serelune-400 shadow-glow shadow-serelune-300/50 scale-105" 
            : "border-transparent hover:border-serelune-300/50"
        )}
        whileHover={{ scale: isActive ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-moonlight-100 to-blush-50/50" />
        
        {/* Filter preview image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={filter.id}
            src={image}
            alt={`${filter.name} filter preview`}
            className="w-full h-full object-cover"
            style={{ 
              filter: filter.cssFilter,
              transition: 'filter 0.3s ease-in-out'
            }}
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Active indicator overlay */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-serelune-400/10 border-2 border-serelune-400 rounded-lg"
          />
        )}

        {/* Loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-moonlight-50/70">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-serelune-400 border-t-transparent rounded-full"
            />
          </div>
        )}
      </motion.div>

      {/* Filter Name */}
      <motion.div
        className={cn(
          "text-xs font-body text-center transition-all duration-300",
          isActive ? "text-serelune-600 font-semibold" : "text-serelune-500/70"
        )}
        animate={{
          color: isActive ? "#a855f7" : "#8b5cf6",
          fontWeight: isActive ? 600 : 400
        }}
      >
        {filter.name}
      </motion.div>
    </motion.div>
  );
};

export const FiltersPanel = ({ 
  selectedImage, 
  onFilterApply, 
  activeFilter,
  className 
}: FiltersPanelProps) => {
  const [currentFilterId, setCurrentFilterId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add "Original" as the first filter option
  const allFilters = [
    {
      name: 'Original',
      id: 'original',
      cssFilter: 'none',
      description: 'No filter applied'
    } as FilterEffect,
    ...vintageFilters
  ];

  const handleFilterClick = (filter: FilterEffect) => {
    setCurrentFilterId(filter.id);
    
    // Smooth fade animation when changing filters
    const filterValue = filter.id === 'original' ? '' : filter.cssFilter;
    onFilterApply(filterValue);
  };

  // Auto-scroll to active filter
  useEffect(() => {
    if (currentFilterId && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(
        `[data-filter-id="${currentFilterId}"]`
      ) as HTMLElement;
      
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentFilterId]);

  // Set initial filter based on activeFilter prop
  useEffect(() => {
    if (activeFilter) {
      const matchingFilter = allFilters.find(f => f.cssFilter === activeFilter);
      if (matchingFilter) {
        setCurrentFilterId(matchingFilter.id);
      }
    } else {
      setCurrentFilterId('original');
    }
  }, [activeFilter]);

  if (!selectedImage) {
    return (
      <div className={cn("py-4", className)}>
        <div className="text-center text-serelune-500/60 font-body text-sm">
          Select an image to apply filters
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("py-4", className)}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="font-title font-semibold text-serelune-700 text-lg">
          Vintage Filters
        </h3>
        <div className="text-xs text-serelune-500/70 font-body">
          {allFilters.length} filters
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Gradient overlays for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-moonlight-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-moonlight-50 to-transparent z-10 pointer-events-none" />
        
        {/* Scrollable Filter List */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {allFilters.map((filter) => (
            <div
              key={filter.id}
              data-filter-id={filter.id}
              className="flex-shrink-0"
            >
              <FilterThumbnail
                filter={filter}
                image={selectedImage}
                isActive={currentFilterId === filter.id}
                onClick={() => handleFilterClick(filter)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Current Filter Info */}
      <AnimatePresence mode="wait">
        {currentFilterId && (
          <motion.div
            key={currentFilterId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 px-4"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-serelune-200/50 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-body font-medium text-serelune-700">
                    {allFilters.find(f => f.id === currentFilterId)?.name}
                  </div>
                  <div className="text-xs text-serelune-500/70 mt-1">
                    {allFilters.find(f => f.id === currentFilterId)?.description}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-3 h-3 bg-serelune-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FiltersPanel;
