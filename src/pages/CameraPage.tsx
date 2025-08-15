import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
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
      
      // Reset capture animation after a short delay
      setTimeout(() => setIsCapturing(false), 200);
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
      "min-h-screen bg-cream relative overflow-hidden",
      // Subtle grain texture using CSS
      "before:absolute before:inset-0 before:opacity-[0.03] before:pointer-events-none",
      "before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogICAgICA8ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgcmVzdWx0PSJub2lzZSIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ibm9pc2UiIHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjQiLz4KICA8L3N2Zz4K')]",
      className
    )}>
      {/* Header */}
      <header className="relative z-10 bg-charcoal/95 backdrop-blur-sm text-cream p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-title font-bold">
              Blue Vintage Camera
            </h1>
            {onPageChange && (
              <Navigation currentPage="camera" onPageChange={onPageChange} />
            )}
          </div>
          <p className="text-center mt-1 font-body text-peach text-sm md:text-base">
            {capturedImage ? 'Photo captured! Apply filters or retake' : 'Point and capture your moment'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* Camera/Preview Section */}
            <div className="flex-1">
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                {capturedImage ? (
                  // Captured Image Preview
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Quick Save Button Overlay */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={savePhoto}
                      className="absolute top-4 right-4 p-3 bg-gold/90 text-cream rounded-full 
                               hover:bg-gold transition-all backdrop-blur-sm shadow-lg
                               hover:shadow-xl"
                      aria-label="Save photo"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </motion.button>
                  </div>
                ) : (
                  // Live Webcam Preview
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-auto"
                      mirrored={facingMode === 'user'}
                    />
                    {/* Overlay for capture effect */}
                    {isCapturing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-white"
                      />
                    )}
                    
                    {/* Camera Switch Button - Mobile Only */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={switchCamera}
                      className="absolute top-4 right-4 p-3 bg-charcoal/80 text-cream rounded-full 
                               hover:bg-charcoal transition-colors backdrop-blur-sm
                               md:hidden" // Only show on mobile
                      aria-label="Switch camera"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Section */}
            <div className="lg:w-80">
              <div className="space-y-4">
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  {capturedImage ? (
                    <>
                      {/* Save Photo Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#e4c3a1' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={savePhoto}
                        className="w-full py-4 px-6 bg-gold text-cream rounded-xl font-body font-medium
                                 transition-all duration-200 shadow-lg hover:shadow-xl
                                 text-lg md:text-xl"
                      >
                          Save Photo
                      </motion.button>
                      
                      {/* Retake Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={retakePhoto}
                        className="w-full py-3 px-6 bg-charcoal text-cream rounded-xl font-body font-medium
                                 transition-all duration-200 hover:bg-charcoal/80 shadow-md"
                      >
                       Retake Photo
                      </motion.button>
                    </>
                  ) : (
                    // Capture Button
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#e4c3a1' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={capture}
                      disabled={isCapturing}
                      className="w-full py-4 px-6 bg-gold text-cream rounded-xl font-body font-medium
                               transition-all duration-200 shadow-lg hover:shadow-xl
                               disabled:opacity-50 disabled:cursor-not-allowed
                               text-lg md:text-xl"
                    >
                      {isCapturing ? 'Capturing...' : 'Capture Photo'}
                    </motion.button>
                  )}

                  {/* Desktop Camera Switch */}
                  {!capturedImage && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={switchCamera}
                      className="hidden md:flex w-full py-3 px-6 bg-charcoal text-cream rounded-xl 
                               font-body font-medium transition-all duration-200 
                               hover:bg-charcoal/80 shadow-md items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch Camera ({facingMode === 'user' ? 'Front' : 'Back'})
                    </motion.button>
                  )}
                </div>

                {/* Info Panel */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 md:p-5">
                  <h3 className="font-title font-semibold text-charcoal mb-2 text-lg">
                    Camera Tips
                  </h3>
                  <ul className="space-y-2 text-sm md:text-base font-body text-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>Ensure good lighting for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>Hold steady when capturing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>Try different angles for creative shots</span>
                    </li>
                    {capturedImage && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-0.5">•</span>
                          <span>Click 'Save Photo' to download to your device</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-0.5">•</span>
                          <span>Use the gold save button for quick download</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gold mt-0.5">•</span>
                          <span>Apply vintage filters to enhance your photo</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Current Settings */}
                <div className="bg-peach/20 rounded-xl p-4">
                  <h4 className="font-title font-medium text-charcoal mb-2">Settings</h4>
                  <div className="space-y-1 text-sm font-body text-charcoal/70">
                    <div>Camera: {facingMode === 'user' ? 'Front' : 'Back'}</div>
                    <div>Resolution: 1280×720</div>
                    <div>Format: JPEG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
