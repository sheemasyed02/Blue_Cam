import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { Navigation } from '../components';
import { downloadImage } from '../utils/imageUtils';
import { vintageFilters } from '../filters/cssFilters';

interface CameraPageProps {
  className?: string;
  onPageChange?: (page: 'camera' | 'editor') => void;
}

export const CameraPage = ({ className, onPageChange }: CameraPageProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCapturing, setIsCapturing] = useState(false);
  const [filmCount, setFilmCount] = useState(24);
  
  // Gallery state for captured images with metadata
  const [capturedImages, setCapturedImages] = useState<Array<{
    id: string;
    dataUrl: string;
    timestamp: Date;
    filter?: string;
  }>>([]);
  
  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [filterNotification, setFilterNotification] = useState<string | null>(null);
  
  // Camera editing controls
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grain, setGrain] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [fade, setFade] = useState(0);
  const [vignette, setVignette] = useState(0);
  
  // Settings panel state
  const [showSettings, setShowSettings] = useState(false);
  
  // Gallery state
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const capture = useCallback(() => {
    if (filmCount === 0) return;
    
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsCapturing(true);
      setTimeout(() => {
        const newImage = {
          id: Date.now().toString(),
          dataUrl: imageSrc,
          timestamp: new Date(),
          filter: activeFilter
        };
        
        setCapturedImages(prev => [newImage, ...prev]);
        setCapturedImage(imageSrc);
        setFilmCount(prev => prev - 1);
        setIsCapturing(false);
      }, 300);
    }
  }, [activeFilter, filmCount]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const resetAdjustments = useCallback(() => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrain(0);
    setTemperature(0);
    setFade(0);
    setVignette(0);
    setActiveFilter('');
  }, []);

  // Generate CSS filter string
  const generateFilterString = () => {
    let filterString = '';
    
    if (brightness !== 100) filterString += `brightness(${brightness}%) `;
    if (contrast !== 100) filterString += `contrast(${contrast}%) `;
    if (saturation !== 100) filterString += `saturate(${saturation}%) `;
    if (temperature !== 0) {
      const tempHue = temperature > 0 ? temperature * 0.5 : temperature * 0.3;
      filterString += `hue-rotate(${tempHue}deg) `;
    }
    
    if (activeFilter) {
      filterString += activeFilter;
    }
    
    return filterString.trim();
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      "bg-gradient-to-br from-serelune-50 via-blush-50 to-lavender-100",
      "flex flex-col",
      className
    )}>
      {/* Dreamy Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-30 bg-gradient-dreamy"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-serelune-300/40 to-blush-300/40 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-lavender-300/30 to-serelune-400/30 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Top Navigation Bar - Responsive */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-serelune-200/30">
        <div className="flex justify-between items-center px-4 py-3 lg:px-6 lg:py-4">
          {/* Logo & Status */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-serelune-400 to-blush-400 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-glow">
                <svg className="w-5 h-5 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <h2 className="text-moonlight-800 font-title text-lg lg:text-xl font-bold">SERELUNE</h2>
              <div className="flex items-center space-x-2 lg:space-x-3 text-xs lg:text-sm text-moonlight-600">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blush-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </span>
                <span>•</span>
                <span>{filmCount} shots</span>
              </div>
            </div>
          </div>

          {/* Navigation & Settings */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Navigation currentPage="camera" onPageChange={onPageChange || (() => {})} />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 lg:p-3 rounded-xl backdrop-blur-sm border transition-all",
                showSettings 
                  ? "bg-serelune-500/20 border-serelune-400 shadow-glow" 
                  : "bg-white/20 border-serelune-200/50 hover:bg-white/30"
              )}
            >
              <svg className="w-5 h-5 text-serelune-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 relative z-10 pt-16 lg:pt-20">
        
        {/* Mobile: Stack camera above controls, Desktop: Side by side */}
        <div className="h-full flex flex-col lg:flex-row">
          
          {/* Camera Section */}
          <div className="flex-1 lg:flex-none lg:w-2/3 xl:w-3/4">
            {/* Main Camera Area */}
            <div className="h-full flex items-center justify-center p-3 lg:p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative w-full max-w-none lg:max-w-4xl 
                          aspect-[3/4] sm:aspect-[4/3] 
                          max-h-[60vh] sm:max-h-[calc(100vh-200px)]"
              >
                {/* Modern Camera Housing */}
                <div className="relative w-full h-full bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-dreamy border border-serelune-200/50 overflow-hidden">
                  
                  {/* Camera Status Bar */}
                  <div className="absolute top-0 left-0 right-0 z-30 bg-white/30 backdrop-blur-sm p-2 lg:p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blush-500 rounded-full animate-pulse"></div>
                          <span className="text-moonlight-700 text-xs lg:text-sm font-mono">REC</span>
                        </div>
                        
                        <div className="px-1.5 py-0.5 lg:px-2 lg:py-1 bg-white/30 rounded border border-serelune-200/30">
                          <span className="text-moonlight-700 text-xs font-mono">{filmCount} shots</span>
                        </div>
                        
                        {activeFilter && (
                          <div className="px-2 py-1 bg-serelune-500/20 border border-serelune-400/30 rounded-full">
                            <span className="text-serelune-700 text-xs font-medium">
                              {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filter Active'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={switchCamera}
                        className="p-1.5 lg:p-2 bg-white/30 rounded-full hover:bg-white/40 transition-all"
                      >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-moonlight-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Webcam Component */}
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    width="100%"
                    height="100%"
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: { ideal: 1920 },
                      height: { ideal: 1080 },
                      facingMode: facingMode
                    }}
                    className="w-full h-full object-cover"
                    style={{
                      filter: generateFilterString(),
                      transition: 'filter 0.3s ease-in-out'
                    }}
                  />

                  {/* Overlay Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Grain Effect */}
                    {grain > 0 && (
                      <div 
                        className="w-full h-full opacity-30 mix-blend-multiply"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${grain / 100}'/%3E%3C/svg%3E")`,
                        }}
                      />
                    )}
                    
                    {/* Vignette Effect */}
                    {vignette > 0 && (
                      <div 
                        className="w-full h-full"
                        style={{
                          background: `radial-gradient(circle at center, transparent 20%, rgba(0,0,0,${vignette / 100}) 70%)`,
                        }}
                      />
                    )}
                    
                    {/* Fade Effect */}
                    {fade > 0 && (
                      <div 
                        className="w-full h-full"
                        style={{
                          background: `rgba(255, 255, 255, ${fade / 200})`,
                          mixBlendMode: 'screen'
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Mobile Controls Panel - Below Camera */}
          <div className="lg:hidden relative z-30 bg-white/20 backdrop-blur-xl border-t border-serelune-200/30">
            <div className="p-4 space-y-4">
              
              {/* Mobile Capture Controls */}
              <div className="flex items-center justify-center space-x-6">
                
                {/* Gallery Button */}
                {capturedImages.length > 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedImageIndex(0);
                      setShowGallery(true);
                    }}
                    className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-serelune-300/50 shadow-soft bg-gradient-to-br from-serelune-100/40 to-blush-100/40 backdrop-blur-sm"
                  >
                    <img 
                      src={capturedImages[0].dataUrl} 
                      alt="Gallery"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-gradient-to-r from-serelune-500 to-blush-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-1">{capturedImages.length}</span>
                    </div>
                  </motion.button>
                ) : (
                  <div className="w-12 h-12 bg-white/20 rounded-xl border-2 border-serelune-200/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-serelune-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Capture Button - Centered */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capture}
                  disabled={isCapturing || filmCount === 0}
                  className="relative flex items-center justify-center disabled:opacity-50"
                >
                  <motion.div
                    className="w-16 h-12 rounded-2xl border-2 border-serelune-400 bg-black shadow-glow p-1"
                    animate={isCapturing ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                  >
                    <div className="w-full h-full rounded-xl bg-gray-900 p-1">
                      <div className="w-full h-full rounded-lg bg-gray-800 p-1">
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-700 to-black flex items-center justify-center">
                          {isCapturing && (
                            <motion.div
                              className="w-6 h-1.5 rounded-full bg-gray-600"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>

                {/* Filters Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "w-12 h-12 rounded-xl backdrop-blur-sm border-2 transition-all flex items-center justify-center",
                    showFilters 
                      ? "bg-serelune-500/20 border-serelune-400 shadow-glow" 
                      : "bg-white/20 border-serelune-200/50 hover:bg-white/30"
                  )}
                >
                  <svg className={cn("w-5 h-5 transition-colors", showFilters ? "text-serelune-600" : "text-serelune-500")} 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Mobile Filter Row */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex space-x-3 overflow-x-auto pb-2 px-2">
                    {[
                      { name: 'Original', cssFilter: '' },
                      ...vintageFilters.slice(0, 6)
                    ].map((filter) => (
                      <motion.button
                        key={filter.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveFilter(filter.cssFilter || '');
                          setFilterNotification(`${filter.name} applied`);
                        }}
                        className={cn(
                          "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2",
                          (activeFilter === (filter.cssFilter || ''))
                            ? "bg-serelune-500/20 border-serelune-400 text-serelune-700 shadow-glow"
                            : "bg-white/20 border-serelune-200/50 text-serelune-600 hover:bg-white/30"
                        )}
                      >
                        {filter.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop Control Panel - Side Panel */}
          <div className="hidden lg:block lg:w-1/3 xl:w-1/4 bg-white/10 backdrop-blur-xl border-l border-serelune-200/30">
            <div className="h-full flex flex-col p-6 space-y-6">
              
              {/* Desktop Gallery */}
              <div>
                <h3 className="text-serelune-700 font-title text-lg font-semibold mb-4">Gallery</h3>
                {capturedImages.length > 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedImageIndex(0);
                      setShowGallery(true);
                    }}
                    className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-serelune-300/50 shadow-soft bg-gradient-to-br from-serelune-100/40 to-blush-100/40 backdrop-blur-sm"
                  >
                    <img 
                      src={capturedImages[0].dataUrl} 
                      alt="Recent capture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-gradient-to-r from-serelune-500 to-blush-500 rounded-full flex items-center justify-center shadow-glow">
                      <span className="text-white text-sm font-bold px-2">{capturedImages.length}</span>
                    </div>
                  </motion.button>
                ) : (
                  <div className="w-full aspect-square bg-white/20 rounded-2xl border-2 border-serelune-200/30 flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 text-serelune-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-serelune-500 text-sm">No photos yet</span>
                  </div>
                )}
              </div>
              
              {/* Desktop Capture Button */}
              <div>
                <h3 className="text-serelune-700 font-title text-lg font-semibold mb-4">Capture</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capture}
                  disabled={isCapturing || filmCount === 0}
                  className="relative flex items-center justify-center disabled:opacity-50 w-full"
                >
                  <motion.div
                    className="w-24 h-16 rounded-2xl border-2 border-serelune-400 bg-black shadow-glow p-1"
                    animate={isCapturing ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                  >
                    <div className="w-full h-full rounded-xl bg-gray-900 p-1">
                      <div className="w-full h-full rounded-lg bg-gray-800 p-1">
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-700 to-black flex items-center justify-center">
                          {isCapturing && (
                            <motion.div
                              className="w-8 h-2 rounded-full bg-gray-600"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              </div>
              
              {/* Desktop Filters */}
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-serelune-700 font-title text-lg font-semibold mb-4">Filters</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Original', cssFilter: '' },
                    ...vintageFilters.slice(0, 8)
                  ].map((filter) => (
                    <motion.button
                      key={filter.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveFilter(filter.cssFilter || '');
                        setFilterNotification(`${filter.name} applied`);
                      }}
                      className={cn(
                        "w-full px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 text-left",
                        (activeFilter === (filter.cssFilter || ''))
                          ? "bg-serelune-500/20 border-serelune-400 text-serelune-700 shadow-glow"
                          : "bg-white/20 border-serelune-200/50 text-serelune-600 hover:bg-white/30"
                      )}
                    >
                      {filter.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && capturedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full bg-white/20 backdrop-blur-xl rounded-3xl border border-serelune-200/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-title text-xl font-semibold">Gallery ({capturedImages.length})</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowGallery(false)}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {capturedImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <img 
                        src={image.dataUrl} 
                        alt={`Capture ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => downloadImage(image.dataUrl, `serelune-${image.timestamp.getTime()}`)}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraPage;
