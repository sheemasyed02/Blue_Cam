import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { Navigation } from '../components';
import { downloadImage } from '../utils/imageUtils';
import { vintageFilters } from '../filters/cssFilters';
import { videoFilters } from '../filters/videoFilters';

interface CameraPageProps {
  className?: string;
  onPageChange?: (page: 'camera' | 'editor', imageData?: string) => void;
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
  
  // Photobooth state
  const [photoboothSettings, setPhotoboothSettings] = useState({
    photoCount: 4,
    timerSeconds: 5
  });
  const [isPhotoboothActive, setIsPhotoboothActive] = useState(false);
  const [photoboothImages, setPhotoboothImages] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showPhotoboothResult, setShowPhotoboothResult] = useState(false);
  const [showPhotoboothSettings, setShowPhotoboothSettings] = useState(false);
  
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
  
  // Reset notification
  const [resetNotification, setResetNotification] = useState(false);
  
  // Gallery modal state
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Camera preview for filter thumbnails
  const [cameraPreview, setCameraPreview] = useState<string | null>(null);

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState<Array<{
    id: string;
    blob: Blob;
    url: string;
    timestamp: Date;
    filter?: string;
    facingMode: 'user' | 'environment';
  }>>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<number | null>(null);
  
  // Video filters state (separate from photo filters)
  const [showVideoFilters, setShowVideoFilters] = useState(false);
  const [activeVideoFilter, setActiveVideoFilter] = useState<string>('none');
  const [currentMode, setCurrentMode] = useState<'photo' | 'video'>('photo');
  const [showVideoGallery, setShowVideoGallery] = useState(false);

  // Photobooth functions
  const startPhotobooth = useCallback(() => {
    setIsPhotoboothActive(true);
    setPhotoboothImages([]);
    setCurrentPhotoIndex(0);
    setCountdown(photoboothSettings.timerSeconds);
  }, [photoboothSettings.timerSeconds]);

  const capturePhotoboothPhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Apply filter if active
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
              setPhotoboothImages(prev => [...prev, filteredImageSrc]);
            }
          };
          img.src = imageSrc;
        } else {
          setPhotoboothImages(prev => [...prev, imageSrc]);
        }
        
        setCurrentPhotoIndex(prev => prev + 1);
        
        // Check if we've taken all photos
        if (currentPhotoIndex + 1 >= photoboothSettings.photoCount) {
          setIsPhotoboothActive(false);
          setShowPhotoboothResult(true);
        } else {
          // Start next photo countdown immediately without delay
          setCountdown(photoboothSettings.timerSeconds);
        }
      }
    }
  }, [activeFilter, brightness, contrast, saturation, temperature, currentPhotoIndex, photoboothSettings.photoCount, photoboothSettings.timerSeconds]);

  // Countdown effect
  useEffect(() => {
    let timer: number;
    
    if (isPhotoboothActive && countdown > 1) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isPhotoboothActive && countdown === 1) {
      // Show "Hehe" for a moment, then continue countdown
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isPhotoboothActive && countdown === 0) {
      // Capture photo immediately
      capturePhotoboothPhoto();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isPhotoboothActive, capturePhotoboothPhoto]);

  const downloadPhotobooth = useCallback(() => {
    if (photoboothImages.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Calculate dimensions for photobooth strip - increased for better quality
    const stripWidth = 600; // Doubled from 300
    const photoHeight = 400; // Doubled from 200
    const padding = 40; // Doubled from 20
    const headerHeight = 120; // Doubled from 60
    
    canvas.width = stripWidth;
    canvas.height = headerHeight + (photoHeight * photoboothImages.length) + (padding * (photoboothImages.length + 1));
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, 0, canvas.width, headerHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial'; // Increased from 18px
    ctx.textAlign = 'center';
    ctx.fillText('Have a good dayyy! ✨', canvas.width / 2, 70); // Adjusted position
    
    ctx.font = '24px Arial'; // Increased from 12px
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 100); // Adjusted position
    
    // Load and draw each photo
    let loadedCount = 0;
    const loadPromises = photoboothImages.map((imageSrc, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const y = headerHeight + padding + (index * (photoHeight + padding));
          const photoWidth = stripWidth - (padding * 2);
          
          // Draw photo border
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(padding - 10, y - 10, photoWidth + 20, photoHeight + 20); // Increased border from 5px to 10px
          
          // Draw photo
          ctx.drawImage(img, padding, y, photoWidth, photoHeight);
          
          // Photo number
          ctx.fillStyle = '#6b7280';
          ctx.font = 'bold 28px Arial'; // Increased from 14px
          ctx.textAlign = 'right';
          ctx.fillText(`${index + 1}`, stripWidth - padding - 20, y + 40); // Adjusted position
          
          loadedCount++;
          if (loadedCount === photoboothImages.length) {
            // Download the photobooth
            const link = document.createElement('a');
            link.download = `serelune-photobooth-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          resolve();
        };
        img.src = imageSrc;
      });
    });
    
    Promise.all(loadPromises);
  }, [photoboothImages]);

  const resetPhotobooth = useCallback(() => {
    setPhotoboothImages([]);
    setCurrentPhotoIndex(0);
    setShowPhotoboothResult(false);
    setIsPhotoboothActive(false);
    setCountdown(0);
  }, []);

  const videoConstraints = {
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1080, max: 1080 },
    facingMode: facingMode
  };

  // Capture current camera view for filter previews
  const capturePreview = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCameraPreview(imageSrc);
      return imageSrc;
    }
    return null;
  }, []);

  // Update preview when filters panel opens
  const handleFiltersToggle = useCallback(() => {
    if (!showFilters) {
      // Opening filters - capture preview
      capturePreview();
    }
    setShowFilters(!showFilters);
  }, [showFilters, capturePreview]);

  const capture = useCallback(() => {
    if (webcamRef.current && filmCount > 0 && !isPhotoboothActive) {
      setIsCapturing(true);
      
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        const timestamp = new Date();
        const imageId = `img-${timestamp.getTime()}`;
        
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
              setCapturedImages(prev => [{
                id: imageId,
                dataUrl: filteredImageSrc,
                timestamp,
                filter: vintageFilters.find(f => f.cssFilter === activeFilter)?.name
              }, ...prev]);
            }
          };
          img.src = imageSrc;
        } else {
          setCapturedImage(imageSrc);
          setCapturedImages(prev => [{
            id: imageId,
            dataUrl: imageSrc,
            timestamp,
            filter: undefined
          }, ...prev]);
        }
      }
      
      setFilmCount(prev => prev - 1);
      setTimeout(() => setIsCapturing(false), 500);
    }
  }, [webcamRef, activeFilter, brightness, contrast, saturation, temperature, filmCount, isPhotoboothActive]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const savePhoto = () => {
    if (capturedImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadImage(capturedImage, `blue-cam-${timestamp}.jpg`);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setFilmCount(prev => prev + 1);
  };

  // Video recording functions
  const startVideoRecording = useCallback(async () => {
    if (!webcamRef.current?.stream) return;

    try {
      const stream = webcamRef.current.stream;
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const videoRecord = {
          id: Date.now().toString(),
          blob,
          url,
          timestamp: new Date(),
          filter: activeVideoFilter !== 'none' ? activeVideoFilter : undefined,
          facingMode
        };
        
        setRecordedVideos(prev => [...prev, videoRecord]);
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(timer);

      recorder.start();
    } catch (error) {
      console.error('Error starting video recording:', error);
    }
  }, [activeVideoFilter, facingMode]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      
      // Ensure camera feed returns by clearing any captured image state
      setCapturedImage(null);
    }
  }, [mediaRecorder, isRecording, recordingInterval]);

  const formatRecordingTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleVideoFiltersToggle = useCallback(() => {
    setShowVideoFilters(!showVideoFilters);
  }, [showVideoFilters]);

  const generateFilterString = () => {
    const adjustmentFilters = `
      brightness(${brightness}%) 
      contrast(${contrast}%) 
      saturate(${saturation}%) 
      hue-rotate(${temperature * 1.8}deg)
    `.trim();
    
    if (currentMode === 'video' && activeVideoFilter && activeVideoFilter !== 'none') {
      const videoFilter = videoFilters.find(f => f.name === activeVideoFilter);
      return videoFilter ? `${adjustmentFilters} ${videoFilter.cssFilter}` : adjustmentFilters;
    }
    
    return activeFilter ? `${adjustmentFilters} ${activeFilter}` : adjustmentFilters;
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      "bg-gradient-to-br from-serelune-50 via-blush-50 to-lavender-100",
      // Desktop: flex column layout
      "flex flex-col",
      // Mobile: ensure proper stacking
      "lg:flex-col",
      className
    )}>
      {/* Dreamy Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-30 bg-gradient-dreamy"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-serelune-300/40 to-blush-300/40 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-lavender-300/30 to-serelune-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blush-200/20 to-serelune-200/20 rounded-full blur-2xl animate-pulse-soft"></div>
        <div className="absolute inset-0 bg-gradient-moonbeam"></div>
        
        {/* Sparkle Effects */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-serelune-400/60 to-blush-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar - Responsive */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-serelune-200/30">
        <div className={cn(
          "flex justify-between items-center",
          // Mobile: Smaller padding
          "px-4 py-3 lg:px-6 lg:py-4"
        )}>
          {/* Logo & Status - Responsive */}
          <div className={cn(
            "flex items-center",
            // Mobile: Smaller spacing
            "space-x-2 lg:space-x-4"
          )}>
            <div>
              <h2 className={cn(
                "text-moonlight-800 font-title font-bold",
                // Mobile: Smaller title
                "text-lg lg:text-xl"
              )}>SERELUNE</h2>
              <div className={cn(
                "flex items-center text-moonlight-600",
                // Mobile: Smaller text and spacing
                "space-x-2 text-xs lg:space-x-3 lg:text-sm"
              )}>
                {activeFilter && (
                  <span className="text-serelune-600 truncate">
                    {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filtered'}
                  </span>
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
                  ? "bg-serelune-500/20 border-serelune-400/50 text-serelune-600 shadow-glow" 
                  : "bg-white/30 border-serelune-200/30 text-moonlight-700 hover:bg-white/40"
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
        
        {/* Camera Viewport - Responsive Layout */}
        <div className="h-full flex flex-col lg:flex-col">
          
          {/* Main Camera Area - Responsive Heights */}
          <div className="flex-1 flex items-center justify-center p-3 lg:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "relative w-full",
                // Mobile: Increased height to 75vh for mobile
                "h-[75vh] md:h-[75vh]",
                // Desktop: Original constraints
                "lg:max-w-4xl lg:aspect-[4/3] lg:max-h-[calc(100vh-200px)] lg:h-auto"
              )}
            >
              {/* Modern Camera Housing */}
              <div className="relative w-full h-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-dreamy border border-serelune-200/50 overflow-hidden">
                
                {/* Camera Status Bar */}
                <div className="absolute top-0 left-0 right-0 z-30 bg-white/30 backdrop-blur-sm p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {/* Recording Indicator */}
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blush-500 rounded-full animate-pulse"></div>
                        <span className="text-moonlight-700 text-sm font-mono">REC</span>
                      </div>
                      
                      {/* Active Filter Indicator */}
                      {activeFilter && (
                        <div className="px-3 py-1 bg-serelune-500/20 border border-serelune-400/30 rounded-full">
                          <span className="text-serelune-700 text-xs font-medium">
                            {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filter Active'}
                          </span>
                        </div>
                      )}
                      
                      {/* Photobooth Active Indicator */}
                      {isPhotoboothActive && (
                        <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full">
                          <span className="text-purple-700 text-xs font-medium">
                            Photobooth Mode - Photo {currentPhotoIndex + 1}/{photoboothSettings.photoCount}
                          </span>
                        </div>
                      )}
                      
                      {/* Settings Active Indicator */}
                      {showSettings && (
                        <div className="px-3 py-1 bg-lavender-500/20 border border-lavender-400/30 rounded-full">
                          <span className="text-lavender-700 text-xs font-medium">Settings</span>
                        </div>
                      )}
                      
                      {/* Active Control Indicator */}
                      {activeControl && (
                        <div className="px-3 py-1 bg-blush-500/20 border border-blush-400/30 rounded-full">
                          <span className="text-blush-700 text-xs font-medium capitalize">
                            {activeControl} Adjusting
                          </span>
                        </div>
                      )}
                      
                      {/* Reset Notification */}
                      {resetNotification && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full"
                        >
                          <span className="text-emerald-600 text-xs font-medium">Settings Reset</span>
                        </motion.div>
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
                      className="p-2 bg-white/30 rounded-lg backdrop-blur-sm hover:bg-white/40 transition-all border border-serelune-200/30"
                    >
                      <svg className="w-5 h-5 text-moonlight-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                
                {/* Main Camera Viewport */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  
                  {/* Professional Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20 opacity-25">
                    {/* Rule of thirds */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-serelune-400/50"></div>
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-serelune-400/50"></div>
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-serelune-400/50"></div>
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-serelune-400/50"></div>
                    
                    {/* Center focus indicator */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <motion.div 
                        className="w-20 h-20 border-2 border-serelune-500/70 rounded-full"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-full h-full border border-blush-400/40 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-serelune-500 rounded-full"></div>
                      </motion.div>
                    </div>
                    
                    {/* Corner frame indicators */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-serelune-500/60"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-serelune-500/60"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-serelune-500/60"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-serelune-500/60"></div>
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
                          onClick={retakePhoto}
                          className="p-4 bg-moonlight-400/90 text-white rounded-xl backdrop-blur-sm shadow-soft border border-moonlight-300/50"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={savePhoto}
                          className="p-4 bg-serelune-500/90 text-white rounded-xl backdrop-blur-sm shadow-glow border border-serelune-400/50"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onPageChange && onPageChange('editor', capturedImage || undefined)}
                          className="p-4 bg-blush-500/90 text-white rounded-xl backdrop-blur-sm shadow-blush border border-blush-400/50"
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
                      onClick={currentMode === 'photo' ? capture : undefined}
                      title={currentMode === 'photo' ? "Tap to capture photo" : "Video mode active"}
                    >
                      {/* Stable Webcam Container - Prevents dancing during recording */}
                      <div className="absolute inset-0 w-full h-full">
                        <Webcam
                          ref={webcamRef}
                          audio={currentMode === 'video'} // Enable audio for video recording
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className="w-full h-full object-cover"
                          style={{ 
                            filter: generateFilterString(),
                            boxShadow: vignette > 0 ? `inset 0 0 ${vignette * 2}px rgba(0,0,0,${vignette / 100})` : 'none',
                            // Prevent any transforms that could cause dancing
                            transform: 'none'
                          }}
                          mirrored={facingMode === 'user'}
                        />
                      </div>
                      
                      {/* Video Recording Status Overlay */}
                      {currentMode === 'video' && isRecording && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                        >
                          <motion.div
                            className="w-3 h-3 bg-white rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="text-sm font-medium">Recording</span>
                          <span className="text-sm font-mono">{formatRecordingTime(recordingTime)}</span>
                        </motion.div>
                      )}
                      
                      {/* Photobooth Countdown Overlay */}
                      {countdown > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="text-white text-6xl lg:text-8xl font-bold font-mono text-center drop-shadow-2xl"
                          >
                            {countdown === 1 ? 'SMILE! 😊' : countdown}
                          </motion.div>
                        </motion.div>
                      )}
                      
                      {/* Capture Hint */}
                      {!isCapturing && !isPhotoboothActive && countdown === 0 && (
                        <motion.div 
                          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-serelune-200/20"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-serelune-300/50 shadow-dreamy">
                            <svg className="w-12 h-12 text-serelune-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="text-moonlight-700 text-sm text-center font-medium">Tap to Capture</div>
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
          
          {/* Mobile Filters Panel - Horizontal Strip */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative z-20 bg-white/10 backdrop-blur-md border-t border-white/20",
                  // Only show on mobile, hide on desktop
                  "block lg:hidden",
                  "px-4 py-3"
                )}
              >
                {/* Mobile Filter Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-moonlight-800 font-title font-semibold text-base">Filters</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFilters(false)}
                    className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all border border-white/20"
                  >
                    <svg className="w-4 h-4 text-moonlight-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Active Filter Display - Mobile */}
                {activeFilter && (
                  <div className="mb-3 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-amber-400 text-sm font-medium">
                        {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filter Active'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Horizontal Filter Grid - Mobile */}
                <div className="overflow-x-auto">
                  <div className="flex space-x-3 pb-2">
                    {/* Clear Filter Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveFilter('');
                        setFilterNotification(null);
                      }}
                      className={cn(
                        "flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-moonlight-300 bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all",
                        !activeFilter ? "opacity-50" : "hover:bg-white/20"
                      )}
                    >
                      <svg className="w-6 h-6 text-moonlight-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>

                    {/* Filter Thumbnails */}
                    {vintageFilters.map((filter) => (
                      <motion.div
                        key={filter.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0"
                      >
                        <button
                          onClick={() => {
                            setActiveFilter(filter.cssFilter);
                            setFilterNotification(`${filter.name} applied!`);
                            setTimeout(() => setFilterNotification(null), 2000);
                          }}
                          className={cn(
                            "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-moonlight-100/50 backdrop-blur-sm",
                            activeFilter === filter.cssFilter
                              ? "border-amber-400 shadow-lg shadow-amber-300/30"
                              : "border-moonlight-200/50 hover:border-moonlight-300/70"
                          )}
                        >
                          {/* Thumbnail Preview */}
                          <div 
                            className="w-full h-full bg-gradient-to-br from-moonlight-200/30 via-moonlight-100/20 to-moonlight-300/30"
                            style={{ filter: filter.cssFilter }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-moonlight-400/60 to-moonlight-600/40"></div>
                            </div>
                          </div>
                          
                          {/* Active Indicator */}
                          {activeFilter === filter.cssFilter && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full shadow-glow animate-pulse"></div>
                          )}
                        </button>
                        
                        {/* Filter Name - Mobile */}
                        <p className="text-xs text-moonlight-700 text-center mt-1 font-medium truncate w-16">
                          {filter.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Video Filters Panel - Horizontal Strip */}
          <AnimatePresence>
            {showVideoFilters && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative z-20 bg-red-900/10 backdrop-blur-md border-t border-red-300/20",
                  // Only show on mobile, hide on desktop
                  "block lg:hidden",
                  "px-4 py-3"
                )}
              >
                {/* Mobile Video Filter Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-red-800 font-title font-semibold text-base">Video Filters</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowVideoFilters(false)}
                    className="p-1.5 bg-red-500/10 backdrop-blur-sm rounded-lg hover:bg-red-500/20 transition-all border border-red-300/20"
                  >
                    <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Active Video Filter Display - Mobile */}
                {activeVideoFilter !== 'none' && (
                  <div className="mb-3 p-2 bg-red-500/10 backdrop-blur-sm border border-red-300/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-sm font-medium">
                        {videoFilters.find(f => f.name === activeVideoFilter)?.name || 'Filter Active'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Horizontal Video Filter Grid - Mobile */}
                <div className="overflow-x-auto">
                  <div className="flex space-x-3 pb-2">
                    {/* Clear Video Filter Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveVideoFilter('none');
                      }}
                      className={cn(
                        "flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-red-300 bg-red-500/10 backdrop-blur-sm flex items-center justify-center transition-all",
                        activeVideoFilter === 'none' ? "opacity-50" : "hover:bg-red-500/20"
                      )}
                    >
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>

                    {/* Video Filter Thumbnails */}
                    {videoFilters.map((filter) => (
                      <motion.div
                        key={filter.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0"
                      >
                        <button
                          onClick={() => {
                            setActiveVideoFilter(filter.name);
                          }}
                          disabled={isRecording}
                          className={cn(
                            "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-red-100/50 backdrop-blur-sm",
                            activeVideoFilter === filter.name
                              ? "border-red-400 shadow-lg shadow-red-300/30"
                              : "border-red-200/50 hover:border-red-300/70",
                            isRecording && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {/* Video Filter Thumbnail Preview */}
                          <div 
                            className="w-full h-full bg-gradient-to-br from-red-200/30 via-red-100/20 to-red-300/30"
                            style={{ filter: filter.cssFilter }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400/60 to-red-600/40"></div>
                            </div>
                          </div>
                          
                          {/* Active Indicator */}
                          {activeVideoFilter === filter.name && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full shadow-glow animate-pulse"></div>
                          )}
                        </button>
                        
                        {/* Video Filter Name - Mobile */}
                        <p className="text-xs text-red-700 text-center mt-1 font-medium truncate w-16">
                          {filter.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* REMOVED: Mobile Frames Panel */}
          {/* Modern Control Dock - Responsive with improved layout */}
          <div className={cn(
            "relative z-30 bg-gradient-to-t from-white/30 to-transparent backdrop-blur-sm",
            // Mobile: Fixed bottom with padding for safe area
            "p-4 pb-8 lg:p-6",
            // Mobile: Full width bottom controls
            "lg:relative"
          )}>
            <div className="max-w-5xl mx-auto">
              
              {/* Controls Layout - Better organized for mobile and desktop */}
              <div className={cn(
                "flex items-center justify-center gap-4",
                // Mobile: Stack vertically for better touch targets
                "flex-col sm:flex-row",
                // Desktop: Spread across available space
                "lg:justify-between lg:flex-row"
              )}>
                
                {/* Top Row on Mobile / Left Side on Desktop - Mode Toggle & Gallery */}
                <div className={cn(
                  "flex items-center gap-4",
                  "order-1 sm:order-none"
                )}>
                  
                  {/* Mode Toggle - Photo/Video */}
                  <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1 border border-serelune-200/30">
                    {/* Photo Mode */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentMode('photo');
                        setCapturedImage(null); // Ensure camera feed is visible
                        setShowVideoFilters(false); // Close video filters if open
                      }}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        currentMode === 'photo' 
                          ? "bg-serelune-500 text-white shadow-glow" 
                          : "text-moonlight-700 hover:bg-white/30"
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.button>
                    
                    {/* Video Mode */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentMode('video');
                        setCapturedImage(null); // Ensure camera feed is visible
                        setShowFilters(false); // Close photo filters if open
                      }}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        currentMode === 'video' 
                          ? "bg-red-500 text-white shadow-glow" 
                          : "text-moonlight-700 hover:bg-white/30"
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  {/* Gallery Button - Photo/Video */}
                  {(currentMode === 'photo' && capturedImages.length > 0) || (currentMode === 'video' && recordedVideos.length > 0) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (currentMode === 'photo') {
                          setSelectedImageIndex(0);
                          setShowGallery(true);
                        } else {
                          setShowVideoGallery(true);
                        }
                      }}
                      className={cn(
                        "relative rounded-2xl overflow-hidden border-2 border-purple-400/60 shadow-lg shadow-purple-500/30 bg-gradient-to-br from-purple-100/40 to-purple-200/40 backdrop-blur-sm",
                        // Mobile: Bigger size to match other icons
                        "w-14 h-14 lg:w-18 lg:h-18"
                      )}
                      title={`View Gallery (${capturedImages.length} photos)`}
                    >
                      <img 
                        src={capturedImages[0].dataUrl} 
                        alt="Recent capture"
                        className="w-full h-full object-cover"
                      />
                      {/* Gallery indicator badge */}
                      <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-serelune-500 to-blush-500 rounded-full flex items-center justify-center shadow-glow">
                        <span className="text-white text-xs font-bold px-1">{capturedImages.length}</span>
                      </div>
                      {/* Gallery icon overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-serelune-600/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {/* Recent timestamp */}
                      <div className="absolute bottom-0 left-0 right-0 bg-serelune-800/70 text-white text-xs px-1 py-0.5 text-center">
                        {capturedImages[0].timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 lg:w-18 lg:h-18 bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-serelune-200/50 flex flex-col items-center justify-center hover:bg-white/40 transition-all"
                      title="No photos captured yet"
                    >
                      <svg className="w-6 h-6 text-moonlight-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                  )}

                  {/* Photobooth Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPhotoboothSettings(true)}
                    disabled={isCapturing || isPhotoboothActive}
                    className="relative flex items-center justify-center disabled:opacity-50"
                    title="Start Photobooth Mode"
                  >
                    <motion.div
                      className={cn(
                        "rounded-2xl border-2 bg-gradient-to-br shadow-glow p-1",
                        isPhotoboothActive 
                          ? "border-serelune-400 from-serelune-500 to-blush-500" 
                          : "border-moonlight-400/70 from-moonlight-300/20 to-serelune-300/20",
                        // Mobile: Match other icons size
                        "w-14 h-14 lg:w-18 lg:h-18"
                      )}
                      animate={isPhotoboothActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3, repeat: isPhotoboothActive ? Infinity : 0 }}
                    >
                      <div className="w-full h-full rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        {/* Photobooth strip icon with camera */}
                        <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                          {/* Photo strip background */}
                          <div className="w-full h-full bg-white/90 rounded-md border border-white/40 shadow-sm">
                            {/* Three photo frames in strip */}
                            <div className="flex flex-col h-full p-0.5 gap-0.5">
                              <div className="flex-1 bg-purple-400/30 rounded-sm"></div>
                              <div className="flex-1 bg-purple-400/30 rounded-sm"></div>
                              <div className="flex-1 bg-purple-400/30 rounded-sm"></div>
                            </div>
                          </div>
                          {/* Small camera icon overlay */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-purple-500 rounded-full flex items-center justify-center border border-white/60">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.button>
                </div>
                
                {/* Center Section - Main Capture Button */}
                <div className={cn(
                  "flex items-center justify-center",
                  "order-2 sm:order-none"
                )}>
                  
                  {/* Main Capture/Record Button - Enhanced Size */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={currentMode === 'video' ? (isRecording ? stopVideoRecording : startVideoRecording) : capture}
                    disabled={isCapturing || filmCount === 0 || isPhotoboothActive}
                    className="relative flex items-center justify-center disabled:opacity-50"
                  >
                    <motion.div
                      className={cn(
                        "rounded-2xl border-2 shadow-glow p-1",
                        currentMode === 'video' 
                          ? isRecording 
                            ? "border-red-600 bg-red-600" 
                            : "border-red-400 bg-black"
                          : "border-serelune-400 bg-black",
                        // Enhanced size for better prominence
                        "w-20 h-16 lg:w-24 lg:h-20"
                      )}
                      animate={
                        // Only animate for photo capture, not video recording to keep camera steady
                        currentMode === 'photo' && isCapturing 
                          ? { scale: [1, 1.1, 1] } 
                          : {}
                      }
                      transition={{ 
                        duration: 0.3, 
                        repeat: (currentMode === 'photo' && isCapturing) ? Infinity : 0 
                      }}
                    >
                      {/* First inner layer */}
                      <div className={cn(
                        "w-full h-full rounded-xl p-1",
                        currentMode === 'video' && isRecording ? "bg-red-700" : "bg-gray-900"
                      )}>
                        {/* Second inner layer */}
                        <div className={cn(
                          "w-full h-full rounded-lg p-1",
                          currentMode === 'video' && isRecording ? "bg-red-800" : "bg-gray-800"
                        )}>
                          {/* Third inner layer */}
                          <div className={cn(
                            "w-full h-full rounded-lg bg-gradient-to-br flex items-center justify-center",
                            currentMode === 'video' && isRecording 
                              ? "from-red-700 to-red-900" 
                              : "from-gray-700 to-black"
                          )}>
                            {currentMode === 'video' ? (
                              <>
                                {/* Recording timer - Better positioned */}
                                {isRecording && (
                                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-mono shadow-lg">
                                      {formatRecordingTime(recordingTime)}
                                    </div>
                                  </div>
                                )}
                                {/* Recording indicator */}
                                {isRecording ? (
                                  <motion.div
                                    className="w-6 h-6 bg-white rounded"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                                )}
                              </>
                            ) : (
                              <>
                                {(isCapturing) && (
                                  <motion.div
                                    className="w-10 h-3 rounded-full bg-gray-600"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.button>
                </div>
                
                {/* Right Section - Secondary Controls */}
                <div className={cn(
                  "flex items-center gap-4",
                  "order-3 sm:order-none"
                )}>
                  
                  {/* Photobooth Button - Only for photo mode */}
                  {currentMode === 'photo' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPhotoboothSettings(true)}
                      disabled={isCapturing || isPhotoboothActive}
                      className="relative flex items-center justify-center disabled:opacity-50"
                      title="Start Photobooth Mode"
                    >
                      <motion.div
                        className={cn(
                          "rounded-2xl border-2 bg-gradient-to-br shadow-glow p-1",
                          "from-purple-500/20 to-purple-600/30 border-purple-400/60",
                          "w-14 h-14 lg:w-16 lg:h-16"
                        )}
                      >
                        <div className="w-full h-full rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                          {/* Photobooth strip icon with camera */}
                          <div className="relative w-8 h-8 lg:w-9 lg:h-9">
                            {/* Photo strip background */}
                            <div className="w-full h-full bg-white/90 rounded-md border border-white/40 shadow-sm">
                              {/* Three photo frames in strip */}
                              <div className="flex flex-col h-full p-0.5 gap-0.5">
                                <div className="flex-1 bg-purple-400/30 rounded-sm"></div>
                                <div className="flex-1 bg-purple-400/30 rounded-sm"></div>
                                <div className="flex-1 bg-purple-400/30 rounded-sm"></div>
                              </div>
                            </div>
                            {/* Small camera icon overlay */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-purple-500 rounded-full flex items-center justify-center border border-white/60">
                              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.button>
                  )}

                  {/* Filters Button - Handles both photo and video filters */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={currentMode === 'video' ? handleVideoFiltersToggle : handleFiltersToggle}
                    className={cn(
                      "rounded-2xl backdrop-blur-sm border-2 flex items-center justify-center transition-all",
                      "w-14 h-14 lg:w-16 lg:h-16",
                      (showFilters || showVideoFilters)
                        ? "bg-purple-500/15 border-purple-400/60 text-purple-600 shadow-glow shadow-purple-300/50" 
                        : "bg-white/30 border-purple-300/40 text-purple-500 hover:border-purple-400/60 hover:bg-purple-50/20"
                    )}
                  >
                    <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {/* 3 interlocking circles design */}
                      <circle cx="12" cy="8" r="4.5" strokeWidth={1.5} fill="none" />
                      <circle cx="8" cy="15" r="4.5" strokeWidth={1.5} fill="none" />
                      <circle cx="16" cy="15" r="4.5" strokeWidth={1.5} fill="none" />
                    </svg>
                    {(activeFilter || (currentMode === 'video' && activeVideoFilter !== 'none')) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full shadow-glow animate-sparkle"></div>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {/* Quick Settings Strip */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {/* Control Buttons Row 1 */}
                    <div className="flex justify-center space-x-3 mb-3">
                      {['brightness', 'contrast', 'saturation', 'temperature'].map((control) => (
                        <motion.button
                          key={control}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveControl(activeControl === control ? null : control)}
                          className={cn(
                            "p-3 rounded-xl backdrop-blur-sm border transition-all capitalize text-sm min-w-[80px]",
                            activeControl === control
                              ? "bg-serelune-500/20 border-serelune-400/50 text-serelune-700 shadow-glow"
                              : "bg-white/30 border-serelune-200/50 text-moonlight-700"
                          )}
                        >
                          <span>{control}</span>
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Control Buttons Row 2 */}
                    <div className="flex justify-center space-x-3 mb-4">
                      {['grain', 'fade', 'vignette'].map((control) => (
                        <motion.button
                          key={control}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveControl(activeControl === control ? null : control)}
                          className={cn(
                            "p-3 rounded-xl backdrop-blur-sm border transition-all capitalize text-sm min-w-[80px]",
                            activeControl === control
                              ? "bg-serelune-500/20 border-serelune-400/50 text-serelune-700 shadow-glow"
                              : "bg-white/30 border-serelune-200/50 text-moonlight-700"
                          )}
                        >
                          <span>{control}</span>
                        </motion.button>
                      ))}
                      
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
                          setResetNotification(true);
                          setTimeout(() => setResetNotification(false), 2000);
                        }}
                        className="p-3 rounded-xl backdrop-blur-sm border border-rose-500/50 bg-rose-500/20 text-rose-600 transition-all text-sm min-w-[80px] hover:bg-rose-500/30 hover:border-rose-400/70"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Reset</span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Control Panel */}
      <AnimatePresence>
        {activeControl && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-serelune-200/50 z-40 p-6"
          >
            <div className="max-w-4xl mx-auto">
              {/* Brightness Control */}
              {activeControl === 'brightness' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-moonlight-800 font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Brightness</span>
                    </h3>
                    <span className="text-xl font-mono text-serelune-700 font-bold">{brightness}%</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="1"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
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
                    <h3 className="text-white font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Contrast</span>
                    </h3>
                    <span className="text-xl font-mono text-white font-bold">{contrast}%</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="1"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              {/* Saturation Control */}
              {activeControl === 'saturation' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v10h2V3zM17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3h2v10h-2V3z" />
                      </svg>
                      <span>Saturation</span>
                    </h3>
                    <span className="text-xl font-mono text-white font-bold">{saturation}%</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="1"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
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
                    <h3 className="text-white font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Temperature</span>
                    </h3>
                    <span className="text-xl font-mono text-white font-bold">
                      {temperature > 0 ? '+' : ''}{temperature}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
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
                    <h3 className="text-white font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2V3a2 2 0 00-2-2H5zM5 7h14v10a11 11 0 01-11-11V7z" />
                      </svg>
                      <span>Film Grain</span>
                    </h3>
                    <span className="text-xl font-mono text-white font-bold">{grain}%</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={grain}
                      onChange={(e) => setGrain(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
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
                    <h3 className="text-white font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Fade</span>
                    </h3>
                    <span className="text-xl font-mono text-white font-bold">{fade}%</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={fade}
                      onChange={(e) => setFade(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
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
                    <h3 className="text-white font-title text-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12l2 2 4-4" />
                      </svg>
                      <span>Vignette</span>
                    </h3>
                    <span className="text-xl font-mono text-white font-bold">{vignette}%</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={vignette}
                      onChange={(e) => setVignette(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/60">
                    <span>None</span>
                    <span>Subtle</span>
                    <span>Strong</span>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveControl(null)}
                  className="px-6 py-3 bg-serelune-500/20 text-serelune-700 rounded-xl border border-serelune-300/50 hover:bg-serelune-500/30 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "fixed top-0 right-0 h-full bg-white/10 backdrop-blur-2xl border-l border-white/20 z-50 flex flex-col shadow-2xl",
              // Only show on desktop, hide on mobile
              "hidden lg:flex lg:w-80"
            )}
          >
            {/* Header - Responsive */}
            <div className={cn(
              "border-b border-white/20 bg-white/5 backdrop-blur-sm",
              // Mobile: Smaller padding
              "p-4 lg:p-6"
            )}>
              <div className="flex justify-between items-center">
                <h3 className={cn(
                  "text-moonlight-800 font-title font-bold",
                  // Mobile: Smaller title
                  "text-lg lg:text-xl"
                )}>Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFilters(false)}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  <svg className="w-5 h-5 text-moonlight-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Active Filter Display */}
              {activeFilter && (
                <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-amber-400 text-sm font-medium">
                      {vintageFilters.find(f => f.cssFilter === activeFilter)?.name || 'Filter Active'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Scrollable Filter List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {/* No Filter Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveFilter('');
                    setFilterNotification('Original');
                    setTimeout(() => setFilterNotification(null), 2000);
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all backdrop-blur-sm",
                    !activeFilter
                      ? "bg-white/20 border-white/30 text-serelune-700 shadow-lg"
                      : "bg-white/5 border-white/10 text-moonlight-800 hover:bg-white/15 hover:text-serelune-700"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 border border-white/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Original</div>
                      <div className="text-xs opacity-70 mt-1">No filter applied</div>
                    </div>
                  </div>
                </motion.button>

                {/* Vintage Filters */}
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
                      "w-full p-4 rounded-xl border-2 text-left transition-all backdrop-blur-sm",
                      activeFilter === filter.cssFilter
                        ? "bg-white/20 border-white/30 text-serelune-700 shadow-lg"
                        : "bg-white/5 border-white/10 text-moonlight-800 hover:bg-white/15 hover:text-serelune-700"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Filter Preview */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/30">
                        {cameraPreview ? (
                          <img 
                            src={cameraPreview}
                            alt={`${filter.name} preview`}
                            className="w-full h-full object-cover"
                            style={{ filter: filter.cssFilter }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100"
                            style={{ filter: filter.cssFilter }}
                          />
                        )}
                      </div>
                      
                      {/* Filter Info */}
                      <div className="flex-1">
                        <div className="font-medium">{filter.name}</div>
                        <div className="text-xs opacity-70 mt-1 line-clamp-2">{filter.description}</div>
                      </div>
                      
                      {/* Active Indicator */}
                      {activeFilter === filter.cssFilter && (
                        <div className="w-2 h-2 bg-serelune-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10">
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveFilter('');
                    setFilterNotification('Filters Cleared');
                    setTimeout(() => setFilterNotification(null), 2000);
                  }}
                  className="flex-1 py-3 px-4 bg-red-500/20 border border-red-400/50 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                >
                  Clear All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 px-4 bg-green-500/20 border border-green-400/50 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all shadow-lg"
                >
                  Done
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Video Filter Panel */}
      <AnimatePresence>
        {showVideoFilters && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "fixed top-0 right-0 h-full bg-red-900/10 backdrop-blur-2xl border-l border-red-300/20 z-50 flex flex-col shadow-2xl",
              // Only show on desktop, hide on mobile
              "hidden lg:flex lg:w-80"
            )}
          >
            {/* Header - Responsive */}
            <div className={cn(
              "border-b border-red-300/20 bg-red-500/5 backdrop-blur-sm",
              // Mobile: Smaller padding
              "p-4 lg:p-6"
            )}>
              <div className="flex justify-between items-center">
                <h3 className={cn(
                  "text-red-800 font-title font-bold",
                  // Mobile: Smaller title
                  "text-lg lg:text-xl"
                )}>Video Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVideoFilters(false)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all border border-red-300/30"
                >
                  <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Active Video Filter Display */}
              {activeVideoFilter !== 'none' && (
                <div className="mt-3 p-3 bg-red-500/15 border border-red-400/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-700 text-sm font-medium">
                      {videoFilters.find(f => f.name === activeVideoFilter)?.name || 'Filter Active'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Filter Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-3">
                {/* Clear Filter Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveVideoFilter('none')}
                  className={cn(
                    "aspect-square rounded-xl border-2 border-dashed border-red-300 bg-red-500/10 flex flex-col items-center justify-center text-center transition-all",
                    activeVideoFilter === 'none' ? "bg-red-500/20 border-red-400" : "hover:bg-red-500/15"
                  )}
                >
                  <svg className="w-8 h-8 text-red-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs text-red-700 font-medium">None</span>
                </motion.button>

                {/* Video Filter Options */}
                {videoFilters.map((filter) => (
                  <motion.button
                    key={filter.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveVideoFilter(filter.name)}
                    disabled={isRecording}
                    className={cn(
                      "relative aspect-square rounded-xl border-2 overflow-hidden transition-all bg-red-100/50",
                      activeVideoFilter === filter.name
                        ? "border-red-400 shadow-lg shadow-red-300/30"
                        : "border-red-200/50 hover:border-red-300/70",
                      isRecording && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Video Filter Preview */}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-red-200/40 via-red-100/30 to-red-300/40 flex items-center justify-center"
                      style={{ filter: filter.cssFilter }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400/70 to-red-600/50"></div>
                    </div>
                    
                    {/* Filter Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-red-900/70 text-white px-2 py-1">
                      <span className="text-xs font-medium block truncate">{filter.name}</span>
                    </div>
                    
                    {/* Active Indicator */}
                    {activeVideoFilter === filter.name && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full shadow-glow animate-pulse"></div>
                    )}
                    
                    {/* Recording Disabled Overlay */}
                    {isRecording && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m0 0V9a6 6 0 1112 0v6" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="p-6 border-t border-red-300/10">
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveVideoFilter('none')}
                  className="flex-1 py-3 px-4 bg-red-500/20 border border-red-400/50 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                >
                  Clear All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVideoFilters(false)}
                  className="flex-1 py-3 px-4 bg-green-500/20 border border-green-400/50 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all shadow-lg"
                >
                  Done
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
            className="fixed bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-serelune-400/50 z-40 shadow-glow"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-serelune-500 rounded-full animate-pulse"></div>
              <span className="text-moonlight-800 text-sm font-medium">
                {filterNotification} Applied
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && capturedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-pearl-900/90 via-moonlight-900/85 to-serelune-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full sm:h-auto sm:max-w-4xl sm:w-full bg-gradient-to-br from-pearl-50/95 to-serelune-50/95 backdrop-blur-xl rounded-none sm:rounded-3xl border-0 sm:border border-pearl-200/50 overflow-hidden flex flex-col"
            >
              {/* Gallery Header */}
              <div className="p-3 sm:p-6 border-b border-pearl-200/30 flex justify-between items-center flex-shrink-0">
                <div>
                  <h3 className="text-moonlight-800 font-title text-lg sm:text-xl font-bold">Gallery ({capturedImages.length})</h3>
                  <p className="text-moonlight-600 text-xs sm:text-sm mt-1">
                    Recent captures • {capturedImages.length > 0 ? 
                      capturedImages[selectedImageIndex].timestamp.toLocaleDateString() : ''
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Clear All Button */}
                  {capturedImages.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCapturedImages([]);
                        setShowGallery(false);
                      }}
                      className="flex items-center space-x-2 px-2 sm:px-3 py-2 bg-blush-500/20 border border-blush-400/50 text-blush-600 rounded-lg text-xs sm:text-sm hover:bg-blush-500/30 transition-all"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Clear All</span>
                    </motion.button>
                  )}
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowGallery(false)}
                    className="p-2 bg-pearl-200/30 rounded-lg hover:bg-pearl-200/50 transition-all"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-moonlight-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Main Image Display */}
              <div className="flex-1 flex flex-col p-3 sm:p-6 overflow-hidden">
                <div className="relative bg-black rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 flex-1 min-h-0 border-2 border-purple-400/50 shadow-lg shadow-purple-500/20">
                  <img
                    src={capturedImages[selectedImageIndex].dataUrl}
                    alt={`Captured image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Image Info Overlay */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 space-y-1 sm:space-y-2">
                    <div className="px-2 sm:px-3 py-1 bg-black/70 rounded-full border border-white/20">
                      <span className="text-white text-xs sm:text-sm font-mono">
                        {capturedImages[selectedImageIndex].timestamp.toLocaleString()}
                      </span>
                    </div>
                    {capturedImages[selectedImageIndex].filter && (
                      <div className="px-2 sm:px-3 py-1 bg-serelune-500/20 border border-serelune-400/30 rounded-full">
                        <span className="text-serelune-600 text-xs sm:text-sm font-medium">
                          {capturedImages[selectedImageIndex].filter}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation Arrows */}
                  {capturedImages.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedImageIndex(prev => 
                          prev > 0 ? prev - 1 : capturedImages.length - 1
                        )}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/50 rounded-full border border-white/20 text-white hover:bg-black/70 transition-all"
                      >
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedImageIndex(prev => 
                          prev < capturedImages.length - 1 ? prev + 1 : 0
                        )}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/50 rounded-full border border-white/20 text-white hover:bg-black/70 transition-all"
                      >
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 bg-black/50 rounded-full border border-white/20">
                    <span className="text-white text-xs sm:text-sm font-mono">
                      {selectedImageIndex + 1} / {capturedImages.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {capturedImages.length > 1 && (
                  <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 flex-shrink-0">
                    {capturedImages.map((image, index) => (
                      <motion.button
                        key={image.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 shadow-md",
                          selectedImageIndex === index 
                            ? "border-purple-400 shadow-lg shadow-purple-400/30" 
                            : "border-purple-300/50 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-300/20"
                        )}
                      >
                        <img
                          src={image.dataUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-purple-400/20"></div>
                        )}
                        {/* Filter indicator */}
                        {image.filter && (
                          <div className="absolute bottom-1 left-1 w-2 h-2 bg-purple-400 rounded-full border border-white/50"></div>
                        )}
                        {/* Time indicator */}
                        <div className="absolute bottom-0 right-0 px-1 bg-black/70 text-white text-xs">
                          {image.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3 sm:space-x-4 mt-4 sm:mt-6 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const selectedImage = capturedImages[selectedImageIndex];
                      const timestamp = selectedImage.timestamp.toISOString().replace(/[:.]/g, '-');
                      const filterSuffix = selectedImage.filter ? `-${selectedImage.filter.replace(/\s+/g, '-').toLowerCase()}` : '';
                      downloadImage(selectedImage.dataUrl, `blue-cam-${timestamp}${filterSuffix}.jpg`);
                    }}
                    className="p-3 sm:p-4 bg-blush-500/90 text-white rounded-xl shadow-blush hover:bg-blush-600 transition-all"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowGallery(false);
                      if (onPageChange) {
                        onPageChange('editor', capturedImages[selectedImageIndex].dataUrl);
                      }
                    }}
                    className="p-3 sm:p-4 bg-serelune-500/90 text-white rounded-xl shadow-glow hover:bg-serelune-600 transition-all"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCapturedImages(prev => prev.filter((_, index) => index !== selectedImageIndex));
                      setSelectedImageIndex(prev => Math.min(prev, capturedImages.length - 2));
                      if (capturedImages.length <= 1) {
                        setShowGallery(false);
                      }
                    }}
                    className="p-3 sm:p-4 bg-rose-500/90 text-white rounded-xl shadow-blush hover:bg-rose-600 transition-all"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photobooth Settings Modal */}
      <AnimatePresence>
        {showPhotoboothSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPhotoboothSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-moonlight-800 font-title text-xl font-bold mb-4">Photobooth Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-moonlight-700 text-sm font-medium mb-2">
                    Number of Photos (max 5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPhotoboothSettings(prev => ({ ...prev, photoCount: num }))}
                        className={cn(
                          "w-10 h-10 rounded-lg font-bold transition-all backdrop-blur-sm",
                          photoboothSettings.photoCount === num
                            ? "bg-serelune-500 text-white shadow-glow"
                            : "bg-white/20 text-moonlight-600 hover:bg-white/30 border border-white/30"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-moonlight-700 text-sm font-medium mb-2">
                    Timer Duration (seconds)
                  </label>
                  <div className="flex space-x-2">
                    {[3, 5, 7, 10].map((seconds) => (
                      <button
                        key={seconds}
                        onClick={() => setPhotoboothSettings(prev => ({ ...prev, timerSeconds: seconds }))}
                        className={cn(
                          "px-3 py-2 rounded-lg font-medium transition-all backdrop-blur-sm",
                          photoboothSettings.timerSeconds === seconds
                            ? "bg-serelune-500 text-white shadow-glow"
                            : "bg-white/20 text-moonlight-600 hover:bg-white/30 border border-white/30"
                        )}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPhotoboothSettings(false)}
                  className="flex-1 py-2 px-4 bg-white/20 backdrop-blur-sm text-moonlight-700 rounded-lg font-medium hover:bg-white/30 transition-all border border-white/30"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPhotoboothSettings(false);
                    startPhotobooth();
                  }}
                  className="flex-1 py-2 px-4 bg-serelune-500 text-white rounded-lg font-medium hover:bg-serelune-600 transition-all shadow-glow"
                >
                  Start Photobooth
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photobooth Result Modal */}
      <AnimatePresence>
        {showPhotoboothResult && photoboothImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPhotoboothResult(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-moonlight-800 font-title text-xl font-bold mb-4 text-center">Photobooth Strip Ready!</h3>
              
              <div className="mb-6 flex justify-center">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-400/50">
                  <div className="w-64 h-80 bg-white rounded-lg overflow-hidden relative border border-purple-300/40">
                    {photoboothImages.map((img, index) => (
                      <div key={index} className="w-full h-20 border-b border-purple-200/60 last:border-b-0">
                        <img 
                          src={img} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="absolute bottom-2 left-2 text-xs font-bold text-purple-600 bg-white/80 px-2 py-1 rounded">
                      SERELUNE
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={resetPhotobooth}
                  className="flex-1 py-2 px-4 bg-white/20 backdrop-blur-sm text-moonlight-700 rounded-lg font-medium hover:bg-white/30 transition-all border border-white/30"
                >
                  Reset
                </button>
                <button
                  onClick={downloadPhotobooth}
                  className="flex-1 py-2 px-4 bg-serelune-500 text-white rounded-lg font-medium hover:bg-serelune-600 transition-all shadow-glow"
                >
                  Download Strip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Gallery Modal */}
      <AnimatePresence>
        {showVideoGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-title text-xl font-bold">Video Gallery</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVideoGallery(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {recordedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No videos recorded yet</p>
                  <p className="text-gray-500 text-sm mt-2">Switch to video mode to start recording</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recordedVideos.map((video) => (
                    <div key={video.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                      <video
                        src={video.url}
                        controls
                        className="w-full h-48 object-cover"
                        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMkEyQTJBIi8+CjxwYXRoIGQ9Ik0xMzAgODBMMTgwIDEwMEwxMzAgMTIwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K"
                      />
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-sm font-medium">
                              {video.timestamp.toLocaleString()}
                            </p>
                            {video.filter && (
                              <p className="text-red-400 text-xs mt-1">
                                Filter: {video.filter}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const a = document.createElement('a');
                                a.href = video.url;
                                a.download = `serelune-video-${video.timestamp.getTime()}.webm`;
                                a.click();
                              }}
                              className="p-1 bg-white/20 rounded hover:bg-white/30 transition-all"
                              title="Download"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
