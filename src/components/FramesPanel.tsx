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
      description: 'Traditional white photo frame',
      category: 'classic',
      style: {
        border: '20px solid #ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.1)',
        background: '#ffffff'
      }
    },
    {
      id: 'polaroid',
      name: 'Polaroid Instant',
      description: 'Authentic instant camera look',
      category: 'vintage',
      style: {
        border: '20px solid #ffffff',
        borderBottom: '80px solid #ffffff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        transform: 'rotate(-1.5deg)',
        background: '#ffffff',
        position: 'relative' as const
      }
    },
    {
      id: 'filmstrip',
      name: 'Film Strip 35mm',
      description: 'Professional film with perforations',
      category: 'vintage',
      style: {
        border: '20px solid #1a1a1a',
        borderLeft: '50px solid #1a1a1a',
        borderRight: '50px solid #1a1a1a',
        boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
        background: '#1a1a1a',
        position: 'relative' as const
      }
    },
    {
      id: 'photobooth',
      name: 'Photo Booth Strip',
      description: 'Classic 4-photo booth strip',
      category: 'special',
      requiresMultiple: true,
      style: {
        border: '15px solid #ffffff',
        borderTop: '40px solid #ffffff',
        borderBottom: '40px solid #ffffff',
        boxShadow: 'inset 0 0 0 3px #000000, 0 8px 30px rgba(0,0,0,0.3)',
        background: '#ffffff',
        position: 'relative' as const
      }
    },
    {
      id: 'aesthetic',
      name: 'Aesthetic Minimal',
      description: 'Clean Pinterest-style frame',
      category: 'modern',
      style: {
        border: '30px solid #f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        background: '#f8f9fa'
      }
    },
    {
      id: 'vintage',
      name: 'Vintage Wood',
      description: 'Aged wooden frame effect',
      category: 'vintage',
      style: {
        border: '25px solid #8B4513',
        borderRadius: '4px',
        boxShadow: 'inset 0 0 0 2px #654321, 0 8px 25px rgba(0,0,0,0.3)',
        background: 'linear-gradient(45deg, #8B4513, #A0522D)',
        position: 'relative' as const
      }
    },
    {
      id: 'golden',
      name: 'Ornate Gold',
      description: 'Luxurious golden frame',
      category: 'classic',
      style: {
        border: '30px solid #DAA520',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 0 3px #FFD700, inset 0 0 0 6px #B8860B, 0 10px 35px rgba(0,0,0,0.25)',
        background: 'linear-gradient(45deg, #DAA520, #FFD700, #DAA520)',
        position: 'relative' as const
      }
    },
    {
      id: 'scrapbook',
      name: 'Scrapbook Memory',
      description: 'Decorative scrapbook style',
      category: 'decorative',
      style: {
        border: '25px solid #faf0e6',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 0 4px #d4af37, 0 8px 30px rgba(0,0,0,0.2)',
        background: 'linear-gradient(135deg, #faf0e6, #f5deb3)',
        position: 'relative' as const
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
        className="w-12 h-12 bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 rounded-sm"
        style={frame.style}
      />
    );
  };

  const categories = ['basic', 'classic', 'vintage', 'modern', 'special', 'decorative'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-title font-semibold text-moonlight-800 text-lg">Photo Frames</h3>
        {isCapturingPhotobooth && (
          <div className="flex items-center space-x-2 text-blush-600">
            <div className="w-2 h-2 bg-blush-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Capturing...</span>
          </div>
        )}
      </div>

      {/* Photobooth Progress */}
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

      {/* Frame Categories */}
      {categories.map(category => {
        const categoryFrames = frameStyles.filter(frame => frame.category === category);
        if (categoryFrames.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-moonlight-600 capitalize border-b border-serelune-200/30 pb-1">
              {category === 'basic' ? 'Basic' : 
               category === 'classic' ? 'Classic' :
               category === 'vintage' ? 'Vintage' :
               category === 'modern' ? 'Modern' :
               category === 'special' ? 'Special Effects' :
               'Decorative'} Frames
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {categoryFrames.map((frame) => (
                <motion.button
                  key={frame.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyFrame(frame.id)}
                  disabled={!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')}
                  className={cn(
                    "p-4 bg-white rounded-lg border-2 transition-all text-left shadow-soft hover:shadow-glow",
                    activeFrame === frame.id 
                      ? "border-serelune-400 bg-serelune-50" 
                      : "border-transparent hover:border-serelune-400",
                    (!selectedImage || (isCapturingPhotobooth && frame.id !== 'photobooth')) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {/* Frame Preview */}
                    <div className="flex-shrink-0">
                      {getFramePreview(frame)}
                    </div>
                    
                    {/* Frame Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-medium text-serelune-700">{frame.name}</div>
                      <div className="text-xs text-serelune-500/70 mt-1">{frame.description}</div>
                      {frame.requiresMultiple && (
                        <div className="text-xs text-blush-600 mt-1 font-medium">
                          Requires 4 photos
                        </div>
                      )}
                    </div>
                    
                    {/* Active Indicator */}
                    {activeFrame === frame.id && (
                      <div className="flex-shrink-0 w-2 h-2 bg-serelune-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
