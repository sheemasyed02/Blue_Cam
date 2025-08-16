export const savePhotobooth = async (
  images: Array<{ dataUrl: string }>,
  filename: string = 'serelune-photobooth'
): Promise<void> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas not supported');
    
    // Match the displayed photobooth dimensions more accurately
    const stripWidth = 320;
    const stripHeight = 520; // Adjusted height to match better proportions
    const photoWidth = stripWidth - 30; // Account for border padding
    const photoHeight = Math.floor(photoWidth * 0.75); // 4:3 aspect ratio
    const headerHeight = 50;
    const photoSpacing = 8;
    const borderWidth = 15;
    
    canvas.width = stripWidth;
    canvas.height = stripHeight;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, stripWidth, stripHeight);
    
    // Black outer border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, stripWidth - 3, stripHeight - 3);
    
    // Header section
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📸 PHOTO BOOTH 📸', stripWidth / 2, 30);
    
    // Load and draw images with better sizing
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };
    
    for (let i = 0; i < 4; i++) {
      const photoX = borderWidth;
      const photoY = headerHeight + (i * (photoHeight + photoSpacing));
      
      if (images[i]) {
        try {
          const img = await loadImage(images[i].dataUrl);
          
          // Calculate proper scaling to maintain aspect ratio
          const imgAspectRatio = img.width / img.height;
          const targetAspectRatio = photoWidth / photoHeight;
          
          let drawWidth = photoWidth;
          let drawHeight = photoHeight;
          let offsetX = 0;
          let offsetY = 0;
          
          if (imgAspectRatio > targetAspectRatio) {
            // Image is wider, fit to height
            drawHeight = photoHeight;
            drawWidth = photoHeight * imgAspectRatio;
            offsetX = -(drawWidth - photoWidth) / 2;
          } else {
            // Image is taller, fit to width
            drawWidth = photoWidth;
            drawHeight = photoWidth / imgAspectRatio;
            offsetY = -(drawHeight - photoHeight) / 2;
          }
          
          // Clip to photo area
          ctx.save();
          ctx.beginPath();
          ctx.rect(photoX, photoY, photoWidth, photoHeight);
          ctx.clip();
          
          // Draw the image
          ctx.drawImage(img, photoX + offsetX, photoY + offsetY, drawWidth, drawHeight);
          ctx.restore();
          
          // Photo border
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
        } catch (error) {
          // Draw placeholder if image fails to load
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
          ctx.fillStyle = '#666666';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${i + 1}`, stripWidth / 2, photoY + photoHeight / 2);
        }
      } else {
        // Empty photo slot
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
        ctx.fillStyle = '#999999';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Photo ${i + 1}`, stripWidth / 2, photoY + photoHeight / 2);
      }
    }
    
    // Footer
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${new Date().toLocaleDateString()} • SERELUNE STUDIO`, stripWidth / 2, stripHeight - 20);
    
    // Enhanced perforations to match the display
    const perfSize = 4;
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 22; i++) {
      const y = 35 + (i * 20);
      // Left perforations
      ctx.beginPath();
      ctx.arc(8, y, perfSize, 0, 2 * Math.PI);
      ctx.fill();
      // Right perforations
      ctx.beginPath();
      ctx.arc(stripWidth - 8, y, perfSize, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Save the canvas with high quality
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error saving photobooth:', error);
    alert('Unable to save photobooth strip. Please try again.');
  }
};
