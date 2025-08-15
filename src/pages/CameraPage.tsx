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
  
  // Camera editing controls (like normal camera apps)
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grain, setGrain] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [fade, setFade] = useState(0);
  const [vignette, setVignette] = useState(0);
  
  // Active editing control state
  const [activeControl, setActiveControl] = useState<string | null>(null);

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

  // Generate CSS filter string from adjustment values
  const generateFilterString = () => {
    return `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%) 
      hue-rotate(${temperature * 1.8}deg)
    `.trim();
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-vintage-50 via-cream to-vintage-100 relative overflow-hidden",
      className
    )}>
      {/* Soft Background Effects */}
      <div className="absolute inset-0">
        {/* Gentle light overlay */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-gold/20 via-transparent to-peach/20"></div>
        
        {/* Soft floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold/20 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

            {/* Modern Professional Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-charcoal via-vintage-800 to-charcoal backdrop-blur-md border-b border-gold/20 shadow-xl">
        <div className="flex justify-between items-center px-8 py-3">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-copper rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-cream font-title text-xl font-bold tracking-wide">Blue Cam</h2>
              <p className="text-gold/80 text-xs font-body tracking-widest uppercase">Vintage Vibes</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-6">
            <Navigation currentPage="camera" onPageChange={onPageChange || (() => {})} />
            
            {/* Status Indicators */}
            {/* <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gold/20 rounded-full">
                <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                <span className="text-cream font-body text-xs">Live</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-copper/20 rounded-full">
                <svg className="w-3 h-3 text-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-cream font-body text-xs">HD</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-20 pb-6">
        <div className="max-w-7xl mx-auto">

          {/* Main Camera Area - 75% of screen */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
            style={{ height: '80vh' }}
          >
            {/* Camera Container */}
            <div className="relative w-full h-full max-w-6xl mx-auto">
              
              {/* Soft Camera Housing */}
              <div className="relative w-full h-full bg-gradient-to-br from-vintage-200/80 via-cream/90 to-vintage-300/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-vintage-300/50">
                
                {/* Inner Frame */}
                <div className="relative w-full h-full bg-gradient-to-br from-charcoal/80 via-vintage-800/80 to-charcoal/80 rounded-2xl p-4 shadow-inner">
                  
                  {/* Camera Lens Area */}
                  <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-xl">
                    
                    {capturedImage ? (
                      // Captured Photo View
                      <motion.div 
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-full"
                      >
                        <img 
                          src={capturedImage} 
                          alt="Captured" 
                          className="w-full h-full object-cover transition-all duration-300"
                          style={{ 
                            filter: generateFilterString(),
                            boxShadow: vignette > 0 ? `inset 0 0 ${vignette * 2}px rgba(0,0,0,${vignette / 100})` : 'none'
                          }}
                        />
                        
                        {/* Film Grain Overlay for captured image */}
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
                        
                        {/* Fade Overlay for captured image */}
                        {fade > 0 && (
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `rgba(255, 255, 255, ${fade / 200})`,
                              mixBlendMode: 'screen'
                            }}
                          />
                        )}
                        
                        {/* Photo Actions */}
                        <div className="absolute top-6 right-6 flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={savePhoto}
                            className="p-4 bg-gold/90 text-cream rounded-full backdrop-blur-sm shadow-xl border border-gold/50"
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
                            className="p-4 bg-copper/90 text-cream rounded-full backdrop-blur-sm shadow-xl border border-copper/50"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
                          className="w-full h-full object-cover transition-all duration-300"
                          style={{ 
                            filter: generateFilterString(),
                            boxShadow: vignette > 0 ? `inset 0 0 ${vignette * 2}px rgba(0,0,0,${vignette / 100})` : 'none'
                          }}
                          mirrored={facingMode === 'user'}
                        />
                        
                        {/* Film Grain Overlay */}
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
                        
                        {/* Fade Overlay */}
                        {fade > 0 && (
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `rgba(255, 255, 255, ${fade / 200})`,
                              mixBlendMode: 'screen'
                            }}
                          />
                        )}
                        
                        {/* Soft Viewfinder Overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Corner Guides */}
                          <div className="absolute top-8 left-8 w-6 h-6 border-l-2 border-t-2 border-cream/80 rounded-tl-lg"></div>
                          <div className="absolute top-8 right-8 w-6 h-6 border-r-2 border-t-2 border-cream/80 rounded-tr-lg"></div>
                          <div className="absolute bottom-8 left-8 w-6 h-6 border-l-2 border-b-2 border-cream/80 rounded-bl-lg"></div>
                          <div className="absolute bottom-8 right-8 w-6 h-6 border-r-2 border-b-2 border-cream/80 rounded-br-lg"></div>
                          
                          {/* Center Focus */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <motion.div 
                              className="w-12 h-12 border border-cream/60 rounded-full"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cream/80 rounded-full"></div>
                            </motion.div>
                          </div>
                          
                          {/* Camera Switch Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={switchCamera}
                            className="absolute top-6 right-6 p-3 bg-vintage-800/80 text-cream rounded-xl backdrop-blur-sm border border-vintage-600/50"
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
                            animate={{ opacity: [0, 0.8, 0] }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-cream/90"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Camera Controls Panel Below Camera */}
         
     
            
          {/* Capture Button Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center mb-6"
          >
            {capturedImage ? (
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={retakePhoto}
                  className="py-4 px-8 bg-gradient-to-br from-vintage-600 to-vintage-700 text-cream rounded-xl font-body tracking-wider shadow-lg border border-vintage-500/50"
                >
                  Retake Photo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPageChange && onPageChange('editor')}
                  className="py-4 px-8 bg-gradient-to-br from-copper to-gold text-cream rounded-xl font-body tracking-wider shadow-lg border border-gold/50"
                >
                  Edit Photo
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={capture}
                disabled={isCapturing || filmCount === 0}
                className="py-6 px-12 bg-gradient-to-br from-gold via-copper to-gold text-cream rounded-xl font-title text-lg tracking-wider shadow-2xl disabled:opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-cream"
                    animate={isCapturing ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                  />
                  <span>{isCapturing ? 'CAPTURING...' : 'CAPTURE'}</span>
                </span>
              </motion.button>
            )}
          </motion.div>

          {/* Icon-Based Camera Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            
            {/* Control Icons Row */}
            <div className="flex justify-center space-x-4 mb-6">
              {/* Brightness */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'brightness' ? null : 'brightness')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'brightness' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : brightness !== 100 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </motion.button>

              {/* Contrast */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'contrast' ? null : 'contrast')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'contrast' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : contrast !== 100 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.button>

              {/* Saturation */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'saturation' ? null : 'saturation')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'saturation' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : saturation !== 100 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v10h2V3zM17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3h2v10h-2V3z" />
                </svg>
              </motion.button>

              {/* Temperature */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'temperature' ? null : 'temperature')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'temperature' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : temperature !== 0 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </motion.button>

              {/* Grain */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'grain' ? null : 'grain')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'grain' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : grain !== 0 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2V3a2 2 0 00-2-2H5zM5 7h14v10a11 11 0 01-11-11V7z" />
                </svg>
              </motion.button>

              {/* Fade */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'fade' ? null : 'fade')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'fade' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : fade !== 0 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.button>

              {/* Vignette */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveControl(activeControl === 'vignette' ? null : 'vignette')}
                className={`p-4 rounded-xl transition-all ${
                  activeControl === 'vignette' 
                    ? 'bg-gold text-cream shadow-lg' 
                    : vignette !== 0 
                      ? 'bg-copper/80 text-cream'
                      : 'bg-vintage-200 text-charcoal hover:bg-vintage-300'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4" />
                </svg>
              </motion.button>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setBrightness(100);
                  setContrast(100);
                  setSaturation(100);
                  setGrain(0);
                  setTemperature(0);
                  setFade(0);
                  setVignette(0);
                  setActiveControl(null);
                }}
                className="p-4 rounded-xl bg-vintage-400 text-charcoal hover:bg-vintage-500 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>

            {/* Enhanced Slider Control */}
            <AnimatePresence>
              {activeControl && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-vintage-100/95 to-vintage-200/95 backdrop-blur-sm rounded-2xl p-6 border border-vintage-300/50 shadow-xl"
                >
                  {/* Brightness Control */}
                  {activeControl === 'brightness' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>Brightness</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">{brightness}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-gold/80 to-gold rounded-full shadow-sm"
                            style={{ width: `${((brightness - 50) / (200 - 50)) * 100}%` }}
                            animate={{ width: `${((brightness - 50) / (200 - 50)) * 100}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="1"
                          value={brightness}
                          onChange={(e) => setBrightness(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-gold border-3 border-cream rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${((brightness - 50) / (200 - 50)) * 100}%` }}
                          animate={{ left: `${((brightness - 50) / (200 - 50)) * 100}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-cream rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>Dark</span>
                        <span>Normal</span>
                        <span>Bright</span>
                      </div>
                    </div>
                  )}

                  {/* Contrast Control */}
                  {activeControl === 'contrast' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Contrast</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">{contrast}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-copper/80 to-copper rounded-full shadow-sm"
                            style={{ width: `${((contrast - 50) / (200 - 50)) * 100}%` }}
                            animate={{ width: `${((contrast - 50) / (200 - 50)) * 100}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="1"
                          value={contrast}
                          onChange={(e) => setContrast(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-copper border-3 border-cream rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${((contrast - 50) / (200 - 50)) * 100}%` }}
                          animate={{ left: `${((contrast - 50) / (200 - 50)) * 100}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-cream rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>Flat</span>
                        <span>Normal</span>
                        <span>High</span>
                      </div>
                    </div>
                  )}

                  {/* Saturation Control */}
                  {activeControl === 'saturation' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v10h2V3zM17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3h2v10h-2V3z" />
                          </svg>
                          <span>Saturation</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">{saturation}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-sepia/80 to-sepia rounded-full shadow-sm"
                            style={{ width: `${(saturation / 200) * 100}%` }}
                            animate={{ width: `${(saturation / 200) * 100}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="1"
                          value={saturation}
                          onChange={(e) => setSaturation(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-sepia border-3 border-cream rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${(saturation / 200) * 100}%` }}
                          animate={{ left: `${(saturation / 200) * 100}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-cream rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>B&W</span>
                        <span>Normal</span>
                        <span>Vivid</span>
                      </div>
                    </div>
                  )}

                  {/* Temperature Control */}
                  {activeControl === 'temperature' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Temperature</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">
                          {temperature > 0 ? '+' : ''}{temperature}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400/80 via-vintage-400 to-orange-400/80 rounded-full shadow-sm"
                            style={{ width: `${((temperature + 100) / 200) * 100}%` }}
                            animate={{ width: `${((temperature + 100) / 200) * 100}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="1"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-bronze border-3 border-cream rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${((temperature + 100) / 200) * 100}%` }}
                          animate={{ left: `${((temperature + 100) / 200) * 100}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-cream rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>Cool</span>
                        <span>Neutral</span>
                        <span>Warm</span>
                      </div>
                    </div>
                  )}

                  {/* Grain Control */}
                  {activeControl === 'grain' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2V3a2 2 0 00-2-2H5zM5 7h14v10a11 11 0 01-11-11V7z" />
                          </svg>
                          <span>Film Grain</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">{grain}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-vintage-600/80 to-vintage-800 rounded-full shadow-sm"
                            style={{ width: `${grain}%` }}
                            animate={{ width: `${grain}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={grain}
                          onChange={(e) => setGrain(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-vintage-700 border-3 border-cream rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${grain}%` }}
                          animate={{ left: `${grain}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-cream rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>Clean</span>
                        <span>Subtle</span>
                        <span>Heavy</span>
                      </div>
                    </div>
                  )}

                  {/* Fade Control */}
                  {activeControl === 'fade' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Fade</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">{fade}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cream/80 to-cream rounded-full shadow-sm"
                            style={{ width: `${fade}%` }}
                            animate={{ width: `${fade}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={fade}
                          onChange={(e) => setFade(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-cream border-3 border-charcoal rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${fade}%` }}
                          animate={{ left: `${fade}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-charcoal rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>Sharp</span>
                        <span>Dreamy</span>
                        <span>Faded</span>
                      </div>
                    </div>
                  )}

                  {/* Vignette Control */}
                  {activeControl === 'vignette' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-charcoal font-title text-xl flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9 12l2 2 4-4" />
                          </svg>
                          <span>Vignette</span>
                        </h3>
                        <span className="text-2xl font-mono text-charcoal font-bold">{vignette}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full h-4 bg-vintage-300 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className="h-full bg-gradient-to-r from-charcoal/80 to-charcoal rounded-full shadow-sm"
                            style={{ width: `${vignette}%` }}
                            animate={{ width: `${vignette}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={vignette}
                          onChange={(e) => setVignette(Number(e.target.value))}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                        
                        <motion.div
                          className="absolute top-1/2 w-6 h-6 bg-charcoal border-3 border-cream rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${vignette}%` }}
                          animate={{ left: `${vignette}%` }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="absolute inset-1 bg-cream rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-vintage-600">
                        <span>None</span>
                        <span>Subtle</span>
                        <span>Strong</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Film Status and Info */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Film Counter */}
            <div className="bg-gradient-to-br from-vintage-100/90 to-vintage-200/90 backdrop-blur-sm rounded-xl p-4 border border-vintage-300/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-charcoal font-body text-sm font-medium">Film Remaining</span>
                <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-title text-charcoal">{filmCount.toString().padStart(2, '0')}</div>
              <div className="w-full bg-vintage-300 rounded-full h-2 mt-2">
                <motion.div 
                  className="bg-gradient-to-r from-gold to-copper h-2 rounded-full"
                  style={{ width: `${(filmCount / 36) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Camera Info */}
            <div className="bg-gradient-to-br from-vintage-100/90 to-vintage-200/90 backdrop-blur-sm rounded-xl p-4 border border-vintage-300/50">
              <div className="text-charcoal font-body text-sm font-medium mb-2">Live Adjustments</div>
              <div className="space-y-1 text-sm text-vintage-700">
                <div>Brightness: {brightness}% • Contrast: {contrast}%</div>
                <div>Saturation: {saturation}% • Temperature: {temperature > 0 ? '+' : ''}{temperature}</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${filmCount > 0 ? 'bg-gold' : 'bg-red-500'}`}></div>
                  <span>Film {filmCount > 0 ? 'Loaded' : 'Empty'}</span>
                </div>
              </div>
            </div>

            {/* Time Display */}
            <div className="bg-gradient-to-br from-vintage-100/90 to-vintage-200/90 backdrop-blur-sm rounded-xl p-4 border border-vintage-300/50">
              <div className="text-charcoal font-body text-sm font-medium mb-2">Current Time</div>
              <div className="text-xl font-mono text-charcoal">{formatTime(currentTime)}</div>
              <div className="text-vintage-600 text-sm mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
