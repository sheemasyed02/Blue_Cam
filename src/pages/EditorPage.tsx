import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { downloadImage } from '../utils/imageUtils';
import { Navigation } from '../components';

interface EditorPageProps {
  className?: string;
  onPageChange?: (page: 'camera' | 'editor') => void;
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

export const EditorPage = ({ className, onPageChange }: EditorPageProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const tabs = [
    { id: 'presets' as const, label: 'Presets' },
    { id: 'adjustments' as const, label: 'Adjustments' },
    { id: 'frames' as const, label: 'Frames' },
    { id: 'export' as const, label: 'Export' }
  ];

  const presets = [
    { name: 'Vintage', filter: 'sepia(80%) brightness(110%) contrast(120%)' },
    { name: 'Blue Tone', filter: 'hue-rotate(200deg) saturate(120%)' },
    { name: 'Warm', filter: 'sepia(30%) saturate(120%) brightness(110%)' },
    { name: 'Cool', filter: 'hue-rotate(180deg) saturate(110%)' },
    { name: 'Black & White', filter: 'grayscale(100%) contrast(110%)' },
    { name: 'High Contrast', filter: 'contrast(150%) saturate(130%)' }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setProcessedImage(imageUrl); // Initially same as original
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

  const applyAdjustments = useCallback(() => {
    if (!selectedImage) return;
    
    const filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    applyPreset(filter);
  }, [selectedImage, brightness, contrast, saturation, applyPreset]);

  const handleExport = useCallback(() => {
    if (processedImage) {
      downloadImage(processedImage, 'blue-vintage-camera-edited.png');
    }
  }, [processedImage]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'presets':
        return (
          <div className="space-y-3">
            <h3 className="font-title font-semibold text-charcoal text-lg mb-4">Filter Presets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyPreset(preset.filter)}
                  disabled={!selectedImage}
                  className="p-4 bg-white rounded-lg border-2 border-transparent hover:border-gold
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all
                           text-left shadow-sm hover:shadow-md"
                >
                  <div className="font-body font-medium text-charcoal">{preset.name}</div>
                  <div className="text-xs text-charcoal/60 mt-1">Vintage style filter</div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'adjustments':
        return (
          <div className="space-y-6">
            <h3 className="font-title font-semibold text-charcoal text-lg mb-4">Manual Adjustments</h3>
            
            {/* Brightness */}
            <div className="space-y-2">
              <label className="font-body text-charcoal font-medium">Brightness: {brightness}%</label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-2 bg-cream rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <label className="font-body text-charcoal font-medium">Contrast: {contrast}%</label>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-2 bg-cream rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <label className="font-body text-charcoal font-medium">Saturation: {saturation}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full h-2 bg-cream rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={applyAdjustments}
              disabled={!selectedImage}
              className="w-full py-3 bg-gold text-cream rounded-lg font-body font-medium
                       hover:bg-gold/80 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              Apply Adjustments
            </motion.button>
          </div>
        );

      case 'frames':
        return (
          <div className="space-y-4">
            <h3 className="font-title font-semibold text-charcoal text-lg mb-4">Photo Frames</h3>
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedImage}
                className="p-4 bg-white rounded-lg border-2 border-transparent hover:border-gold
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all
                         text-left shadow-sm hover:shadow-md"
              >
                <div className="font-body font-medium text-charcoal">Classic Border</div>
                <div className="text-xs text-charcoal/60 mt-1">White vintage frame</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedImage}
                className="p-4 bg-white rounded-lg border-2 border-transparent hover:border-gold
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all
                         text-left shadow-sm hover:shadow-md"
              >
                <div className="font-body font-medium text-charcoal">Film Strip</div>
                <div className="text-xs text-charcoal/60 mt-1">Retro film edge effect</div>
              </motion.button>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-4">
            <h3 className="font-title font-semibold text-charcoal text-lg mb-4">Export Options</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg">
                <div className="font-body font-medium text-charcoal mb-2">Export Settings</div>
                <div className="text-sm text-charcoal/70 space-y-1">
                  <div>Format: PNG</div>
                  <div>Quality: High</div>
                  <div>Size: Original</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#e4c3a1' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={!processedImage}
                className="w-full py-4 bg-gold text-cream rounded-lg font-body font-medium text-lg
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all
                         shadow-lg hover:shadow-xl"
              >
                📥 Download Edited Photo
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen bg-cream", className)}>
      {/* Header */}
      <header className="bg-charcoal text-cream p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-title font-bold">
              Photo Editor
            </h1>
            {onPageChange && (
              <Navigation currentPage="editor" onPageChange={onPageChange} />
            )}
          </div>
          <p className="text-center mt-1 font-body text-peach text-sm md:text-base">
            Enhance your photos with vintage filters and adjustments
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Tabs and Controls */}
          <div className="lg:w-80 order-1 lg:order-none">
            {/* Vertical Tabs */}
            <div className="bg-gold rounded-lg p-1 mb-6">
              <div className="flex lg:flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 lg:w-full py-3 px-4 rounded-md font-body font-medium transition-all",
                      "text-cream",
                      activeTab === tab.id
                        ? "bg-white text-charcoal border-2 border-gold shadow-md"
                        : "hover:bg-gold/80"
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
                className="bg-white/70 backdrop-blur-sm rounded-lg p-6"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Preview */}
          <div className="flex-1 order-none lg:order-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {selectedImage ? (
                <div className="aspect-video relative">
                  {processedImage && selectedImage !== processedImage ? (
                    <BeforeAfterSlider 
                      beforeImage={selectedImage}
                      afterImage={processedImage}
                      className="w-full h-full"
                    />
                  ) : (
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <div 
                  {...getRootProps()}
                  className={cn(
                    "aspect-video flex items-center justify-center border-2 border-dashed",
                    "cursor-pointer transition-colors p-8",
                    isDragActive 
                      ? "border-gold bg-gold/10" 
                      : "border-gray-300 hover:border-gold hover:bg-gold/5"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="font-title text-xl text-charcoal mb-2">
                      {isDragActive ? 'Drop your photo here' : 'Upload a photo to edit'}
                    </h3>
                    <p className="font-body text-charcoal/70">
                      Drag and drop an image file, or click to browse
                    </p>
                    <p className="font-body text-sm text-charcoal/50 mt-2">
                      Supports: PNG, JPG, JPEG, GIF, WebP
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Info */}
            {selectedImage && (
              <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-title font-medium text-charcoal mb-2">Image Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-body text-charcoal/70">
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
