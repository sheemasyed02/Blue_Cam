export interface CameraProps {
  onCapture?: (imageData: string) => void;
  className?: string;
}

export interface FilterProps {
  intensity?: number;
  children?: React.ReactNode;
}

export interface ImageUploadProps {
  onImageSelect?: (file: File) => void;
  className?: string;
}

export interface GalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
  className?: string;
}

export { Navigation } from './Navigation';
export { FiltersPanel } from './FiltersPanel';
export { FramesPanel } from './FramesPanel';
export { FrameRenderer } from './FrameRenderer';
export { AdjustmentsPanel } from './AdjustmentsPanel';
export { ExportPanel } from './ExportPanel';
export type { ImageAdjustments } from './AdjustmentsPanel';
export { FilterList } from './FilterList';
