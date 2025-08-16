import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';

interface FramesPanelProps {
  selectedImage: string | null;
  onFrameApply?: (frameId: string, frameData?: any) => void;
  activeFrame?: string;
}

interface PhotoboothImage {
  id: string;
  dataUrl: string;
  timestamp: Date;
}

export const FramesPanel = ({ selectedImage, onFrameApply, activeFrame }: FramesPanelProps) => {
  const [photoboothImages, setPhotoboothImages] = useState<PhotoboothImage[]>([]);
  const [isCapturingPhotobooth, setIsCapturingPhotobooth] = useState(false);

  // Enhanced frame styles with realistic effects
  const frameStyles = [
    {
      id: 'none',
      name: 'No Frame',
      description: 'Original image without frame',
      category: 'basic',
      style: {}
    },
    {
      id: 'classic',
      name: 'Classic White',
      description: 'Elegant white matted frame with depth',
      category: 'classic',
      style: {
        padding: '25px',
        background: '#ffffff',
        border: '8px solid #ffffff',
        boxShadow: 'inset 0 0 0 1px #e8e8e8, 0 4px 20px rgba(0,0,0,0.15)',
        borderRadius: '2px'
      }
    },
    {
      id: 'polaroid',
      name: 'Polaroid Instant',
      description: 'Authentic instant photo with signature look',
      category: 'vintage',
      style: {
        padding: '20px 20px 80px 20px',
        background: '#ffffff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        transform: 'rotate(-2deg)',
        borderRadius: '3px'
      }
    },
    {
      id: 'filmstrip',
      name: 'Film Strip 35mm',
      description: 'Professional film with realistic perforations',
      category: 'vintage',
      style: {
        padding: '25px 50px',
        background: '#1a1a1a',
        border: '3px solid #0d0d0d',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        borderRadius: '2px'
      }
    },
    {
      id: 'photobooth',
      name: 'Photo Booth Strip',
      description: 'Classic 4-photo booth strip with perforations',
      category: 'special',
      requiresMultiple: true,
      style: {
        border: '15px solid #ffffff',
        borderTop: '40px solid #ffffff',
        borderBottom: '40px solid #ffffff',
        boxShadow: 'inset 0 0 0 3px #000000, 0 8px 32px rgba(0,0,0,0.4)',
        background: '#ffffff'
      }
    },
    {
      id: 'aesthetic',
      name: 'Modern Minimal',
      description: 'Clean contemporary design with subtle accents',
      category: 'modern',
      style: {
        padding: '30px',
        background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.9)'
      }
    },
    {
      id: 'vintage',
      name: 'Vintage Wood',
      description: 'Rich wooden frame with ornate corner details',
      category: 'vintage',
      style: {
        padding: '35px',
        background: 'linear-gradient(45deg, #8B4513, #A0522D, #CD853F)',
        borderRadius: '12px',
        boxShadow: 'inset 0 0 0 3px #654321, 0 12px 40px rgba(0,0,0,0.4)',
        border: '3px solid #5d4037'
      }
    },
    {
      id: 'golden',
      name: 'Ornate Gold',
      description: 'Luxurious golden frame with decorative gems',
      category: 'classic',
      style: {
        padding: '30px',
        background: 'linear-gradient(45deg, #B8860B, #DAA520, #FFD700)',
        borderRadius: '15px',
        boxShadow: 'inset 0 0 0 2px #FFD700, 0 15px 50px rgba(0,0,0,0.3)',
        border: '4px solid #8B7355'
      }
    },
    {
      id: 'scrapbook',
      name: 'Scrapbook Memory',
      description: 'Decorative scrapbook with colorful stickers',
      category: 'decorative',
      style: {
        padding: '25px',
        background: 'linear-gradient(135deg, #faf0e6, #f5deb3, #ffe4b5)',
        borderRadius: '10px',
        boxShadow: 'inset 0 0 0 2px #d4af37, 0 10px 35px rgba(0,0,0,0.2)',
        border: '2px solid #cd853f'
      }
    }
  ];

  const handlePhotoboothCapture = useCallback(() => {
    setIsCapturingPhotobooth(true);
    
    // Create file input for photo upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    
    fileInput.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      
      if (files.length === 0) {
        setIsCapturingPhotobooth(false);
        return;
      }
      
      // Process up to 4 files
      const filesToProcess = files.slice(0, 4);
      const photos: PhotoboothImage[] = [];
      
      let processedCount = 0;
      
      filesToProcess.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            photos.push({
              id: `photo-${Date.now()}-${index}`,
              dataUrl: imageUrl,
              timestamp: new Date()
            });
            
            processedCount++;
            
            // Update the state with current photos
            setPhotoboothImages([...photos].sort((a, b) => a.id.localeCompare(b.id)));
            
            // If we've processed all files or have 4 photos, finish
            if (processedCount === filesToProcess.length || photos.length >= 4) {
              setIsCapturingPhotobooth(false);
              
              // Apply the photobooth frame with the captured images
              if (onFrameApply && photos.length > 0) {
                onFrameApply('photobooth', { images: photos });
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });
      
      // If no valid image files were selected
      if (filesToProcess.length === 0) {
        setIsCapturingPhotobooth(false);
      }
    };
    
    fileInput.click();
  }, [onFrameApply]);

  const addSinglePhoto = useCallback(() => {
    if (photoboothImages.length >= 4) return;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          const newPhoto: PhotoboothImage = {
            id: `photo-${Date.now()}-${photoboothImages.length}`,
            dataUrl: imageUrl,
            timestamp: new Date()
          };
          
          const updatedPhotos = [...photoboothImages, newPhoto];
          setPhotoboothImages(updatedPhotos);
          
          // Apply the photobooth frame with the updated images
          if (onFrameApply) {
            onFrameApply('photobooth', { images: updatedPhotos });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    fileInput.click();
  }, [photoboothImages, onFrameApply]);

  const removePhoto = useCallback((photoId: string) => {
    const updatedPhotos = photoboothImages.filter(photo => photo.id !== photoId);
    setPhotoboothImages(updatedPhotos);
    
    if (updatedPhotos.length > 0) {
      onFrameApply?.('photobooth', { images: updatedPhotos });
    } else {
      onFrameApply?.('none');
    }
  }, [photoboothImages, onFrameApply]);

  const applyFrame = useCallback((frameId: string) => {
    if (frameId === 'photobooth') {
      if (photoboothImages.length > 0) {
        onFrameApply?.(frameId, { images: photoboothImages });
      } else {
        // Start photobooth capture process
        handlePhotoboothCapture();
      }
    } else {
      onFrameApply?.(frameId);
    }
  }, [photoboothImages, onFrameApply, handlePhotoboothCapture]);

  const getFramePreview = (frame: any) => {
    if (frame.id === 'photobooth') {
      return (
        <div className="w-12 h-16 bg-white border border-gray-300 rounded-sm flex flex-col overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-300 last:border-b-0">
              {photoboothImages[i] && (
                <img 
                  src={photoboothImages[i].dataUrl} 
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div 
        className="w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 rounded-sm border border-serelune-200/50"
        style={frame.style}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-title font-semibold text-moonlight-800 text-lg">Photo Frames</h3>
        {isCapturingPhotobooth && (
          <div className="flex items-center space-x-2 text-blush-600">
            <div className="w-2 h-2 bg-blush-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Capturing...</span>
          </div>
        )}
      </div>

      {/* Scrollable Frame Selection */}
      <div className="space-y-4">
        {/* Basic Frames - Horizontal Scroll */}
        <div>
          <h4 className="text-sm font-medium text-moonlight-600 mb-3 border-b border-serelune-200/30 pb-1">
            Basic & Classic Frames
          </h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {frameStyles.filter(frame => ['basic', 'classic'].includes(frame.category)).map((frame) => (
              <motion.button
                key={frame.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyFrame(frame.id)}
                disabled={!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')}
                className={cn(
                  "flex-shrink-0 w-20 flex flex-col items-center space-y-2 p-3 rounded-lg transition-all",
                  activeFrame === frame.id 
                    ? "bg-serelune-500/20 border-2 border-serelune-400" 
                    : "bg-white/30 border-2 border-transparent hover:border-serelune-300",
                  (!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')) && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-serelune-200/50 bg-gradient-to-br from-moonlight-100 to-pearl-100 relative">
                  {getFramePreview(frame)}
                </div>
                <span className={cn(
                  "text-xs font-medium text-center w-full truncate",
                  activeFrame === frame.id ? "text-serelune-700" : "text-moonlight-600"
                )}>{frame.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Vintage Frames - Horizontal Scroll */}
        <div>
          <h4 className="text-sm font-medium text-moonlight-600 mb-3 border-b border-serelune-200/30 pb-1">
            Vintage & Retro Frames
          </h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {frameStyles.filter(frame => frame.category === 'vintage').map((frame) => (
              <motion.button
                key={frame.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyFrame(frame.id)}
                disabled={!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')}
                className={cn(
                  "flex-shrink-0 w-20 flex flex-col items-center space-y-2 p-3 rounded-lg transition-all",
                  activeFrame === frame.id 
                    ? "bg-serelune-500/20 border-2 border-serelune-400" 
                    : "bg-white/30 border-2 border-transparent hover:border-serelune-300",
                  (!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')) && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-serelune-200/50 bg-gradient-to-br from-moonlight-100 to-pearl-100 relative">
                  {getFramePreview(frame)}
                </div>
                <span className={cn(
                  "text-xs font-medium text-center w-full truncate",
                  activeFrame === frame.id ? "text-serelune-700" : "text-moonlight-600"
                )}>{frame.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Modern & Decorative Frames - Horizontal Scroll */}
        <div>
          <h4 className="text-sm font-medium text-moonlight-600 mb-3 border-b border-serelune-200/30 pb-1">
            Modern & Decorative Frames
          </h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {frameStyles.filter(frame => ['modern', 'decorative'].includes(frame.category)).map((frame) => (
              <motion.button
                key={frame.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyFrame(frame.id)}
                disabled={!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')}
                className={cn(
                  "flex-shrink-0 w-20 flex flex-col items-center space-y-2 p-3 rounded-lg transition-all",
                  activeFrame === frame.id 
                    ? "bg-serelune-500/20 border-2 border-serelune-400" 
                    : "bg-white/30 border-2 border-transparent hover:border-serelune-300",
                  (!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')) && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-serelune-200/50 bg-gradient-to-br from-moonlight-100 to-pearl-100 relative">
                  {getFramePreview(frame)}
                </div>
                <span className={cn(
                  "text-xs font-medium text-center w-full truncate",
                  activeFrame === frame.id ? "text-serelune-700" : "text-moonlight-600"
                )}>{frame.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Special Photobooth Section */}
      {frameStyles.find(f => f.id === 'photobooth') && (isCapturingPhotobooth || photoboothImages.length > 0 || activeFrame === 'photobooth') && (
        <div className="p-4 bg-white/80 rounded-lg border border-serelune-200/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-moonlight-700">Photo Booth Strip</span>
            <span className="text-xs text-serelune-600">{photoboothImages.length}/4 photos</span>
          </div>
          
          {photoboothImages.length === 0 && activeFrame === 'photobooth' && !isCapturingPhotobooth && (
            <div className="text-center p-6 border-2 border-dashed border-serelune-300 rounded-lg mb-3">
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm text-serelune-600 mb-3">
                Create a classic photo booth strip with 4 different photos
              </p>
              <button
                onClick={handlePhotoboothCapture}
                className="px-4 py-2 bg-serelune-500 text-white rounded font-medium
                         hover:bg-serelune-600 transition-colors"
              >
                Upload Photos
              </button>
            </div>
          )}
          
          {(photoboothImages.length > 0 || isCapturingPhotobooth) && (
            <>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-[3/4] rounded border-2 transition-all relative group",
                      photoboothImages[i] 
                        ? "border-serelune-400 bg-serelune-50" 
                        : "border-dashed border-gray-300 bg-gray-50 hover:border-serelune-300 hover:bg-serelune-50/30"
                    )}
                  >
                    {photoboothImages[i] ? (
                      <>
                        <img 
                          src={photoboothImages[i].dataUrl} 
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          onClick={() => removePhoto(photoboothImages[i].id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full 
                                   flex items-center justify-center text-xs hover:bg-rose-600 transition-colors
                                   opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={addSinglePhoto}
                        disabled={isCapturingPhotobooth}
                        className="w-full h-full flex flex-col items-center justify-center text-gray-400 
                                 hover:text-serelune-600 transition-colors disabled:opacity-50"
                      >
                        <div className="text-lg mb-1">+</div>
                        <div className="text-xs">Add Photo</div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePhotoboothCapture}
                  disabled={isCapturingPhotobooth || photoboothImages.length >= 4}
                  className="flex-1 px-3 py-2 bg-serelune-500 text-white rounded text-sm font-medium
                           hover:bg-serelune-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {photoboothImages.length === 0 ? 'Upload Photos' : 'Add More Photos'}
                </button>
                
                {photoboothImages.length > 0 && (
                  <button
                    onClick={() => {
                      setPhotoboothImages([]);
                      onFrameApply?.('none');
                    }}
                    className="px-3 py-2 bg-rose-500 text-white rounded text-sm font-medium
                             hover:bg-rose-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {photoboothImages.length > 0 && photoboothImages.length < 4 && (
                <p className="text-xs text-serelune-600 mt-2 text-center">
                  Add {4 - photoboothImages.length} more photo{4 - photoboothImages.length !== 1 ? 's' : ''} to complete the strip
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
