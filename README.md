# Blue Vintage Camera

A React + TypeScript application for capturing and editing photos with vintage camera filters, built with Vite and styled with Tailwind CSS.

## Features

- **Camera Integration**: Use device camera with react-webcam
- **Image Upload**: Drag and drop image upload with react-dropzone
- **Vintage Filters**: Shader-based image filters using gl-react
- **Mobile Responsive**: Optimized for all device sizes
- **Modern UI**: Custom color palette and Google Fonts integration

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3 with custom theme
- **Animation**: Framer Motion
- **Image Processing**: gl-react and gl-react-dom for WebGL filters
- **Utilities**: classnames, file-saver

## Color Palette

- **Cream**: `#f9f6f1` - Background and light elements
- **Gold**: `#c5a27c` - Accent and interactive elements  
- **Charcoal**: `#5a4e3c` - Text and dark elements
- **Peach**: `#e4c3a1` - Secondary accent

## Typography

- **Titles**: Playfair Display (serif)
- **Body Text**: Lora (serif)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── filters/       # WebGL shader filters
├── styles/        # Additional styles
└── utils/         # Utility functions and helpers
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Dependencies

### Core
- react, react-dom
- typescript
- vite

### Styling & UI
- tailwindcss, postcss, autoprefixer
- framer-motion
- classnames

### Camera & Image Processing
- react-webcam
- react-dropzone
- gl-react, gl-react-dom
- file-saver

## Development

The development server runs at `http://localhost:5173/` with hot module replacement enabled.

## License

This project is licensed under the MIT License.
