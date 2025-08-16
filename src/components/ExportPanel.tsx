import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import { cn } from '../utils';

interface ExportPanelProps {
  selectedImage: string | null;
  processedImage: string | null;
  className?: string;
}

type ExportFormat = 'jpeg' | 'png' | 'jpg' | 'webp';

interface FormatOption {
  format: ExportFormat;
  label: string;
  extension: string;
  description: string;
  quality?: number;
}

const formatOptions: FormatOption[] = [
  {
    format: 'jpeg',
    label: 'JPEG',
    extension: '.jpeg',
    description: 'High quality, smaller file size',
    quality: 0.92
  },
  {
    format: 'jpg', 
    label: 'JPG',
    extension: '.jpg',
    description: 'Compatible format, compressed',
    quality: 0.92
  },
  {
    format: 'png',
    label: 'PNG',
    extension: '.png',
    description: 'Lossless quality, transparency support'
  },
  {
    format: 'webp',
    label: 'WebP',
    extension: '.webp',
    description: 'Modern format, best compression',
    quality: 0.90
  }
];

export const ExportPanel = ({ 
  selectedImage, 
  processedImage, 
  className 
}: ExportPanelProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [showPolaroidAnimation, setShowPolaroidAnimation] = useState(false);

  const convertImageToFormat = useCallback((
    imageUrl: string, 
    format: ExportFormat, 
    quality?: number
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              }
            },
            `image/${format}`,
            quality
          );
        }
      };
      
      img.src = imageUrl;
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (!processedImage && !selectedImage) return;

    const imageToExport = processedImage || selectedImage;
    if (!imageToExport) return;

    setIsExporting(true);
    setShowPolaroidAnimation(true);

    try {
      const selectedOption = formatOptions.find(opt => opt.format === selectedFormat);
      if (!selectedOption) return;

      // Convert image to selected format
      const blob = await convertImageToFormat(
        imageToExport, 
        selectedFormat, 
        selectedOption.quality
      );

      // Wait for Polaroid animation to complete
      setTimeout(() => {
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const filename = `blue-vintage-camera-${timestamp}${selectedOption.extension}`;
        
        // Save file using file-saver
        saveAs(blob, filename);
        
        setIsExporting(false);
        setShowPolaroidAnimation(false);
      }, 2000); // 2 second Polaroid animation
      
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setShowPolaroidAnimation(false);
    }
  }, [processedImage, selectedImage, selectedFormat, convertImageToFormat]);

  const hasImageToExport = processedImage || selectedImage;

  if (!hasImageToExport) {
    return (
      <div className={cn("py-8", className)}>
        <div className="text-center text-serelune-500/60 font-body text-sm">
          No image available for export
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("space-y-6", className)}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-title font-semibold text-serelune-700 text-lg">
          Export Photo
        </h3>
        <div className="text-xs text-serelune-500/70 font-body">
          {formatOptions.length} formats available
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-4">
        <h4 className="font-body font-medium text-serelune-600/80 text-sm uppercase tracking-wide">
          Choose Format
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {formatOptions.map((option) => (
            <motion.button
              key={option.format}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFormat(option.format)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                selectedFormat === option.format
                  ? "border-serelune-400 bg-serelune-100/40 shadow-soft"
                  : "border-serelune-200/50 hover:border-serelune-300 hover:bg-serelune-50/30"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-body font-medium text-serelune-700">
                    {option.label}
                  </div>
                  <div className="text-xs text-serelune-600/70 mt-1">
                    {option.description}
                  </div>
                </div>
                <div className="text-xs text-serelune-500/70 font-mono">
                  {option.extension}
                </div>
              </div>
              
              {/* Radio indicator */}
              <div className="flex items-center mt-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all",
                  selectedFormat === option.format
                    ? "border-serelune-500 bg-serelune-500"
                    : "border-serelune-300/70"
                )}>
                  {selectedFormat === option.format && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full m-0.5"
                    />
                  )}
                </div>
                <span className="ml-2 text-xs text-serelune-600/80 font-body">
                  {selectedFormat === option.format ? 'Selected' : 'Select'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <motion.button
        whileHover={{ 
          scale: 1.02,
          backgroundColor: 'rgba(168, 85, 247, 0.8)' 
        }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        disabled={isExporting || !hasImageToExport}
        className="w-full py-4 px-6 bg-serelune-500/70 text-white rounded-lg 
                 font-body font-medium text-lg transition-all duration-300
                 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed
                 border-2 border-serelune-400/50 hover:border-serelune-400"
      >
        {isExporting ? 'Exporting...' : `Download as ${selectedFormat.toUpperCase()}`}
      </motion.button>

      {/* Export Info */}
      <div className="bg-moonlight-50/70 rounded-lg p-4 border border-serelune-200/50 shadow-soft">
        <h5 className="font-body font-medium text-serelune-700 text-sm mb-2">
          Export Information
        </h5>
        <ul className="text-xs text-serelune-600/80 space-y-1 font-body">
          <li>• Files are saved with timestamp for organization</li>
          <li>• Original image quality is preserved</li>
          <li>• All applied filters and adjustments included</li>
          <li>• Compatible with all modern browsers</li>
        </ul>
      </div>

      {/* Polaroid Animation Overlay */}
      <AnimatePresence>
        {showPolaroidAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ 
                scale: [0, 1.1, 1],
                rotate: [-10, 5, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.6, 1],
                ease: "easeOut"
              }}
              className="bg-white p-4 rounded-lg shadow-2xl max-w-sm mx-4"
            >
              {/* Polaroid Frame */}
              <div className="bg-white p-3 shadow-lg">
                {/* Image Preview */}
                <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                  <motion.img
                    src={processedImage || selectedImage || ''}
                    alt="Export preview"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
                
                {/* Polaroid Text Area */}
                <div className="h-12 bg-white flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="font-title text-serelune-700 text-sm"
                  >
                    Have a good dayyy! ✨
                  </motion.div>
                </div>
              </div>
              
              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-center mt-4"
              >
                <div className="font-body font-medium text-serelune-700">
                  Exporting your photo...
                </div>
                <div className="text-xs text-serelune-600/70 mt-1">
                  Download will start shortly
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExportPanel;
