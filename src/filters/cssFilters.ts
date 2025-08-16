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
    cssFilter: 'brightness(95%) contrast(85%) saturate(80%) hue-rotate(25deg) sepia(20%) blur(0.5px)',
    description: 'Dreamy nostalgic warm tragedy - faded summer film reels with golden haze and soft tragic-romantic glow'
  },
  {
    name: 'Honeymoon',
    id: 'honeymoon',
    cssFilter: 'brightness(105%) contrast(90%) saturate(75%) hue-rotate(15deg) sepia(15%) blur(0.4px)',
    description: 'Luxurious vintage cinematic postcard - muted warm tones with 1960s glam filter and pinkish-magenta romance'
  },
  {
    name: 'Ride',
    id: 'ride',
    cssFilter: 'brightness(100%) contrast(90%) saturate(85%) hue-rotate(30deg) sepia(10%) blur(0.3px)',
    description: 'Cinematic Americana - dusty golden deserts, faded vintage road-trip freedom with gritty film grain'
  },
  {
    name: 'Love',
    id: 'love',
    cssFilter: 'brightness(110%) contrast(85%) saturate(80%) hue-rotate(330deg) sepia(20%) blur(0.6px)',
    description: 'Ethereal cosmic dream - soft glowing pastels with outer-space surreal tones and heavenly glow'
  },
  {
    name: 'Doin\' Time',
    id: 'doin-time',
    cssFilter: 'brightness(105%) contrast(95%) saturate(85%) hue-rotate(20deg) sepia(20%) blur(0.35px)',
    description: 'Retro California dream - 90s VHS summer haze with faded beach tones and laid-back vintage feel'
  },
  {
    name: 'Cherry',
    id: 'cherry',
    cssFilter: 'brightness(90%) contrast(115%) saturate(90%) hue-rotate(350deg) sepia(10%) blur(0.3px)',
    description: 'Intimate raw sultry passion - deep reds, smoky shadows, moody cinematic spotlight with dark glamour'
  },
  {
    name: 'Venice Bitch',
    id: 'venice-bitch',
    cssFilter: 'brightness(105%) contrast(85%) saturate(80%) hue-rotate(15deg) sepia(25%) blur(0.5px)',
    description: 'Psychedelic dreamy Americana - faded film tones with golden haze and surreal washed retro pastels'
  },
  {
    name: 'Brooklyn Baby',
    id: 'brooklyn-baby',
    cssFilter: 'brightness(100%) contrast(95%) saturate(85%) hue-rotate(320deg) sepia(15%) blur(0.25px)',
    description: 'Hip ironic vintage NYC - muted urban tones with playful 70s-retro styling and cool city vibes'
  },
  {
    name: 'Shades of Cool',
    id: 'shades-of-cool',
    cssFilter: 'brightness(95%) contrast(85%) saturate(80%) hue-rotate(180deg) sepia(25%) blur(0.7px)',
    description: 'Ethereal underwater haze - glowing cyan/teal tones, ghostly softness, surreal dreamy cinematic blur'
  },
  {
    name: 'Ultraviolence',
    id: 'ultraviolence',
    cssFilter: 'brightness(85%) contrast(110%) saturate(70%) hue-rotate(0deg) sepia(20%) blur(0.25px)',
    description: 'Raw dark vintage noir - faded blacks, muted grays, gritty Americana with moody cinema spotlight'
  },
  {
    name: 'Terrence Loves You',
    id: 'terrence-loves-you',
    cssFilter: 'brightness(95%) contrast(85%) saturate(75%) hue-rotate(210deg) sepia(20%) blur(0.6px)',
    description: 'Spacey haunting jazz-lounge - muted blues, smoky atmosphere, dreamy mist with cool vintage sadness'
  },
  {
    name: 'Mariners Apartment Complex',
    id: 'mariners-apartment-complex',
    cssFilter: 'brightness(100%) contrast(90%) saturate(80%) hue-rotate(200deg) sepia(15%) blur(0.4px)',
    description: 'Moody coastal twilight - soft blues, golden dusk, faded film feel with dreamy ocean melancholy'
  },
  {
    name: 'Norman Rockwell',
    id: 'norman-rockwell',
    cssFilter: 'brightness(110%) contrast(90%) saturate(85%) hue-rotate(320deg) sepia(15%) blur(0.4px)',
    description: 'Bright ironic Americana - pastel coastal tones, painterly soft edges with romantic dreamy glow'
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
