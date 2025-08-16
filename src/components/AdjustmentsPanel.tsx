import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

export interface ImageAdjustments {
  // Basic Adjustments
  brightness: number;
  contrast: number;
  exposure: number;
  saturation: number;
  vibrance: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  
  // Creative/Tone Adjustments
  fade: number;
  haze: number;
  glow: number;
  softness: number;
  sharpness: number;
  texture: number;
  detail: number;
  mist: number;
  toneCurveLights: number;
  toneCurveDarks: number;
  toneCurveMidtones: number;
  
  // Color Adjustments
  hue: number;
  luminance: number;
  colorSaturation: number;
  splitToningHighlights: number;
  splitToningShadows: number;
  splitToningMidtones: number;
  
  // Vintage/Atmosphere
  grain: number;
  vignette: number;
  tiltShiftBlur: number;
  radialBlur: number;
  linearBlur: number;
  filmDust: number;
  filterStrength: number;
  
  // Advanced
  lensDistortion: number;
  perspective: number;
  cropRotate: number;
  shadowsTint: number;
  highlightsTint: number;
}

interface AdjustmentsPanelProps {
  selectedImage: string | null;
  onAdjustmentsApply: (adjustments: ImageAdjustments) => void;
  className?: string;
}

interface AdjustmentItem {
  id: string;
  name: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

interface AdjustmentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  adjustments: AdjustmentItem[];
}

export const AdjustmentsPanel = ({ selectedImage, onAdjustmentsApply, className }: AdjustmentsPanelProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('basic');
  const [activeAdjustment, setActiveAdjustment] = useState<string | null>(null);
  
  // Default adjustment values
  const defaultAdjustments: ImageAdjustments = {
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
  };

  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultAdjustments);

  const adjustmentCategories: AdjustmentCategory[] = [
    {
      id: 'basic',
      name: 'Basic',
      icon: '⚙️',
      color: 'serelune',
      adjustments: [
        { id: 'brightness', name: 'Brightness', icon: '☀️', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'contrast', name: 'Contrast', icon: '⚫', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'exposure', name: 'Exposure', icon: '📷', min: -2, max: 2, step: 0.1, defaultValue: 0 },
        { id: 'saturation', name: 'Saturation', icon: '🎨', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'vibrance', name: 'Vibrance', icon: '🌈', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'temperature', name: 'Temperature', icon: '🌡️', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'tint', name: 'Tint', icon: '🔀', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'highlights', name: 'Highlights', icon: '✨', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'shadows', name: 'Shadows', icon: '🌑', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'whites', name: 'Whites', icon: '⚪', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'blacks', name: 'Blacks', icon: '⚫', min: -100, max: 100, step: 1, defaultValue: 0 }
      ]
    },
    {
      id: 'creative',
      name: 'Creative',
      icon: '🎭',
      color: 'blush',
      adjustments: [
        { id: 'fade', name: 'Fade', icon: '🌫️', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'haze', name: 'Haze/Dehaze', icon: '🌤️', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'glow', name: 'Glow/Bloom', icon: '✨', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'softness', name: 'Softness', icon: '💫', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'sharpness', name: 'Sharpness', icon: '🔪', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'texture', name: 'Texture', icon: '🧱', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'detail', name: 'Detail', icon: '🔍', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'mist', name: 'Mist/Fog', icon: '🌊', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'toneCurveLights', name: 'Tone Lights', icon: '💡', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'toneCurveDarks', name: 'Tone Darks', icon: '🌑', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'toneCurveMidtones', name: 'Tone Mids', icon: '🌓', min: -100, max: 100, step: 1, defaultValue: 0 }
      ]
    },
    {
      id: 'color',
      name: 'Color',
      icon: '🎨',
      color: 'lavender',
      adjustments: [
        { id: 'hue', name: 'Hue (HSL)', icon: '🌈', min: -180, max: 180, step: 1, defaultValue: 0, unit: '°' },
        { id: 'luminance', name: 'Luminance', icon: '💡', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'colorSaturation', name: 'Color Sat', icon: '🎨', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'splitToningHighlights', name: 'Highlights Tint', icon: '🔆', min: 0, max: 360, step: 1, defaultValue: 0, unit: '°' },
        { id: 'splitToningShadows', name: 'Shadows Tint', icon: '🌑', min: 0, max: 360, step: 1, defaultValue: 0, unit: '°' },
        { id: 'splitToningMidtones', name: 'Midtones Tint', icon: '🌓', min: 0, max: 360, step: 1, defaultValue: 0, unit: '°' }
      ]
    },
    {
      id: 'vintage',
      name: 'Vintage',
      icon: '📸',
      color: 'sunset',
      adjustments: [
        { id: 'grain', name: 'Grain', icon: '⚪', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'vignette', name: 'Vignette', icon: '⭕', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'tiltShiftBlur', name: 'Tilt Shift', icon: '📐', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'radialBlur', name: 'Radial Blur', icon: '🔄', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'linearBlur', name: 'Linear Blur', icon: '📏', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'filmDust', name: 'Film Dust', icon: '✨', min: 0, max: 100, step: 1, defaultValue: 0 },
        { id: 'filterStrength', name: 'Filter Power', icon: '⚡', min: 0, max: 100, step: 1, defaultValue: 0 }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: '🔧',
      color: 'emerald',
      adjustments: [
        { id: 'lensDistortion', name: 'Lens Distort', icon: '🔍', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'perspective', name: 'Perspective', icon: '📐', min: -100, max: 100, step: 1, defaultValue: 0 },
        { id: 'cropRotate', name: 'Rotate', icon: '🔄', min: -180, max: 180, step: 1, defaultValue: 0, unit: '°' },
        { id: 'shadowsTint', name: 'Shadows Tint', icon: '🌑', min: 0, max: 360, step: 1, defaultValue: 0, unit: '°' },
        { id: 'highlightsTint', name: 'Highlights Tint', icon: '✨', min: 0, max: 360, step: 1, defaultValue: 0, unit: '°' }
      ]
    }
  ];

  const handleAdjustmentChange = useCallback((adjustmentId: string, value: number) => {
    const newAdjustments = { ...adjustments, [adjustmentId]: value };
    setAdjustments(newAdjustments);
    onAdjustmentsApply(newAdjustments);
  }, [adjustments, onAdjustmentsApply]);

  const toggleAdjustmentControl = useCallback((adjustmentId: string) => {
    setActiveAdjustment(prev => prev === adjustmentId ? null : adjustmentId);
  }, []);

  const resetAdjustment = useCallback((adjustmentId: string) => {
    const category = adjustmentCategories.find(cat => 
      cat.adjustments.some(adj => adj.id === adjustmentId)
    );
    const adjustment = category?.adjustments.find(adj => adj.id === adjustmentId);
    
    if (adjustment) {
      handleAdjustmentChange(adjustmentId, adjustment.defaultValue);
    }
  }, [adjustmentCategories, handleAdjustmentChange]);

  const resetAllAdjustments = useCallback(() => {
    setAdjustments(defaultAdjustments);
    onAdjustmentsApply(defaultAdjustments);
    setActiveAdjustment(null);
  }, [defaultAdjustments, onAdjustmentsApply]);

  const activeAdjustments = adjustmentCategories.find(cat => cat.id === activeCategory)?.adjustments || [];
  const currentCategory = adjustmentCategories.find(cat => cat.id === activeCategory);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-title font-semibold text-moonlight-800 text-lg">Image Adjustments</h3>
      </div>

      {!selectedImage && (
        <div className="text-center p-8 border-2 border-dashed border-serelune-300 rounded-lg">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-serelune-600 text-sm">
            Select an image to start making adjustments
          </p>
        </div>
      )}

      {selectedImage && (
        <>
          {/* Category Tabs - 5 Columns */}
          <div className="grid grid-cols-5 gap-3">
            {adjustmentCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveAdjustment(null);
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all text-center min-h-[50px]",
                  activeCategory === category.id
                    ? "bg-serelune-500/20 border-2 border-serelune-400"
                    : "bg-white/10 border-2 border-transparent hover:border-serelune-300 backdrop-blur-sm"
                )}
              >
                <span className={cn(
                  "text-xs font-medium leading-tight",
                  activeCategory === category.id ? "text-serelune-700" : "text-moonlight-600"
                )}>
                  {category.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Controllers Section - Fixed position between categories and adjustments */}
          <AnimatePresence>
            {activeAdjustment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-lg p-4 shadow-2xl"
              >
                {(() => {
                  const adjustment = adjustmentCategories
                    .find(cat => cat.id === activeCategory)
                    ?.adjustments.find(adj => adj.id === activeAdjustment);
                  
                  if (!adjustment) return null;

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-serelune-700">{adjustment.name}</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-serelune-600">
                            {adjustments[adjustment.id as keyof ImageAdjustments]}{adjustment.unit || ''}
                          </span>
                          <button
                            onClick={() => resetAdjustment(adjustment.id)}
                            className="text-xs text-rose-500 hover:text-rose-600 px-2 py-1 rounded"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setActiveAdjustment(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      
                      {/* Custom Slider */}
                      <div className="relative">
                        <div className="w-full h-2 bg-serelune-100/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-serelune-300/80 to-serelune-500 rounded-full"
                            style={{ 
                              width: `${((adjustments[adjustment.id as keyof ImageAdjustments] as number - adjustment.min) / (adjustment.max - adjustment.min)) * 100}%` 
                            }}
                            animate={{ 
                              width: `${((adjustments[adjustment.id as keyof ImageAdjustments] as number - adjustment.min) / (adjustment.max - adjustment.min)) * 100}%` 
                            }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          />
                        </div>

                        <input
                          type="range"
                          min={adjustment.min}
                          max={adjustment.max}
                          step={adjustment.step}
                          value={adjustments[adjustment.id as keyof ImageAdjustments] as number}
                          onChange={(e) => handleAdjustmentChange(adjustment.id, Number(e.target.value))}
                          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                        />

                        <motion.div
                          className="absolute top-1/2 w-4 h-4 bg-serelune-500 border-2 border-white rounded-full shadow-md cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
                          style={{ 
                            left: `${((adjustments[adjustment.id as keyof ImageAdjustments] as number - adjustment.min) / (adjustment.max - adjustment.min)) * 100}%` 
                          }}
                          animate={{ 
                            left: `${((adjustments[adjustment.id as keyof ImageAdjustments] as number - adjustment.min) / (adjustment.max - adjustment.min)) * 100}%` 
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="absolute inset-1 bg-white rounded-full" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Category Adjustments - Text Only */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-moonlight-600 border-b border-serelune-200/30 pb-1">
              {currentCategory?.name} Adjustments
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              {activeAdjustments.map((adjustment) => (
                <motion.button
                  key={adjustment.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleAdjustmentControl(adjustment.id)}
                  className={cn(
                    "p-4 rounded-lg transition-all text-center relative min-h-[70px] flex items-center justify-center",
                    activeAdjustment === adjustment.id
                      ? "bg-serelune-500/20 border-2 border-serelune-400"
                      : adjustments[adjustment.id as keyof ImageAdjustments] !== adjustment.defaultValue
                      ? "bg-blush-500/20 border-2 border-blush-400"
                      : "bg-white/10 border-2 border-transparent hover:border-serelune-300 backdrop-blur-sm"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium leading-tight text-center px-2",
                    activeAdjustment === adjustment.id
                      ? "text-serelune-700"
                      : adjustments[adjustment.id as keyof ImageAdjustments] !== adjustment.defaultValue
                      ? "text-blush-700"
                      : "text-moonlight-600"
                  )}>
                    {adjustment.name}
                  </span>
                  
                  {/* Value indicator */}
                  {adjustments[adjustment.id as keyof ImageAdjustments] !== adjustment.defaultValue && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blush-500 rounded-full"></div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reset All Button */}
          <div className="pt-4 border-t border-serelune-200/30">
            <button
              onClick={resetAllAdjustments}
              className="w-full px-4 py-2 bg-rose-500/90 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
            >
              Reset All Adjustments
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdjustmentsPanel;
