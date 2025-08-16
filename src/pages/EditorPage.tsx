import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, saveFramedImage, savePhotobooth } from '../utils';
import { Navigation, FiltersPanel, FramesPanel, FrameRenderer, AdjustmentsPanel, ExportPanel, type ImageAdjustments } from '../components';

interface EditorPageProps {
  className?: string;
  onPageChange?: (page: 'camera' | 'editor', imageData?: string) => void;
  initialImage?: string;
}

type TabType = 'presets' | 'adjustments' | 'frames' | 'export';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage, className }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Before Image (Left side - old image) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="w-full h-full object-cover"
          style={{ width: `${100 / (sliderPosition / 100)}%` }}
          draggable={false}
        />
      </div>
      
      {/* After Image (Right side - new image) */}
      <div 
        className="absolute top-0 right-0 h-full overflow-hidden"
        style={{ width: `${100 - sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="w-full h-full object-cover absolute right-0"
          style={{ width: `${100 / ((100 - sliderPosition) / 100)}%` }}
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 h-full w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-ew-resize flex items-center justify-center">
          <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
        Before
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
        After
      </div>
    </div>
  );
};

export const EditorPage = ({ className, onPageChange, initialImage }: EditorPageProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [currentFrame, setCurrentFrame] = useState<string>('');
  const [frameData, setFrameData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [currentAdjustments, setCurrentAdjustments] = useState<ImageAdjustments>({
    // Basic Adjustments
    brightness: 0,
    contrast: 0,
    exposure: 0,
    saturation: 0,
    vibrance: 0,
    temperature: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    
    // Creative/Tone Adjustments
    fade: 0,
    haze: 0,
    glow: 0,
    softness: 0,
    sharpness: 0,
    texture: 0,
    detail: 0,
    mist: 0,
    toneCurveLights: 0,
    toneCurveDarks: 0,
    toneCurveMidtones: 0,
    
    // Color Adjustments
    hue: 0,
    luminance: 0,
    colorSaturation: 0,
    splitToningHighlights: 0,
    splitToningShadows: 0,
    splitToningMidtones: 0,
    
    // Vintage/Atmosphere
    grain: 0,
    vignette: 0,
    tiltShiftBlur: 0,
    radialBlur: 0,
    linearBlur: 0,
    filmDust: 0,
    filterStrength: 0,
    
    // Advanced
    lensDistortion: 0,
    perspective: 0,
    cropRotate: 0,
    shadowsTint: 0,
    highlightsTint: 0
  });

  const tabs = [
    { id: 'presets' as const, label: 'Presets' },
    { id: 'adjustments' as const, label: 'Adjustments' },
    { id: 'frames' as const, label: 'Frames' },
    { id: 'export' as const, label: 'Export' }
  ];

  const handleChangeImage = useCallback(() => {
    // Trigger the file input directly
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          // Replace the old image with the new one
          setSelectedImage(imageUrl);
          setProcessedImage(imageUrl);
          // Reset adjustments and filters
          setCurrentAdjustments({
            // Basic Adjustments
            brightness: 0,
            contrast: 0,
            exposure: 0,
            saturation: 0,
            vibrance: 0,
            temperature: 0,
            tint: 0,
            highlights: 0,
            shadows: 0,
            whites: 0,
            blacks: 0,
            
            // Creative/Tone Adjustments
            fade: 0,
            haze: 0,
            glow: 0,
            softness: 0,
            sharpness: 0,
            texture: 0,
            detail: 0,
            mist: 0,
            toneCurveLights: 0,
            toneCurveDarks: 0,
            toneCurveMidtones: 0,
            
            // Color Adjustments
            hue: 0,
            luminance: 0,
            colorSaturation: 0,
            splitToningHighlights: 0,
            splitToningShadows: 0,
            splitToningMidtones: 0,
            
            // Vintage/Atmosphere
            grain: 0,
            vignette: 0,
            tiltShiftBlur: 0,
            radialBlur: 0,
            linearBlur: 0,
            filmDust: 0,
            filterStrength: 0,
            
            // Advanced
            lensDistortion: 0,
            perspective: 0,
            cropRotate: 0,
            shadowsTint: 0,
            highlightsTint: 0
          });
          setCurrentFilter('');
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setProcessedImage(imageUrl); // Initially same as original
        setCurrentFilter(''); // Reset filter
        setCurrentAdjustments({
          // Basic Adjustments
          brightness: 0,
          contrast: 0,
          exposure: 0,
          saturation: 0,
          vibrance: 0,
          temperature: 0,
          tint: 0,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0,
          
          // Creative/Tone Adjustments
          fade: 0,
          haze: 0,
          glow: 0,
          softness: 0,
          sharpness: 0,
          texture: 0,
          detail: 0,
          mist: 0,
          toneCurveLights: 0,
          toneCurveDarks: 0,
          toneCurveMidtones: 0,
          
          // Color Adjustments
          hue: 0,
          luminance: 0,
          colorSaturation: 0,
          splitToningHighlights: 0,
          splitToningShadows: 0,
          splitToningMidtones: 0,
          
          // Vintage/Atmosphere
          grain: 0,
          vignette: 0,
          tiltShiftBlur: 0,
          radialBlur: 0,
          linearBlur: 0,
          filmDust: 0,
          filterStrength: 0,
          
          // Advanced
          lensDistortion: 0,
          perspective: 0,
          cropRotate: 0,
          shadowsTint: 0,
          highlightsTint: 0
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  const applyFrame = useCallback((frameId: string, frameData?: any) => {
    if (!selectedImage) return;
    
    setCurrentFrame(frameId);
    setFrameData(frameData);
    
    // For simple frames, just update the current frame
    // For complex frames like photobooth, the FramesPanel handles the logic
    setProcessedImage(selectedImage);
  }, [selectedImage]);

  const handleSaveImage = useCallback(async () => {
    if (!selectedImage) return;
    
    setIsSaving(true);
    
    try {
      if (currentFrame === 'photobooth' && frameData?.images) {
        // Save photobooth strip
        await savePhotobooth(frameData.images, 'serelune-photobooth');
      } else if (frameRef.current) {
        // Save regular framed image
        const frameName = currentFrame === 'none' || !currentFrame ? 'original' : currentFrame;
        await saveFramedImage(frameRef.current, `serelune-${frameName}`);
      } else {
        // Fallback: save original image
        const link = document.createElement('a');
        link.href = selectedImage;
        link.download = `serelune-photo-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedImage, currentFrame, frameData]);

  const applyPreset = useCallback((filter: string) => {
    if (!selectedImage) return;
    
    // Create a canvas to apply the filter
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);
        const processedDataUrl = canvas.toDataURL('image/png');
        setProcessedImage(processedDataUrl);
      }
    };
    
    img.src = selectedImage;
  }, [selectedImage]);

  const handleAdjustmentsFromPanel = useCallback((adjustments: ImageAdjustments) => {
    setCurrentAdjustments(adjustments);
    if (!selectedImage) return;

    // Convert adjustments to CSS filter string with all effects
    const filterParts = [
      `brightness(${100 + adjustments.brightness}%)`, // Convert from -100/+100 to CSS format
      `contrast(${100 + adjustments.contrast}%)`,     // Convert from -100/+100 to CSS format
      `saturate(${100 + adjustments.saturation}%)`    // Convert from -100/+100 to CSS format
    ];

    // Add temperature effect (hue rotation)
    if (adjustments.temperature !== 0) {
      filterParts.push(`hue-rotate(${adjustments.temperature * 0.5}deg)`);
    }

    // Add sepia for warmth/fade effect
    if (adjustments.fade > 0) {
      filterParts.push(`sepia(${adjustments.fade}%)`);
    }

    const filterString = filterParts.join(' ');
    
    // Create a canvas to apply the filter with additional effects
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // Apply CSS filters
        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0);
        
        // Apply grain effect if needed
        if (adjustments.grain > 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const grain = (Math.random() - 0.5) * adjustments.grain * 2;
            data[i] = Math.max(0, Math.min(255, data[i] + grain));     // Red
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain)); // Green
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain)); // Blue
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        // Apply vignette effect if needed
        if (adjustments.vignette > 0) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
          
          const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
          gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
          gradient.addColorStop(0.7, `rgba(0, 0, 0, 0)`);
          gradient.addColorStop(1, `rgba(0, 0, 0, ${adjustments.vignette / 100})`);
          
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        const processedDataUrl = canvas.toDataURL('image/png');
        setProcessedImage(processedDataUrl);
      }
    };
    
    img.src = selectedImage;
    
    // Log current adjustments to ensure it's used in TypeScript
    console.log('Applied adjustments:', currentAdjustments);
  }, [selectedImage, currentAdjustments]);

  const handleFilterFromPanel = useCallback((filter: string) => {
    setCurrentFilter(filter);
    if (filter) {
      applyPreset(filter);
    } else {
      // Reset to original image
      setProcessedImage(selectedImage);
    }
  }, [selectedImage, applyPreset]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'presets':
        return (
          <div className="space-y-3">
            {/* Change Image Button */}
            {selectedImage && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangeImage}
                className="w-full py-3 bg-blush-100/50 border-2 border-serelune-300 text-serelune-700 rounded-lg 
                         font-body font-medium hover:bg-blush-100/70 transition-all shadow-soft mb-4"
              >
                Change Image
              </motion.button>
            )}
            
            {/* Filters Panel */}
            <FiltersPanel
              selectedImage={selectedImage}
              onFilterApply={handleFilterFromPanel}
              activeFilter={currentFilter}
            />
          </div>
        );

      case 'adjustments':
        return (
          <AdjustmentsPanel
            selectedImage={selectedImage}
            onAdjustmentsApply={handleAdjustmentsFromPanel}
          />
        );

      case 'frames':
        return (
          <FramesPanel
            selectedImage={selectedImage}
            onFrameApply={applyFrame}
            activeFrame={currentFrame}
          />
        );

      case 'export':
        return (
          <ExportPanel
            selectedImage={selectedImage}
            processedImage={processedImage}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-serelune-50 via-blush-50 to-lavender-100", className)}>
      {/* Dreamy Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20 bg-gradient-dreamy"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-serelune-300/30 to-blush-300/30 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-tr from-lavender-300/20 to-serelune-400/20 rounded-full blur-3xl animate-float"></div>
      </div>
      
      {/* Header */}
      <header className={cn(
        "relative z-20 bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-xl",
        // Mobile: Smaller padding
        "p-3 lg:p-6"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
                {/* <span className="text-serelune-600 truncate">
                  Photo Editor
                </span> */}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {onPageChange && (
              <Navigation currentPage="editor" onPageChange={onPageChange} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced Mobile Layout */}
      <div className="relative z-10 max-w-7xl mx-auto p-3 md:p-4 lg:p-6">
        <div className={cn(
          "flex gap-4 lg:gap-6",
          // Mobile: Stack vertically, Desktop: Side by side
          "flex-col lg:flex-row"
        )}>
          
          {/* Left Column - Tabs and Controls */}
          <div className={cn(
            // Mobile: Full width, Desktop: Fixed width
            "w-full lg:w-80",
            // Mobile: Order after image preview, Desktop: Normal order
            "order-2 lg:order-1"
          )}>
            {/* Vertical Tabs - Mobile Horizontal */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-lg p-1 mb-4 lg:mb-6 border border-white/20 shadow-2xl">
              <div className={cn(
                "flex gap-1",
                // Mobile: Horizontal scroll, Desktop: Vertical stack
                "overflow-x-auto lg:flex-col lg:overflow-x-visible"
              )}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "py-3 px-4 rounded-md font-body font-medium transition-all text-moonlight-700",
                      // Mobile: Prevent shrinking, Desktop: Full width
                      "flex-shrink-0 lg:flex-shrink lg:w-full",
                      // Mobile: Smaller padding
                      "py-2 px-3 lg:py-3 lg:px-4",
                      activeTab === tab.id
                        ? "bg-serelune-500 text-white border-2 border-serelune-400 shadow-glow"
                        : "hover:bg-serelune-100/50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-2xl rounded-lg p-6 border border-white/20 shadow-2xl"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Preview - Mobile First */}
          <div className={cn(
            "flex-1",
            // Mobile: First position, Desktop: Second position  
            "order-1 lg:order-2"
          )}>
            <div className={cn(
              "bg-white/10 backdrop-blur-2xl rounded-lg shadow-2xl overflow-hidden relative border border-white/20",
              // Mobile: Smaller border radius
              "rounded-lg lg:rounded-xl"
            )}>
              {selectedImage ? (
                <div className={cn(
                  "relative flex items-center justify-center",
                  // Shorter image display area - reduced height
                  "h-[300px] lg:h-[400px]",
                  // Larger display when frame is active
                  currentFrame && currentFrame !== 'none' ? "lg:h-[500px]" : ""
                )}>
                  {processedImage && selectedImage !== processedImage ? (
                    <div className="w-full h-full">
                      <BeforeAfterSlider 
                        beforeImage={selectedImage}
                        afterImage={processedImage}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4" ref={frameRef}>
                      {currentFrame && currentFrame !== 'none' ? (
                        currentFrame === 'photobooth' ? (
                          frameData?.images && frameData.images.length > 0 ? (
                            <div className="w-full max-w-sm mx-auto">
                              <FrameRenderer 
                                frameId={currentFrame}
                                image={selectedImage}
                                frameData={frameData}
                                className="w-full"
                              />
                            </div>
                          ) : (
                            <div className="text-center p-6">
                              <div className="text-4xl mb-3">📸</div>
                              <h3 className="font-title text-lg text-serelune-700 mb-2">
                                Photo Booth Strip
                              </h3>
                              <p className="font-body text-serelune-600/80 mb-3 text-sm">
                                Upload up to 4 photos to create your photo booth strip
                              </p>
                              <p className="font-body text-xs text-serelune-500/70">
                                Use the Frames panel to add photos
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="max-w-full max-h-full flex items-center justify-center">
                            <FrameRenderer 
                              frameId={currentFrame}
                              image={selectedImage}
                              frameData={frameData}
                              className="max-w-[85%] max-h-[85%] w-auto h-auto"
                            />
                          </div>
                        )
                      ) : (
                        <img 
                          src={selectedImage} 
                          alt="Selected" 
                          className="max-w-[90%] max-h-[90%] object-contain"
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Save Button */}
                  {selectedImage && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveImage}
                      disabled={isSaving}
                      className={cn(
                        "absolute top-4 left-4 px-4 py-2 rounded-lg font-body font-medium transition-all shadow-lg",
                        "text-white backdrop-blur-sm",
                        isSaving 
                          ? "bg-gray-500 cursor-not-allowed" 
                          : "bg-serelune-500 hover:bg-serelune-600"
                      )}
                    >
                      {isSaving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Save Image</span>
                        </div>
                      )}
                    </motion.button>
                  )}

                  {/* Change Image Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleChangeImage}
                    className="absolute top-4 right-4 px-3 py-2 bg-charcoal/80 text-cream 
                             rounded-lg hover:bg-charcoal transition-all backdrop-blur-sm
                             font-body text-sm shadow-lg hover:shadow-xl"
                  >
                    Change Image
                  </motion.button>
                </div>
              ) : (
                <div 
                  {...getRootProps()}
                  className={cn(
                    // Shorter upload area
                    "h-[300px] flex items-center justify-center border-2 border-dashed",
                    "cursor-pointer transition-colors p-6",
                    isDragActive 
                      ? "border-serelune-400 bg-serelune-50/50" 
                      : "border-serelune-200 hover:border-serelune-400 hover:bg-serelune-50/30"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <div className="text-5xl mb-3">📸</div>
                    <h3 className="font-title text-lg text-serelune-700 mb-2">
                      {isDragActive ? 'Drop your photo here' : 'Upload a photo to edit'}
                    </h3>
                    <p className="font-body text-serelune-600/80 text-sm">
                      Drag and drop an image file, or click to browse
                    </p>
                    <p className="font-body text-xs text-serelune-500/70 mt-2">
                      Supports: PNG, JPG, JPEG, GIF, WebP
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Info */}
            {selectedImage && (
              <div className="mt-3 bg-white/70 backdrop-blur-sm rounded-lg p-3">
                <h4 className="font-title font-medium text-charcoal mb-2 text-sm">Image Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-body text-charcoal/70">
                  <div>Status: {processedImage !== selectedImage ? 'Edited' : 'Original'}</div>
                  <div>Format: {selectedImage.startsWith('data:image/png') ? 'PNG' : 'JPEG'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
