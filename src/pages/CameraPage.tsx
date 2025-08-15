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
      setCapturedImage(imageSrc);
      
      // Add to captured images array (newest first)
      if (imageSrc) {
        setCapturedImages(prev => [imageSrc, ...prev]);
      }
      
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

  // Delete a specific image from the gallery
  const deleteImage = useCallback((indexToDelete: number) => {
    setCapturedImages(prev => prev.filter((_, index) => index !== indexToDelete));
    setShowDeleteConfirm(null);
    
    // If viewing the deleted image, close the viewer
    if (selectedImageIndex === indexToDelete) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex !== null && selectedImageIndex > indexToDelete) {
      // Adjust the selected index if it's after the deleted image
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [selectedImageIndex]);

  // Navigate between images in viewer
  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev' && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (direction === 'next' && selectedImageIndex < capturedImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  }, [selectedImageIndex, capturedImages.length]);

  // Keyboard navigation for image viewer
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigateImage('prev');
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateImage('next');
            break;
          case 'Escape':
            e.preventDefault();
            setSelectedImageIndex(null);
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            setShowDeleteConfirm(selectedImageIndex);
            break;
        }
      }
      
      // Close delete confirmation with Escape
      if (showDeleteConfirm !== null && e.key === 'Escape') {
        e.preventDefault();
        setShowDeleteConfirm(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex, showDeleteConfirm, navigateImage]);

  // Generate CSS filter string from adjustment values
  const generateFilterString = () => {
    const adjustmentFilters = `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%) 
      hue-rotate(${temperature * 1.8}deg)
    `.trim();
    
    // Combine adjustment filters with active vintage filter
    return activeFilter ? `${adjustmentFilters} ${activeFilter}` : adjustmentFilters;
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
            style={{ height: '78vh' }}
          >
            {/* Camera Container */}
            <div className="relative w-full h-full max-w-6xl mx-auto">
              
              {/* Premium Professional Camera Housing */}
              <div className="relative w-full h-full">
                
                {/* Outer Decorative Frame with Vintage Professional Look */}
                <div className="absolute inset-0 bg-gradient-to-br from-vintage-400 via-gold/40 to-copper/50 rounded-2xl shadow-2xl">
                  {/* Corner Accent Details with Enhanced Styling */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-3 border-t-3 border-gold/80 rounded-tl-xl shadow-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-3 border-t-3 border-gold/80 rounded-tr-xl shadow-lg"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-3 border-b-3 border-gold/80 rounded-bl-xl shadow-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-3 border-b-3 border-gold/80 rounded-br-xl shadow-lg"></div>
                  
                  {/* Enhanced Side Ornamental Elements */}
                  <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-2 h-24 bg-gradient-to-b from-gold via-copper to-gold rounded-full shadow-xl border border-gold/50"></div>
                  <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-2 h-24 bg-gradient-to-b from-gold via-copper to-gold rounded-full shadow-xl border border-gold/50"></div>
                  
                  {/* Enhanced Top and Bottom Accents with Additional Details */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-gold via-copper to-gold rounded-full shadow-xl border border-gold/50"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-gold via-copper to-gold rounded-full shadow-xl border border-gold/50"></div>
                  
                  {/* Additional Corner Micro Details */}
                  <div className="absolute top-2 left-2 w-3 h-3 bg-gold/60 rounded-full shadow-lg border border-gold/80"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-gold/60 rounded-full shadow-lg border border-gold/80"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-gold/60 rounded-full shadow-lg border border-gold/80"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 bg-gold/60 rounded-full shadow-lg border border-gold/80"></div>
                  
                  {/* Premium Edge Highlighting */}
                  <div className="absolute inset-1 rounded-xl border border-gold/30 pointer-events-none"></div>
                </div>

                {/* Main Camera Frame - Premium Enhanced */}
                <div className="absolute inset-3 bg-gradient-to-br from-charcoal via-vintage-900 to-charcoal rounded-xl shadow-inner border-2 border-gold/40">
                  
                  {/* Additional Inner Frame Layer for Depth */}
                  <div className="absolute inset-1 bg-gradient-to-br from-vintage-800/50 to-charcoal/50 rounded-lg border border-copper/30"></div>
                  
                  {/* Inner Professional Frame */}
                  <div className="relative w-full h-full p-2">
                    
                    {/* Enhanced Professional Camera Brand Plate */}
                    {/* <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-gold via-copper to-gold px-8 py-2 rounded-full shadow-xl border-2 border-vintage-600/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-charcoal rounded-full shadow-inner"></div>
                          <span className="text-charcoal font-title text-sm font-bold tracking-[0.25em] drop-shadow-sm">BLUE CAM </span>
                          <div className="w-2 h-2 bg-charcoal rounded-full shadow-inner"></div>
                        </div>
                        <div className="absolute inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none"></div>
                      </div>
                    </div> */}

                    {/* Lens Housing with Enhanced Premium Finish */}
                    <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border-3 border-vintage-700/40">
                      
                      {/* Multiple Inner Lens Rings for Premium Depth */}
                      <div className="absolute inset-1 rounded-lg border-2 border-gold/30 bg-gradient-to-br from-gray-900 to-black">
                        <div className="absolute inset-2 rounded-md border border-copper/40 bg-gradient-to-br from-black to-gray-800">
                          
                          {/* Enhanced Professional Grid Overlay */}
                          <div className="absolute inset-0 opacity-25">
                            {/* Rule of thirds grid with enhanced styling */}
                            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cream/40 to-transparent"></div>
                            <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cream/40 to-transparent"></div>
                            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cream/40 to-transparent"></div>
                            <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cream/40 to-transparent"></div>
                            
                            {/* Enhanced center focus point */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-cream/30 rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cream/20 rounded-full shadow-lg"></div>
                          </div>
                    
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
                        <div className="absolute inset-0">
                          {/* Corner Guides */}
                          <div className="absolute top-8 left-8 w-6 h-6 border-l-2 border-t-2 border-cream/80 rounded-tl-lg pointer-events-none"></div>
                          <div className="absolute top-8 right-8 w-6 h-6 border-r-2 border-t-2 border-cream/80 rounded-tr-lg pointer-events-none"></div>
                          <div className="absolute bottom-8 left-8 w-6 h-6 border-l-2 border-b-2 border-cream/80 rounded-bl-lg pointer-events-none"></div>
                          <div className="absolute bottom-8 right-8 w-6 h-6 border-r-2 border-b-2 border-cream/80 rounded-br-lg pointer-events-none"></div>
                          
                          {/* Center Focus */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
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
                            className="absolute top-6 right-6 p-3 bg-vintage-800/80 text-cream rounded-xl backdrop-blur-sm border border-vintage-600/50 z-10"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </motion.button>

                          {/* Settings Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowSettings(!showSettings)}
                            className={`absolute bottom-6 right-6 p-3 backdrop-blur-sm border rounded-xl transition-all z-10 ${
                              showSettings 
                                ? 'bg-gold/90 text-cream border-gold/50 shadow-lg' 
                                : 'bg-vintage-800/80 text-cream border-vintage-600/50'
                            }`}
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

                          {/* Settings Panel */}
                          <AnimatePresence>
                            {showSettings && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute bottom-20 right-6 bg-gradient-to-br from-vintage-100/95 to-vintage-200/95 backdrop-blur-lg rounded-2xl p-4 border border-vintage-300/50 shadow-2xl z-20"
                                style={{ width: '280px' }}
                              >
                                <h3 className="text-charcoal font-title text-lg mb-4 flex items-center justify-between">
                                  <span>Camera Settings</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowSettings(false)}
                                    className="p-1 text-vintage-600 hover:text-charcoal"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </motion.button>
                                </h3>
                                
                                {/* Settings Grid */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                  {/* Brightness */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'brightness' ? null : 'brightness')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'brightness' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : brightness !== 100 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span className="text-xs">Bright</span>
                                  </motion.button>

                                  {/* Contrast */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'contrast' ? null : 'contrast')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'contrast' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : contrast !== 100 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs">Contrast</span>
                                  </motion.button>

                                  {/* Saturation */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'saturation' ? null : 'saturation')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'saturation' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : saturation !== 100 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v10h2V3zM17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3h2v10h-2V3z" />
                                    </svg>
                                    <span className="text-xs">Saturation</span>
                                  </motion.button>

                                  {/* Temperature */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'temperature' ? null : 'temperature')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'temperature' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : temperature !== 0 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-xs">Temp</span>
                                  </motion.button>

                                  {/* Grain */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'grain' ? null : 'grain')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'grain' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : grain !== 0 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2V3a2 2 0 00-2-2H5zM5 7h14v10a11 11 0 01-11-11V7z" />
                                    </svg>
                                    <span className="text-xs">Grain</span>
                                  </motion.button>

                                  {/* Fade */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'fade' ? null : 'fade')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'fade' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : fade !== 0 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="text-xs">Fade</span>
                                  </motion.button>

                                  {/* Vignette */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveControl(activeControl === 'vignette' ? null : 'vignette')}
                                    className={`p-3 rounded-xl transition-all flex flex-col items-center space-y-1 ${
                                      activeControl === 'vignette' 
                                        ? 'bg-gold text-cream shadow-md' 
                                        : vignette !== 0 
                                          ? 'bg-copper/80 text-cream'
                                          : 'bg-vintage-300 text-charcoal hover:bg-vintage-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span className="text-xs">Vignette</span>
                                  </motion.button>

                                  {/* Reset Button */}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
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
                                    className="p-3 rounded-xl bg-vintage-400 text-charcoal hover:bg-vintage-500 transition-all flex flex-col items-center space-y-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-xs">Reset</span>
                                  </motion.button>
                                </div>

                                {/* Current Values Display */}
                                <div className="text-xs text-vintage-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Brightness:</span><span>{brightness}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Contrast:</span><span>{contrast}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Saturation:</span><span>{saturation}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Temperature:</span><span>{temperature > 0 ? '+' : ''}{temperature}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Slider Control (appears when control is selected) */}
          <AnimatePresence>
            {activeControl && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-vintage-100/95 to-vintage-200/95 backdrop-blur-lg rounded-2xl p-6 border border-vintage-300/50 shadow-2xl z-30 min-w-80"
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center items-center mb-6 space-x-6"
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
              <>
                {/* Gallery Button - Left side */}
                {capturedImages.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGallery(true)}
                    className="relative flex items-center justify-center"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-vintage-200 border-2 border-vintage-400 shadow-lg overflow-hidden"
                    >
                      {/* Show the most recent captured image as thumbnail */}
                      <img 
                        src={capturedImages[0]} 
                        alt="Recent capture"
                        className="w-full h-full object-cover"
                      />
                      {/* Gallery indicator */}
                      <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></div>
                    </motion.div>
                  </motion.button>
                )}
                
                {/* Default Gallery Icon when no images */}
                {capturedImages.length === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGallery(true)}
                    className="relative flex items-center justify-center opacity-50"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-vintage-200 border-2 border-vintage-300 shadow-lg flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-vintage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                  </motion.button>
                )}

                {/* Traditional Camera Shutter Button - Center */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capture}
                  disabled={isCapturing || filmCount === 0}
                  className="relative flex items-center justify-center disabled:opacity-50"
                >
                  {/* Outer Golden Border - Polished Design */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gold p-0.5 shadow-xl ring-2 ring-gold/30 ring-offset-2 ring-offset-cream"
                    animate={isCapturing ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                  >
                    {/* Inner Dark Center - Deep Black with Subtle Texture */}
                    <div className="w-full h-full bg-black rounded-xl shadow-inner border border-charcoal/20 flex items-center justify-center relative overflow-hidden">
                      {/* Subtle inner reflection for polished look */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-xl"></div>
                      
                      {/* Optional subtle inner glow when capturing */}
                      {isCapturing && (
                        <motion.div
                          className="w-12 h-12 bg-gold/15 rounded-lg border border-gold/30"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Optional capture indicator (small dot when ready) */}
                  {!isCapturing && filmCount > 0 && (
                    <motion.div
                      className="absolute w-1.5 h-1.5 bg-gold rounded-full shadow-lg ring-1 ring-gold/50"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>

                {/* Filters Button - Right side */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative flex items-center justify-center"
                >
                  <motion.div
                    className={cn(
                      "w-16 h-16 rounded-xl bg-vintage-200 border-2 shadow-lg flex items-center justify-center transition-all duration-300",
                      showFilters ? "border-gold bg-gold/10" : "border-vintage-400 hover:border-gold/50"
                    )}
                  >
                    {/* Filter/Editing Icon */}
                    <svg className={cn("w-8 h-8 transition-colors duration-300", showFilters ? "text-gold" : "text-vintage-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {/* Active filter indicator */}
                    {activeFilter && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></div>
                    )}
                  </motion.div>
                </motion.button>
              </>
            )}
          </motion.div>

        </div>
      </div>

      {/* Bottom Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-md z-40 pb-safe"
          >
            {/* Filters Container */}
            <div className="px-4 py-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-title text-cream">Vintage Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setActiveFilter('');
                  }}
                  className="text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  Clear
                </motion.button>
              </div>

              {/* Horizontal Filter Scroll */}
              <div className="relative">
                {/* Gradient overlays for scroll indication */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none" />
                
                {/* Scrollable Filter List */}
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide px-2 pb-2">
                  {/* Original (No Filter) */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFilter('')}
                    className="flex flex-col items-center space-y-2 min-w-[70px] cursor-pointer"
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300",
                      !activeFilter ? "border-gold shadow-lg shadow-gold/30" : "border-white/30 hover:border-white/50"
                    )}>
                      {/* Live camera feed preview or placeholder */}
                      <div className="w-full h-full bg-gradient-to-br from-vintage-200 to-vintage-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-vintage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                    <div className={cn(
                      "text-xs font-body text-center transition-colors duration-300",
                      !activeFilter ? "text-gold font-semibold" : "text-cream/70"
                    )}>
                      Original
                    </div>
                  </motion.div>

                  {/* Vintage Filters */}
                  {vintageFilters.map((filter) => (
                    <motion.div
                      key={filter.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveFilter(filter.cssFilter)}
                      className="flex flex-col items-center space-y-2 min-w-[70px] cursor-pointer"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300",
                        activeFilter === filter.cssFilter 
                          ? "border-gold shadow-lg shadow-gold/30" 
                          : "border-white/30 hover:border-white/50"
                      )}>
                        {/* Filter preview - using a sample image or gradient */}
                        <div 
                          className="w-full h-full bg-gradient-to-br from-vintage-200 via-peach to-vintage-300"
                          style={{ filter: filter.cssFilter }}
                        />
                      </div>
                      <div className={cn(
                        "text-xs font-body text-center transition-colors duration-300",
                        activeFilter === filter.cssFilter ? "text-gold font-semibold" : "text-cream/70"
                      )}>
                        {filter.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-vintage-100 to-vintage-200 rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-auto border border-vintage-300/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gallery Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-title text-charcoal flex items-center space-x-2">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Captured Photos ({capturedImages.length})</span>
                </h2>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowGallery(false)}
                  className="p-2 text-vintage-600 hover:text-charcoal transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Gallery Content */}
              {capturedImages.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-vintage-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-vintage-600 font-body text-lg">No photos captured yet</p>
                  <p className="text-vintage-500 font-body text-sm mt-2">Start taking photos to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {capturedImages.map((image, index) => (
                    <motion.div
                      key={`${image}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-vintage-300/50 group-hover:border-gold/50 transition-all duration-300">
                        <img 
                          src={image} 
                          alt={`Captured photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                        
                        {/* Recently captured indicator */}
                        {index === 0 && (
                          <div className="absolute top-2 right-2 bg-gold text-cream text-xs px-2 py-1 rounded-full font-body font-medium z-10">
                            Latest
                          </div>
                        )}
                        
                        {/* Action buttons overlay - Always visible for better accessibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {/* Button container at bottom */}
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center space-x-2">
                            {/* Download button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                                downloadImage(image, `vintage-capture-${timestamp}.jpg`);
                              }}
                              className="p-2 bg-gold/90 hover:bg-gold rounded-full text-cream shadow-lg transition-all duration-200 transform hover:scale-110 z-20"
                              title="Download image"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Photo number */}
                      <div className="text-center mt-2">
                        <span className="text-vintage-600 font-body text-sm">
                          #{capturedImages.length - index}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gallery Footer */}
              {capturedImages.length > 0 && (
                <div className="mt-6 pt-4 border-t border-vintage-300/50 flex items-center justify-between">
                  <p className="text-vintage-600 font-body text-sm">
                    Photos are sorted from newest to oldest
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Download all images as a zip would be complex, so let's keep it simple
                      // Each image can be downloaded individually
                      setShowGallery(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-gold to-copper text-cream rounded-lg font-body text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    Close Gallery
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-60 flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image */}
              <img 
                src={capturedImages[selectedImageIndex]} 
                alt={`Photo ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl"
              />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Navigation Arrows */}
              {selectedImageIndex > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              )}

              {selectedImageIndex < capturedImages.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg px-3 py-2 text-white">
                <span className="text-sm font-body">
                  {selectedImageIndex + 1} of {capturedImages.length}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    downloadImage(capturedImages[selectedImageIndex], `vintage-capture-${timestamp}.jpg`);
                  }}
                  className="p-2 bg-gold rounded-full text-cream shadow-lg hover:bg-gold/80 transition-colors"
                  title="Download image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.button>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteConfirm(selectedImageIndex)}
                  className="p-2 bg-red-500 rounded-full text-cream shadow-lg hover:bg-red-600 transition-colors"
                  title="Delete image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-70 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-vintage-100 to-vintage-200 rounded-2xl p-6 max-w-md border border-vintage-300/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confirmation Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-title text-charcoal">Delete Photo</h3>
              </div>

              {/* Image Preview */}
              <div className="mb-4">
                <img 
                  src={capturedImages[showDeleteConfirm]} 
                  alt="Photo to delete"
                  className="w-full h-32 object-cover rounded-lg border border-vintage-300"
                />
              </div>

              {/* Confirmation Text */}
              <p className="text-charcoal font-body mb-6">
                Are you sure you want to delete this photo? This action cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 px-4 bg-vintage-300 text-charcoal rounded-lg font-body hover:bg-vintage-400 transition-colors"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (showDeleteConfirm !== null) {
                      deleteImage(showDeleteConfirm);
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-red-500 text-cream rounded-lg font-body hover:bg-red-600 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
