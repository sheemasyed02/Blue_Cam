import { saveAs } from 'file-saver';

export const downloadImage = (dataUrl: string, filename: string = 'blue-vintage-camera-image.png') => {
  saveAs(dataUrl, filename);
};

export const dataUrlToBlob = (dataUrl: string): Promise<Blob> => {
  return fetch(dataUrl).then(res => res.blob());
};

export const resizeImage = (
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 600, 
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png', quality));
    };
    
    img.src = URL.createObjectURL(file);
  });
};
