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
    cssFilter: 'brightness(95%) contrast(80%) saturate(30%) hue-rotate(200deg) sepia(25%) blur(0.4px)',
    description: 'Vintage glamour smoky romance - almost monochrome with faint silver-blue tones'
  },
  {
    name: 'Born to Die',
    id: 'born-to-die',
    cssFilter: 'brightness(95%) contrast(85%) saturate(70%) hue-rotate(320deg) sepia(20%) blur(0.35px)',
    description: 'Pastel faded cinematic romance - muted blue/silver with dreamy film still aesthetic'
  },
  {
    name: 'West Coast',
    id: 'west-coast',
    cssFilter: 'brightness(95%) contrast(120%) saturate(90%) hue-rotate(25deg) sepia(10%) blur(0.25px)',
    description: 'Rebellious California noir - warm golden haze with deep shadows and gritty film grain'
  },
  {
    name: 'Young & Beautiful',
    id: 'young-beautiful',
    cssFilter: 'brightness(105%) contrast(90%) saturate(80%) hue-rotate(330deg) sepia(15%) blur(0.4px)',
    description: 'Elegant silvery romantic - pale pastel skin tones with ethereal glow and vintage glamour'
  },
  {
    name: 'Summertime Sadness',
    id: 'summertime-sadness',
    cssFilter: 'sepia(35%) hue-rotate(320deg) saturate(120%) brightness(110%) contrast(100%)',
    description: 'Warm orange-pink fade'
  },
  {
    name: 'Honeymoon',
    id: 'honeymoon',
    cssFilter: 'sepia(60%) saturate(80%) brightness(105%) contrast(95%) hue-rotate(25deg)',
    description: 'Sepia romantic fade'
  },
  {
    name: 'Ride',
    id: 'ride',
    cssFilter: 'sepia(45%) hue-rotate(15deg) saturate(125%) brightness(100%) contrast(115%) grayscale(5%)',
    description: 'Desert dusk orange with heavy grain'
  },
  {
    name: 'Love',
    id: 'love',
    cssFilter: 'saturate(70%) brightness(110%) contrast(90%) hue-rotate(300deg) sepia(15%)',
    description: 'Pastel haze'
  },
  {
    name: 'Doin\' Time',
    id: 'doin-time',
    cssFilter: 'saturate(150%) brightness(110%) contrast(110%) hue-rotate(180deg) sepia(10%)',
    description: 'High saturation beach tones'
  },
  {
    name: 'Cherry',
    id: 'cherry',
    cssFilter: 'hue-rotate(350deg) saturate(140%) brightness(95%) contrast(120%) sepia(20%)',
    description: 'Deep red highlights with warm shadows'
  },
  {
    name: 'Venice Bitch',
    id: 'venice-bitch',
    cssFilter: 'saturate(75%) brightness(105%) contrast(85%) hue-rotate(90deg) sepia(25%)',
    description: 'Washed film with muted greens'
  },
  {
    name: 'Brooklyn Baby',
    id: 'brooklyn-baby',
    cssFilter: 'hue-rotate(210deg) saturate(70%) brightness(105%) contrast(80%) sepia(15%)',
    description: 'Low contrast vintage blues'
  },
  {
    name: 'Shades of Cool',
    id: 'shades-of-cool',
    cssFilter: 'hue-rotate(170deg) saturate(90%) brightness(110%) contrast(105%) sepia(10%)',
    description: 'Teal shadows with warm highlights'
  },
  {
    name: 'Ultraviolence',
    id: 'ultraviolence',
    cssFilter: 'contrast(160%) brightness(90%) saturate(80%) grayscale(15%) sepia(5%)',
    description: 'Deep shadows with high contrast whites'
  },
  {
    name: 'Terrence Loves You',
    id: 'terrence-loves-you',
    cssFilter: 'hue-rotate(280deg) saturate(85%) brightness(115%) contrast(90%) blur(0.3px) sepia(20%)',
    description: 'Dreamy haze with lavender tint'
  },
  {
    name: 'Mariners Apartment Complex',
    id: 'mariners-apartment-complex',
    cssFilter: 'hue-rotate(200deg) saturate(95%) brightness(105%) contrast(100%) sepia(15%) hue-rotate(30deg)',
    description: 'Cool navy with golden skin tones'
  },
  {
    name: 'Norman Rockwell',
    id: 'norman-rockwell',
    cssFilter: 'brightness(120%) contrast(90%) saturate(85%) hue-rotate(200deg) sepia(10%)',
    description: 'Bright whites with faded blues'
  },
  {
    name: 'Salvatore',
    id: 'salvatore',
    cssFilter: 'sepia(50%) hue-rotate(25deg) saturate(110%) brightness(108%) contrast(95%)',
    description: 'Retro Italian warm fade'
  },
  {
    name: 'Video Games',
    id: 'video-games',
    cssFilter: 'brightness(88%) contrast(78%) saturate(8%) hue-rotate(198deg) sepia(35%) blur(0.5px) grayscale(20%)',
    description: 'Ultra-dreamy cinematic haze with heavy desaturation and vintage grain'
  },
  {
    name: 'Tragic Romance',
    id: 'tragic-romance',
    cssFilter: 'brightness(94%) contrast(83%) saturate(68%) hue-rotate(230deg) sepia(22%) blur(0.45px) grayscale(6%) opacity(96%)',
    description: 'Soft melancholic vintage dream - elegant but haunting like a faded movie poster'
  },
  {
    name: 'Hollywood Noir',
    id: 'hollywood-noir',
    cssFilter: 'brightness(85%) contrast(130%) saturate(0%) hue-rotate(340deg) sepia(12%) blur(0.25px) grayscale(95%)',
    description: 'Raw black & white film with dramatic shadows and rebellious edge'
  },
  {
    name: 'Golden West',
    id: 'golden-west',
    cssFilter: 'brightness(88%) contrast(118%) saturate(25%) hue-rotate(35deg) sepia(40%) blur(0.2px)',
    description: 'Warm golden-tinted noir with deep shadows and hazy film grain'
  }
];

// Advanced CSS filter combinations for more complex effects
export const advancedFilters: FilterEffect[] = [
  {
    name: 'Blue Jeans (Advanced)',
    id: 'blue-jeans-advanced',
    cssFilter: 'brightness(93%) contrast(75%) saturate(25%) hue-rotate(195deg) sepia(30%) blur(0.5px)',
    description: 'Ultra-smoky vintage glamour with heavy grain and ethereal mist'
  },
  {
    name: 'West Coast (Advanced)',
    id: 'west-coast-advanced',
    cssFilter: 'brightness(92%) contrast(125%) saturate(85%) hue-rotate(30deg) sepia(15%) blur(0.3px)',
    description: 'Ultra-gritty California dream with intense golden haze and raw shadows'
  },
  {
    name: 'Born to Die (Advanced)',
    id: 'born-to-die-advanced',
    cssFilter: 'brightness(93%) contrast(82%) saturate(65%) hue-rotate(315deg) sepia(25%) blur(0.5px)',
    description: 'Ultra-pastel dreamy romance with heavy film grain and ethereal glow'
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
