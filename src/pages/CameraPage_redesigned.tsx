import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { Navigation } from '../components';
import { downloadImage } from '../utils/imageUtils';

interface CameraPageProps {
  className?: string;
  onPageChange?: (page: 'camera' | 'editor') => void;
}

export const CameraPage = ({ className, onPageChange }: CameraPageProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filmCount, setFilmCount] = useState(24);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    if (webcamRef.current && filmCount > 0) {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setFilmCount(prev => prev - 1);
      
      setTimeout(() => setIsCapturing(false), 600);
    }
  }, [webcamRef, filmCount]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setFilmCount(prev => prev + 1);
  }, []);

  const savePhoto = useCallback(() => {
    if (capturedImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadImage(capturedImage, `vintage-capture-${timestamp}.jpg`);
    }
  }, [capturedImage]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-vintage-900 via-charcoal to-vintage-800 relative overflow-hidden",
      className
    )}>
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0">
        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-vintage-400/10 to-transparent animate-pulse"></div>
        
        {/* Vintage light leaks */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-gold/20 via-transparent to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-radial from-copper/15 via-transparent to-transparent"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
        
        {/* Floating dust particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <Navigation currentPage="camera" onPageChange={onPageChange || (() => {})} />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Vintage Typography */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-title text-5xl md:text-7xl text-cream mb-4 tracking-wider">
              <span className="bg-gradient-to-r from-gold via-cream to-copper bg-clip-text text-transparent">
                VINTAGE
              </span>
            </h1>
            <p className="font-body text-vintage-300 text-lg tracking-widest uppercase">
              Cinematic Photography
            </p>
          </motion.div>

          {/* Camera Interface */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-center">
            
            {/* Left Panel - Camera Controls */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-1 space-y-6"
            >
              {/* Film Counter */}
              <div className="bg-gradient-to-br from-vintage-800/80 to-vintage-900/80 backdrop-blur-sm rounded-2xl p-6 border border-copper/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-copper font-body text-sm uppercase tracking-wider">Film</span>
                  <div className="w-3 h-3 bg-copper rounded-full animate-pulse"></div>
                </div>
                <div className="text-3xl font-title text-cream">{filmCount.toString().padStart(2, '0')}</div>
                <div className="w-full bg-vintage-700 rounded-full h-2 mt-3">
                  <motion.div 
                    className="bg-gradient-to-r from-copper to-gold h-2 rounded-full"
                    style={{ width: `${(filmCount / 36) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Time Display */}
              <div className="bg-gradient-to-br from-vintage-800/80 to-vintage-900/80 backdrop-blur-sm rounded-2xl p-6 border border-copper/30">
                <div className="text-copper font-body text-sm uppercase tracking-wider mb-2">Time</div>
                <div className="text-xl font-mono text-cream">{formatTime(currentTime)}</div>
                <div className="text-vintage-400 text-sm mt-1">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Camera Settings */}
              <div className="bg-gradient-to-br from-vintage-800/80 to-vintage-900/80 backdrop-blur-sm rounded-2xl p-6 border border-copper/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-copper font-body text-sm">ISO</span>
                    <span className="text-cream">400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-copper font-body text-sm">F-Stop</span>
                    <span className="text-cream">f/2.8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-copper font-body text-sm">Speed</span>
                    <span className="text-cream">1/60</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center - Viewfinder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-2"
            >
              {/* Vintage Camera Body */}
              <div className="relative mx-auto max-w-4xl">
                
                {/* Camera Housing */}
                <div className="relative bg-gradient-to-br from-charcoal via-vintage-900 to-charcoal rounded-3xl p-8 shadow-2xl border-2 border-vintage-700/50">
                  
                  {/* Top Camera Details */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gradient-to-br from-copper to-bronze rounded-full shadow-lg"></div>
                    <div className="bg-gradient-to-r from-bronze via-copper to-bronze px-6 py-2 rounded-full">
                      <span className="text-cream font-title text-sm tracking-widest">LEICA</span>
                    </div>
                    <div className="w-4 h-4 bg-gradient-to-br from-copper to-bronze rounded-full shadow-lg"></div>
                  </div>

                  {/* Leather Texture Frame */}
                  <div className="relative bg-gradient-to-br from-vintage-200 via-vintage-100 to-vintage-200 rounded-2xl p-6 shadow-inner">
                    
                    {/* Metal Ring */}
                    <div className="relative bg-gradient-to-br from-vintage-800 via-charcoal to-vintage-900 rounded-xl p-4 shadow-lg">
                      
                      {/* Lens Assembly */}
                      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl aspect-[16/10]">
                        
                        {capturedImage ? (
                          // Captured Photo View
                          <motion.div 
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full h-full"
                          >
                            <img 
                              src={capturedImage} 
                              alt="Captured" 
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Vintage Photo Border */}
                            <div className="absolute inset-0 border-4 border-cream/20"></div>
                            
                            {/* Film Stamp */}
                            <div className="absolute top-4 left-4 bg-vintage-900/80 text-cream px-3 py-1 rounded text-xs font-mono">
                              #{37 - filmCount}
                            </div>
                            
                            {/* Photo Actions */}
                            <div className="absolute top-4 right-4 flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={savePhoto}
                                className="p-3 bg-copper/90 text-cream rounded-full backdrop-blur-sm shadow-xl"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </motion.button>
                            </div>
                          </motion.div>
                        ) : (
                          // Live Camera View
                          <div className="relative w-full h-full">
                            <Webcam
                              ref={webcamRef}
                              audio={false}
                              screenshotFormat="image/jpeg"
                              videoConstraints={videoConstraints}
                              className="w-full h-full object-cover"
                              mirrored={facingMode === 'user'}
                            />
                            
                            {/* Viewfinder Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                              {/* Corner Brackets */}
                              <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-cream/70"></div>
                              <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-cream/70"></div>
                              <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-cream/70"></div>
                              <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-cream/70"></div>
                              
                              {/* Center Focus Circle */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <motion.div 
                                  className="w-16 h-16 border-2 border-cream/60 rounded-full"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cream/80 rounded-full"></div>
                                </motion.div>
                              </div>
                              
                              {/* Rule of Thirds */}
                              <div className="absolute inset-8 opacity-30">
                                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0">
                                  {[...Array(9)].map((_, i) => (
                                    <div key={i} className="border border-cream/20"></div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Camera Info Overlay */}
                              <div className="absolute bottom-4 left-4 text-cream/80 text-sm font-mono">
                                <div>F2.8 • 1/60s • ISO400</div>
                              </div>
                              
                              {/* Mobile Camera Switch */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={switchCamera}
                                className="absolute top-4 right-4 p-3 bg-vintage-900/80 text-cream rounded-xl backdrop-blur-sm xl:hidden"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </motion.button>
                            </div>
                            
                            {/* Capture Flash */}
                            {isCapturing && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-cream/90"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera Controls */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    <div className="w-3 h-6 bg-gradient-to-b from-copper to-bronze rounded-full"></div>
                    <div className="w-4 h-8 bg-gradient-to-b from-gold to-copper rounded-full shadow-lg"></div>
                    <div className="w-3 h-6 bg-gradient-to-b from-copper to-bronze rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-1 space-y-6"
            >
              {/* Main Action Buttons */}
              <div className="space-y-4">
                {capturedImage ? (
                  <AnimatePresence>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={retakePhoto}
                      className="w-full py-4 px-6 bg-gradient-to-br from-vintage-700 to-vintage-800 text-cream rounded-xl font-body tracking-wider uppercase shadow-xl border border-copper/30"
                    >
                      Retake Shot
                    </motion.button>
                  </AnimatePresence>
                ) : (
                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 20px 40px rgba(197, 162, 124, 0.3)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={capture}
                    disabled={isCapturing || filmCount === 0}
                    className="w-full py-6 px-8 bg-gradient-to-br from-copper via-bronze to-copper text-cream rounded-xl font-title text-xl tracking-widest uppercase shadow-2xl disabled:opacity-50 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <motion.div 
                        className="w-4 h-4 rounded-full bg-cream"
                        animate={isCapturing ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                      />
                      <span>{isCapturing ? 'CAPTURING' : 'CAPTURE'}</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </motion.button>
                )}

                {/* Desktop Camera Switch */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={switchCamera}
                  className="hidden xl:block w-full py-3 px-6 bg-vintage-800/80 backdrop-blur-sm text-cream rounded-xl font-body tracking-wider border border-copper/30"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Switch Lens</span>
                  </div>
                </motion.button>
              </div>

              {/* Exposure Meter */}
              <div className="bg-gradient-to-br from-vintage-800/80 to-vintage-900/80 backdrop-blur-sm rounded-2xl p-6 border border-copper/30">
                <div className="text-copper font-body text-sm uppercase tracking-wider mb-4">Exposure</div>
                <div className="relative">
                  <div className="w-full h-2 bg-vintage-700 rounded-full">
                    <motion.div 
                      className="h-2 bg-gradient-to-r from-copper to-gold rounded-full"
                      style={{ width: '60%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-vintage-400 mt-2">
                    <span>-2</span>
                    <span>0</span>
                    <span>+2</span>
                  </div>
                </div>
              </div>

              {/* Film Status */}
              <div className="bg-gradient-to-br from-vintage-800/80 to-vintage-900/80 backdrop-blur-sm rounded-2xl p-6 border border-copper/30">
                <div className="text-copper font-body text-sm uppercase tracking-wider mb-3">Status</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                    <span className="text-cream text-sm">Camera Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${filmCount > 5 ? 'bg-gold' : 'bg-red-500'}`}></div>
                    <span className="text-cream text-sm">Film: {filmCount > 0 ? 'Loaded' : 'Empty'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
