import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';

interface AdjustmentsPanelProps {
  selectedImage: string | null;
  onAdjustmentsApply: (adjustments: ImageAdjustments) => void;
  className?: string;
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  grain: number;
  temperature: number;
  fade: number;
  vignette: number;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  icon?: string;
}

const CustomSlider = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  unit = '%', 
  onChange, 
  icon 
}: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-serelune-500 text-sm">{icon}</span>}
          <label className="font-body text-serelune-700 font-medium text-sm">
            {label}
          </label>
        </div>
        <div className="font-body text-serelune-600/90 text-sm font-semibold">
          {value}{unit}
        </div>
      </div>

      {/* Custom Slider */}
      <div className="relative">
        {/* Track */}
        <div className="w-full h-2 bg-serelune-100/50 rounded-full overflow-hidden">
          {/* Progress */}
          <motion.div
            className="h-full bg-gradient-to-r from-serelune-300/80 to-serelune-500 rounded-full"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* Custom Thumb */}
        <motion.div
          className="absolute top-1/2 w-5 h-5 bg-serelune-500 border-2 border-white rounded-full shadow-glow cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Inner dot */}
          <div className="absolute inset-1 bg-white rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const AdjustmentsPanel = ({ 
  selectedImage, 
  onAdjustmentsApply, 
  className 
}: AdjustmentsPanelProps) => {
  // Default adjustment values
  const defaultAdjustments: ImageAdjustments = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grain: 0,
    temperature: 0,
    fade: 0,
    vignette: 0
  };

  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultAdjustments);

  // Apply adjustments whenever they change
  useEffect(() => {
    if (selectedImage) {
      onAdjustmentsApply(adjustments);
    }
  }, [adjustments, selectedImage, onAdjustmentsApply]);

  const updateAdjustment = useCallback((key: keyof ImageAdjustments, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetAdjustments = useCallback(() => {
    setAdjustments(defaultAdjustments);
  }, []);

  const hasChanges = Object.keys(adjustments).some(
    key => adjustments[key as keyof ImageAdjustments] !== defaultAdjustments[key as keyof ImageAdjustments]
  );

  if (!selectedImage) {
    return (
      <div className={cn("py-8", className)}>
        <div className="text-center text-serelune-500/60 font-body text-sm">
          Select an image to make adjustments
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
          Manual Adjustments
        </h3>
        
        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetAdjustments}
          disabled={!hasChanges}
          className={cn(
            "px-4 py-2 rounded-lg font-body text-sm font-medium transition-all",
            hasChanges
              ? "bg-blush-100/50 border-2 border-serelune-300 text-serelune-700 hover:bg-blush-100/70 shadow-soft"
              : "bg-serelune-50/30 border-2 border-serelune-200/50 text-serelune-400 cursor-not-allowed"
          )}
        >
          Reset
        </motion.button>
      </div>

      {/* Adjustment Sliders */}
      <div className="space-y-6">
        {/* Basic Adjustments */}
        <div className="space-y-4">
          <h4 className="font-body font-medium text-serelune-600/80 text-sm uppercase tracking-wide">
            Basic
          </h4>
          
          <CustomSlider
            label="Brightness"
            value={adjustments.brightness}
            min={50}
            max={200}
            unit="%"
            onChange={(value) => updateAdjustment('brightness', value)}
          />

          <CustomSlider
            label="Contrast"
            value={adjustments.contrast}
            min={50}
            max={200}
            unit="%"
            onChange={(value) => updateAdjustment('contrast', value)}
          />

          <CustomSlider
            label="Saturation"
            value={adjustments.saturation}
            min={0}
            max={200}
            unit="%"
            onChange={(value) => updateAdjustment('saturation', value)}
          />
        </div>

        {/* Advanced Effects */}
        <div className="space-y-4">
          <h4 className="font-body font-medium text-serelune-600/80 text-sm uppercase tracking-wide">
            Effects
          </h4>

          <CustomSlider
            label="Grain"
            value={adjustments.grain}
            min={0}
            max={100}
            unit="%"
            onChange={(value) => updateAdjustment('grain', value)}
          />

          <CustomSlider
            label="Temperature"
            value={adjustments.temperature}
            min={-100}
            max={100}
            unit=""
            onChange={(value) => updateAdjustment('temperature', value)}
          />

          <CustomSlider
            label="Fade"
            value={adjustments.fade}
            min={0}
            max={100}
            unit="%"
            onChange={(value) => updateAdjustment('fade', value)}
          />

          <CustomSlider
            label="Vignette"
            value={adjustments.vignette}
            min={0}
            max={100}
            unit="%"
            onChange={(value) => updateAdjustment('vignette', value)}
          />
        </div>
      </div>

      {/* Live Preview Indicator */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-serelune-100/30 border border-serelune-300/50 rounded-lg p-3"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-serelune-500 rounded-full"
            />
            <span className="font-body text-serelune-700/90 text-sm">
              Live preview active
            </span>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className="bg-moonlight-50/70 rounded-lg p-4 border border-serelune-200/50 shadow-soft">
        <h5 className="font-body font-medium text-serelune-700 text-sm mb-2">
          Pro Tips
        </h5>
        <ul className="text-xs text-serelune-600/80 space-y-1 font-body">
          <li>• Use Temperature to add warmth (+) or coolness (-)</li>
          <li>• Grain adds vintage film texture</li>
          <li>• Fade creates dreamy, washed-out effects</li>
          <li>• Vignette darkens edges for focus</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AdjustmentsPanel;
