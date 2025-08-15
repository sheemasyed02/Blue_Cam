import { useState, useRef, useCallback } from 'react';
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

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      
      setTimeout(() => setIsCapturing(false), 400);
    }
  }, [webcamRef]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const savePhoto = useCallback(() => {
    if (capturedImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadImage(capturedImage, `blue-vintage-camera-${timestamp}.jpg`);
    }
  }, [capturedImage]);

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      // Sophisticated gradient background
      "bg-gradient-to-br from-cream via-cream/98 to-peach/15",
      // Professional texture overlay
      "before:absolute before:inset-0 before:opacity-[0.06] before:pointer-events-none before:z-10",
      "before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjMiIHJlc3VsdD0ibm9pc2UiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggaW49Im5vaXNlIiB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPg==')]",
      className
    )}>
      
      {/* Elegant Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-40 bg-gradient-to-r from-charcoal/85 via-charcoal/90 to-charcoal/85 backdrop-blur-xl text-cream shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Refined Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold via-gold/95 to-gold/85 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-cream" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2l2.5 4h4c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H6c-1.11 0-2-.89-2-2V8c0-1.11.89-2 2-2h2.5L9 2zm3 7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-lg"></div>
              </div>
              <div>
                <h1 className="text-2xl font-title font-bold tracking-[0.15em]">BLUE</h1>
                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent mt-1"></div>
              </div>
            </motion.div>

            {/* Navigation */}
            {onPageChange && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Navigation currentPage="camera" onPageChange={onPageChange} />
              </motion.div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"></div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Professional Camera Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 min-h-[85vh]">
            
            {/* Left Panel - Professional Controls */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="xl:col-span-1 space-y-6"
            >
              {/* Camera Status */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gold/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-gold rounded-full animate-pulse"></div>
                  <h3 className="font-title font-semibold text-charcoal">Status</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Mode</span>
                    <span className="text-gold font-medium">{facingMode === 'user' ? 'Portrait' : 'Landscape'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Quality</span>
                    <span className="text-gold font-medium">Professional</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Format</span>
                    <span className="text-gold font-medium">JPEG</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="space-y-4">
                {capturedImage ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(197, 162, 124, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={savePhoto}
                        className="w-full py-4 px-6 bg-gradient-to-r from-gold to-gold/90 text-cream rounded-xl font-medium text-lg shadow-xl transition-all duration-300 border border-gold/30"
                      >
                        Save Capture
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={retakePhoto}
                        className="w-full py-3 px-6 bg-white/80 text-charcoal rounded-xl font-medium backdrop-blur-sm hover:bg-white transition-all border border-gold/20"
                      >
                        New Capture
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(197, 162, 124, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={capture}
                    disabled={isCapturing}
                    className="w-full py-5 px-8 bg-gradient-to-br from-gold via-gold/95 to-gold/90 text-cream rounded-xl font-semibold text-xl shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 border border-gold/30 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-cream"
                        animate={isCapturing ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3, repeat: isCapturing ? Infinity : 0 }}
                      />
                      <span>{isCapturing ? 'CAPTURING...' : 'CAPTURE'}</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </motion.button>
                )}

                {/* Camera Switch */}
                {!capturedImage && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={switchCamera}
                    className="w-full py-3 px-6 bg-cream/80 backdrop-blur-sm text-charcoal rounded-xl font-medium transition-all border border-gold/20 hover:border-gold/40 hover:bg-cream/90"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </motion.svg>
                      <span>Switch Lens</span>
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Center - Premium Viewfinder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="xl:col-span-3 flex items-center justify-center"
            >
              {/* Professional Camera Housing */}
              <div className="relative w-full max-w-5xl">
                <div className="relative bg-gradient-to-br from-charcoal via-charcoal/98 to-charcoal/95 rounded-3xl p-8 shadow-2xl border border-gold/20">
                  
                  {/* Premium Frame Details */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-gold/60 rounded-full"></div>
                      ))}
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-gold/60 rounded-full"></div>
                      ))}
                    </div>
                  </div>

                  {/* Inner Professional Frame */}
                  <div className="relative bg-gradient-to-br from-cream/95 to-peach/10 rounded-2xl p-4 shadow-inner mt-6">
                    
                    {/* Viewfinder */}
                    <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-gold/40">
                      {capturedImage ? (
                        // Captured Image Display
                        <motion.div 
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="relative aspect-[16/9]"
                        >
                          <img 
                            src={capturedImage} 
                            alt="Captured" 
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Professional Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5"></div>
                          
                          {/* Quick Actions */}
                          <div className="absolute top-4 right-4">
                            <motion.button
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={savePhoto}
                              className="p-3 bg-gold/90 text-cream rounded-full backdrop-blur-sm shadow-xl border border-gold/50"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        // Live Preview
                        <div className="relative aspect-[16/9]">
                          <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="w-full h-full object-cover"
                            mirrored={facingMode === 'user'}
                          />
                          
                          {/* Professional Viewfinder Overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            {/* Corner Guides */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-gold/80 rounded-tl-lg"></div>
                            <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-gold/80 rounded-tr-lg"></div>
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-gold/80 rounded-bl-lg"></div>
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-gold/80 rounded-br-lg"></div>
                            
                            {/* Center Focus */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-16 h-px bg-gold/60"></div>
                              <div className="w-px h-16 bg-gold/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              <div className="w-6 h-6 border border-gold/60 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            </div>

                            {/* Rule of Thirds Grid */}
                            <div className="absolute inset-6 grid grid-cols-3 grid-rows-3 opacity-20">
                              {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-gold/30"></div>
                              ))}
                            </div>

                            {/* Mobile Camera Switch */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={switchCamera}
                              className="absolute top-4 right-4 p-3 bg-charcoal/80 text-cream rounded-lg backdrop-blur-sm border border-white/20 xl:hidden"
                            >
                              <motion.svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.3 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </motion.svg>
                            </motion.button>
                          </div>
                          
                          {/* Professional Capture Flash */}
                          {isCapturing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.9, 0] }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="absolute inset-0 bg-gradient-radial from-white via-gold/20 to-white rounded-xl"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Premium Camera Details */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-gradient-to-br from-gold via-gold/95 to-gold/85 rounded-full shadow-lg border border-gold/40 flex items-center justify-center">
                    <div className="w-4 h-4 bg-cream/80 rounded-full"></div>
                  </div>
                  
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-charcoal/90 rounded-full shadow-lg"></div>
                  
                  {/* Side Elements */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-20 bg-gradient-to-b from-gold/70 to-gold/50 rounded-full"></div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-20 bg-gradient-to-b from-gold/70 to-gold/50 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};
