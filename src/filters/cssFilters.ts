// CSS Filter Effects - 18 Vintage Film Inspired Filters
// Each filter uses CSS filter properties for real image processing

export interface FilterEffect {
  name: string;
  id: string;
  cssFilter: string;
  description: string;
}

export const vintageFilters: FilterEffect[] = [
  {
    name: 'Blue Jeans',
    id: 'blue-jeans',
    cssFilter: 'brightness(95%) contrast(135%) saturate(0%) grayscale(100%) sepia(5%) blur(0.3px)',
    description: 'Cinematic black & white film noir - moody crushed blacks, soft vintage skin, dreamy faded contrast'
  },
  {
    name: 'Born to Die',
    id: 'born-to-die',
    cssFilter: 'brightness(100%) contrast(125%) saturate(95%) hue-rotate(340deg) sepia(10%) blur(0.4px)',
    description: 'Cinematic oil painting elegance - creamy skin, bold vintage red lips, muted pastel background with dreamy soft focus'
  },
  {
    name: 'West Coast',
    id: 'west-coast',
    cssFilter: 'brightness(95%) contrast(140%) saturate(0%) grayscale(100%) sepia(5%) blur(0.2px)',
    description: 'Cinematic B&W film noir - raw vintage 35mm film with crushed blacks, glowing highlights, and gritty texture'
  },
  {
    name: 'Young & Beautiful',
    id: 'young-beautiful',
    cssFilter: 'brightness(105%) contrast(110%) saturate(85%) hue-rotate(340deg) sepia(15%) blur(0.6px)',
    description: 'Old Hollywood film still - creamy candlelight glow, vintage matte red lips, faded soft focus like 1950s projection'
  },
  {
    name: 'Summertime Sadness',
    id: 'summertime-sadness',
    cssFilter: 'brightness(102%) contrast(85%) saturate(75%) hue-rotate(20deg) sepia(25%) blur(0.4px)',
    description: 'Dreamy 1970s film aesthetic - warm golden vintage mood, muted pastels, soft light leak glow with faded matte blacks'
  },
  {
    name: 'Honeymoon',
    id: 'honeymoon',
    cssFilter: 'brightness(105%) contrast(75%) saturate(80%) hue-rotate(10deg) sepia(15%) blur(0.6px)',
    description: 'VHS dreamy vintage postcard - soft pastel colors, washed-out film grain, faded daylight tape aesthetic'
  },
  {
    name: 'Love',
    id: 'love',
    cssFilter: 'brightness(115%) contrast(85%) saturate(85%) hue-rotate(340deg) sepia(25%) blur(0.5px)',
    description: 'Ethereal overexposed glow - warm golden pastels, creamy skin, dreamy faded film with lifted shadows and milky highlights'
  },
  {
    name: 'Cherry',
    id: 'cherry',
    cssFilter: 'brightness(100%) contrast(90%) saturate(0%) grayscale(100%) sepia(10%) blur(0.35px)',
    description: 'Vintage monochrome film - faded blacks, muted whites, soft glow with authentic 1960s black-and-white TV aesthetic'
  },
  {
    name: 'Venice Bitch',
    id: 'venice-bitch',
    cssFilter: 'brightness(102%) contrast(85%) saturate(90%) hue-rotate(25deg) sepia(25%) blur(0.5px)',
    description: 'Warm faded Super-8 film - golden sunset tones, lifted shadows, heavy grain with dreamy home-movie retro feel'
  },
  {
    name: 'Brooklyn Baby',
    id: 'brooklyn-baby',
    cssFilter: 'brightness(110%) contrast(135%) saturate(0%) grayscale(100%) sepia(5%) blur(0.2px)',
    description: 'Cinematic black & white film - glowing skin, sharp contrast, soft S-curve with vintage grain and dark edges'
  },
  {
    name: 'Shades of Cool',
    id: 'shades-of-cool',
    cssFilter: 'brightness(75%) contrast(125%) saturate(130%) hue-rotate(280deg) sepia(20%) blur(0.4px)',
    description: 'Dark neon VHS aesthetic - deep shadows, bright cyan/magenta tinting, chromatic aberration glow with dreamy haze'
  },
  {
    name: 'Ultraviolence',
    id: 'ultraviolence',
    cssFilter: 'brightness(130%) contrast(70%) saturate(80%) hue-rotate(15deg) sepia(30%) blur(0.5px)',
    description: 'Overexposed dreamy film fade - blown-out highlights, crushed shadows, matte vintage with warm haze and soft focus'
  },
  {
    name: 'Terrence Loves You',
    id: 'terrence-loves-you',
    cssFilter: 'brightness(97%) contrast(110%) saturate(95%) hue-rotate(45deg) sepia(15%) blur(0.35px)',
    description: 'Moody cinematic warmth - golden tone, lifted shadows, soft film grain with vintage jazz-lounge atmosphere'
  },
  {
    name: 'Mariners Apartment Complex',
    id: 'mariners-apartment-complex',
    cssFilter: 'brightness(100%) contrast(85%) saturate(0%) grayscale(100%) sepia(15%) blur(0.5px)',
    description: 'Film B&W vintage - faded shadows, soft contrast, washed-out 16mm grain with dreamy analog feel'
  },
  {
    name: 'Norman Rockwell',
    id: 'norman-rockwell',
    cssFilter: 'brightness(100%) contrast(80%) saturate(85%) hue-rotate(50deg) sepia(15%) blur(0.45px)',
    description: 'Flat vintage film - muted colors, lifted shadows, creamy warm tint with washed-out 16mm texture and soft grain'
  },
  {
    name: 'Salvatore',
    id: 'salvatore',
    cssFilter: 'brightness(105%) contrast(95%) saturate(90%) hue-rotate(330deg) sepia(20%) blur(0.5px)',
    description: 'Whimsical surreal pastel vintage Italy - candy-colored faded tones with dreamy gelato postcard vibe'
  },
  {
    name: 'Video Games',
    id: 'video-games',
    cssFilter: 'brightness(95%) contrast(90%) saturate(75%) hue-rotate(330deg) sepia(25%) blur(0.6px)',
    description: 'Nostalgic vintage home-video aesthetic - muted tones, dreamy faded glow with romantic VHS nostalgia'
  },
  {
    name: 'White Mustang',
    id: 'white-mustang',
    cssFilter: 'brightness(105%) contrast(70%) saturate(70%) hue-rotate(320deg) sepia(20%) blur(0.6px)',
    description: 'Pastel film softness - heavily faded blacks, muted greens, pinkish highlights with milky dreamy grain'
  },
  {
    name: 'High by the Beach',
    id: 'high-by-the-beach',
    cssFilter: 'brightness(105%) contrast(85%) saturate(90%) hue-rotate(280deg) sepia(15%) blur(0.4px)',
    description: 'Dreamy pastel retro - cool blue/magenta tint, lifted blacks, soft hazy clarity with enhanced purples and blues'
  },
  {
    name: 'National Anthem',
    id: 'national-anthem',
    cssFilter: 'brightness(105%) contrast(70%) saturate(90%) hue-rotate(320deg) sepia(25%) blur(0.7px)',
    description: 'Dreamy Super 8 film reel - overexposed glow, faded blacks, warm magenta tint with heavy vintage grain and soft blur'
  },
  {
    name: 'Art Deco',
    id: 'art-deco',
    cssFilter: 'brightness(102%) contrast(110%) saturate(110%) hue-rotate(30deg) sepia(10%) blur(0.3px)',
    description: 'Cinematic pastel elegance - creamy skin tones, soft peach-pink highlights, vibrant florals with dreamy romantic glow'
  },
  {
    name: 'Motel 6 Acoustic',
    id: 'motel-6-acoustic',
    cssFilter: 'brightness(103%) contrast(70%) saturate(90%) hue-rotate(45deg) sepia(30%) blur(0.8px)',
    description: 'Vintage golden film wash - strong warm yellow shift, faded blacks, heavy haze with Super 8 VHS grain effect'
  }
];

// Advanced CSS filter combinations for more complex effects
export const advancedFilters: FilterEffect[] = [
  {
    name: 'Blue Jeans (Advanced)',
    id: 'blue-jeans-advanced',
    cssFilter: 'brightness(92%) contrast(140%) saturate(0%) grayscale(100%) sepia(8%) blur(0.4px)',
    description: 'Ultra-cinematic black & white film noir with enhanced grain and deeper crushed blacks'
  },
  {
    name: 'West Coast (Advanced)',
    id: 'west-coast-advanced',
    cssFilter: 'brightness(92%) contrast(145%) saturate(0%) grayscale(100%) sepia(8%) blur(0.25px)',
    description: 'Ultra-cinematic B&W film noir with enhanced grain and deeper crushed blacks for raw vintage feel'
  },
  {
    name: 'Born to Die (Advanced)',
    id: 'born-to-die-advanced',
    cssFilter: 'brightness(98%) contrast(130%) saturate(100%) hue-rotate(335deg) sepia(15%) blur(0.5px)',
    description: 'Ultra-cinematic oil painting with enhanced film grain and deeper vintage color grading'
  }
];

// Utility function to apply CSS filters
export const applyCSSFilter = (imageElement: HTMLImageElement, filter: FilterEffect): void => {
  imageElement.style.filter = filter.cssFilter;
};

// Function to create a filtered canvas from image
export const createFilteredCanvas = (
  sourceImage: HTMLImageElement, 
  filter: FilterEffect
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = sourceImage.naturalWidth || sourceImage.width;
    canvas.height = sourceImage.naturalHeight || sourceImage.height;
    
    if (ctx) {
      // Apply filter to canvas context
      ctx.filter = filter.cssFilter;
      ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/png', 0.9));
    }
  });
};

// Export default filter list
export default vintageFilters;
