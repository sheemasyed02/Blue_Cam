// Video Filter Effects - Cinematic Video Filters
// Optimized for video recording with real-time performance

export interface VideoFilterEffect {
  name: string;
  id: string;
  cssFilter: string;
  description: string;
}

export const videoFilters: VideoFilterEffect[] = [
  {
    name: 'Natural',
    id: 'natural',
    cssFilter: 'none',
    description: 'No filter - natural video quality'
  },
  {
    name: 'Cinematic',
    id: 'cinematic',
    cssFilter: 'brightness(95%) contrast(115%) saturate(110%) sepia(5%)',
    description: 'Professional cinematic look with enhanced contrast'
  },
  {
    name: 'Vintage Film',
    id: 'vintage-film',
    cssFilter: 'brightness(105%) contrast(90%) saturate(85%) sepia(20%) blur(0.3px)',
    description: 'Classic vintage film aesthetic with soft grain'
  },
  {
    name: 'Golden Hour',
    id: 'golden-hour',
    cssFilter: 'brightness(110%) contrast(95%) saturate(120%) hue-rotate(15deg) sepia(15%)',
    description: 'Warm golden sunset lighting effect'
  },
  {
    name: 'Cool Tone',
    id: 'cool-tone',
    cssFilter: 'brightness(100%) contrast(105%) saturate(90%) hue-rotate(200deg) sepia(10%)',
    description: 'Cool blue-tinted professional look'
  },
  {
    name: 'Black & White',
    id: 'black-white',
    cssFilter: 'grayscale(100%) contrast(110%) brightness(105%)',
    description: 'Classic monochrome with enhanced contrast'
  },
  {
    name: 'Dreamy',
    id: 'dreamy',
    cssFilter: 'brightness(110%) contrast(80%) saturate(70%) blur(0.4px) sepia(15%)',
    description: 'Soft dreamy look with gentle blur'
  },
  {
    name: 'Neon',
    id: 'neon',
    cssFilter: 'brightness(120%) contrast(130%) saturate(150%) hue-rotate(280deg)',
    description: 'Vibrant neon colors for modern content'
  },
  {
    name: 'Film Noir',
    id: 'film-noir',
    cssFilter: 'brightness(85%) contrast(140%) saturate(0%) sepia(10%)',
    description: 'Dark dramatic black and white'
  },
  {
    name: 'Sunset',
    id: 'sunset',
    cssFilter: 'brightness(108%) contrast(100%) saturate(130%) hue-rotate(25deg) sepia(20%)',
    description: 'Warm sunset with orange-pink tones'
  },
  {
    name: 'Ocean',
    id: 'ocean',
    cssFilter: 'brightness(95%) contrast(110%) saturate(95%) hue-rotate(180deg) sepia(5%)',
    description: 'Cool ocean blue with teal undertones'
  },
  {
    name: 'Retro',
    id: 'retro',
    cssFilter: 'brightness(100%) contrast(85%) saturate(120%) hue-rotate(350deg) sepia(25%)',
    description: 'Retro 80s vibe with enhanced colors'
  }
];

// Utility function to apply video filters
export const applyVideoFilter = (videoElement: HTMLVideoElement, filter: VideoFilterEffect): void => {
  videoElement.style.filter = filter.cssFilter === 'none' ? '' : filter.cssFilter;
};

// Export default video filter list
export default videoFilters;