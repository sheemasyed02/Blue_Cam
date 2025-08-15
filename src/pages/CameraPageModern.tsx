import { useState, useRef, useCallback, useEffect } from 'react';
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
  
  // Gallery state for captured images
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
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
  
  // Active editing control state
  const [activeControl, setActiveControl] = useState<string | null>(null);
  
  // Settings panel state
  const [showSettings, setShowSettings] = useState(false);

  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    if (webcamRef.current && filmCount > 0) {
      setIsCapturing(true);
      
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        if (activeFilter) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              
              const adjustmentFilters = `
                brightness(${brightness}%) 
                contrast(${contrast}%) 
                saturate(${saturation}%) 
                hue-rotate(${temperature * 1.8}deg)
              `.trim();
              
              const completeFilter = `${adjustmentFilters} ${activeFilter}`;
              ctx.filter = completeFilter;
              ctx.drawImage(img, 0, 0);
              
              const filteredImageSrc = canvas.toDataURL('image/jpeg', 0.9);
              setCapturedImage(filteredImageSrc);
              setCapturedImages(prev => [filteredImageSrc, ...prev]);
            }
          };
          img.src = imageSrc;
        } else {
          setCapturedImage(imageSrc);
          setCapturedImages(prev => [imageSrc, ...prev]);
        }
      }
      
      setFilmCount(prev => prev - 1);
      setTimeout(() => setIsCapturing(false), 500);
    }
  }, [webcamRef, activeFilter, brightness, contrast, saturation, temperature, filmCount]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const savePhoto = () => {
    if (capturedImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadImage(capturedImage, `blue-cam-${timestamp}.jpg`);
    }
  };

  const generateFilterString = () => {
    const adjustmentFilters = `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%) 
      hue-rotate(${temperature * 1.8}deg)
    `.trim();
    
    return activeFilter ? `${adjustmentFilters} ${activeFilter}` : adjustmentFilters;
  };

  const deleteImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    }
    setShowDeleteConfirm(null);
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden flex flex-col",
      "bg-gradient-to-br from-slate-950 via-slate-900 to-storm-950",
      className
    )}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20 bg-gradient-mesh"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-electric-500/25 to-amber-500/25 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-tr from-emerald-500/20 to-electric-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
        
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-electric-400/40 to-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Logo & Status */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-glow">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-electric-400 rounded-full animate-pulse"></div>
            </div>
            
            <div>
              <h2 className="text-white font-title text-xl font-bold">Blue Cam Pro</h2>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </span>
                <span>•</span>
                <span>{filmCount} shots left</span>
                {activeFilter && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400">
                      {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filtered'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation & Settings */}
          <div className="flex items-center space-x-4">
            <Navigation currentPage="camera" onPageChange={onPageChange || (() => {})} />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-3 rounded-xl backdrop-blur-sm border transition-all",
                showSettings 
                  ? "bg-electric-500/20 border-electric-400/50 text-electric-400" 
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              )}
            >
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: showSettings ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content - Modern Layout */}
      <div className="flex-1 relative z-10 pt-20">
        
        {/* Camera Viewport - Centered with Modern Controls */}
        <div className="h-full flex flex-col">
          
          {/* Main Camera Area */}
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-full max-w-4xl aspect-[4/3] max-h-[calc(100vh-200px)]"
            >
              {/* Modern Camera Housing */}
              <div className="relative w-full h-full bg-slate-950/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                
                {/* Camera Status Bar */}
                <div className="absolute top-0 left-0 right-0 z-30 bg-black/50 backdrop-blur-sm p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {/* Recording Indicator */}
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-mono">REC</span>
                      </div>
                      
                      {/* Active Filter Indicator */}
                      {activeFilter && (
                        <div className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full">
                          <span className="text-amber-400 text-xs font-medium">
                            {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filter Active'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Switch Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        switchCamera();
                      }}
                      className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                
                {/* Main Camera Viewport */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  
                  {/* Professional Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
                    {/* Rule of thirds */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50"></div>
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50"></div>
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50"></div>
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50"></div>
                    
                    {/* Center focus indicator */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <motion.div 
                        className="w-20 h-20 border-2 border-electric-400/70 rounded-full"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-full h-full border border-white/30 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-electric-400 rounded-full"></div>
                      </motion.div>
                    </div>
                    
                    {/* Corner frame indicators */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-electric-400/60"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-electric-400/60"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-electric-400/60"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-electric-400/60"></div>
                  </div>
                  
                  {/* Camera Content */}
                  {capturedImage ? (
                    // Captured Photo Display
                    <motion.div 
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-full h-full"
                    >
                      <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full h-full object-cover rounded-3xl"
                        style={{ 
                          filter: generateFilterString(),
                          boxShadow: vignette > 0 ? `inset 0 0 ${vignette * 2}px rgba(0,0,0,${vignette / 100})` : 'none'
                        }}
                      />
                      
                      {/* Photo Actions */}
                      <div className="absolute bottom-6 right-6 flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={savePhoto}
                          className="p-4 bg-electric-500/90 text-white rounded-xl backdrop-blur-sm shadow-glow border border-electric-400/50"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onPageChange && onPageChange('editor')}
                          className="p-4 bg-amber-500/90 text-white rounded-xl backdrop-blur-sm shadow-glow border border-amber-400/50"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    // Live Camera Feed
                    <div 
                      className="relative w-full h-full cursor-pointer rounded-3xl overflow-hidden"
                      onClick={capture}
                      title="Tap to capture photo"
                    >
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="w-full h-full object-cover"
                        style={{ 
                          filter: generateFilterString(),
                          boxShadow: vignette > 0 ? `inset 0 0 ${vignette * 2}px rgba(0,0,0,${vignette / 100})` : 'none'
                        }}
                        mirrored={facingMode === 'user'}
                      />
                      
                      {/* Capture Hint */}
                      {!isCapturing && (
                        <motion.div 
                          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/20"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <svg className="w-12 h-12 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="text-white text-sm text-center font-medium">Tap to Capture</div>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Effects Overlays */}
                      {grain > 0 && (
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                          style={{
                            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                            backgroundSize: `${2}px ${2}px`,
                            opacity: grain / 100
                          }}
                        />
                      )}
                      
                      {fade > 0 && (
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `rgba(255, 255, 255, ${fade / 200})`,
                            mixBlendMode: 'screen'
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Modern Control Dock */}
          <div className="relative z-30 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <div className="max-w-4xl mx-auto">
              
              {/* Main Controls Row */}
              <div className="flex items-center justify-between">
                
                {/* Left: Gallery */}
                <div className="flex items-center space-x-4">
                  {capturedImages.length > 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGallery(true)}
                      className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-glow"
                    >
                      <img 
                        src={capturedImages[0]} 
                        alt="Recent capture"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full shadow-glow"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-1 left-1 text-white text-xs font-bold">{capturedImages.length}</div>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGallery(true)}
                      className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                  )}
                </div>
                
                {/* Center: Capture Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capture}
                  disabled={isCapturing || filmCount === 0}
                  className="relative flex items-center justify-center disabled:opacity-50"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-electric-500 to-amber-500 p-1 shadow-glow"
                    animate={isCapturing ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                  >
                    <div className="w-full h-full bg-white rounded-full shadow-inner flex items-center justify-center">
                      {isCapturing ? (
                        <motion.div
                          className="w-6 h-6 bg-red-500 rounded-sm"
                          animate={{ scale: [1, 0.8, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-electric-500 to-amber-500 rounded-full"></div>
                      )}
                    </div>
                  </motion.div>
                </motion.button>
                
                {/* Right: Filters */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "w-16 h-16 rounded-2xl backdrop-blur-sm border-2 flex items-center justify-center transition-all",
                    showFilters 
                      ? "bg-amber-500/20 border-amber-400/50 text-amber-400" 
                      : "bg-white/10 border-white/20 text-white"
                  )}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {activeFilter && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full shadow-glow"></div>
                  )}
                </motion.button>
              </div>
              
              {/* Quick Settings Strip */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 flex justify-center space-x-4"
                >
                  {['brightness', 'contrast', 'saturation', 'temperature'].map((control) => (
                    <motion.button
                      key={control}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveControl(activeControl === control ? null : control)}
                      className={cn(
                        "p-3 rounded-xl backdrop-blur-sm border transition-all capitalize text-sm",
                        activeControl === control
                          ? "bg-electric-500/20 border-electric-400/50 text-electric-400"
                          : "bg-white/10 border-white/20 text-white"
                      )}
                    >
                      <span>{control}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-xl border-l border-white/20 z-50"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-title text-lg font-bold">Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFilters(false)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="space-y-3">
                {vintageFilters.map((filter) => (
                  <motion.button
                    key={filter.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveFilter(filter.cssFilter);
                      setFilterNotification(filter.name);
                      setTimeout(() => setFilterNotification(null), 2000);
                    }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      activeFilter === filter.cssFilter
                        ? "bg-amber-500/20 border-amber-400/50 text-amber-400"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    )}
                  >
                    <div className="font-medium">{filter.name}</div>
                    <div className="text-xs opacity-70 mt-1">{filter.description}</div>
                  </motion.button>
                ))}
                
                {/* Clear Filter */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter('')}
                  className="w-full p-4 rounded-xl border-2 border-red-500/50 bg-red-500/20 text-red-400 text-left"
                >
                  <div className="font-medium">No Filter</div>
                  <div className="text-xs opacity-70 mt-1">Clear all filters</div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Notification */}
      <AnimatePresence>
        {filterNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 left-6 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-amber-400/30 z-40"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">
                {filterNotification} Applied
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
