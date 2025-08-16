export const saveFramedImage = async (
  imageElement: HTMLElement,
  filename: string = 'serelune-framed-photo'
): Promise<void> => {
  try {
    // Use html2canvas to capture the framed image
    const { default: html2canvas } = await import('html2canvas');
    
    const canvas = await html2canvas(imageElement, {
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Convert canvas to blob
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return;
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error saving framed image:', error);
    
    // Fallback: try to save without html2canvas
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Simple fallback implementation
        canvas.width = 800;
        canvas.height = 600;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666666';
        ctx.font = '20px Arial';
        ctx.fillText('Frame capture unavailable', 50, 300);
        
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
        });
      }
    } catch (fallbackError) {
      console.error('Fallback save also failed:', fallbackError);
      alert('Unable to save image. Please try using the browser\'s right-click save option.');
    }
  }
};

export const savePhotobooth = async (
  images: Array<{ dataUrl: string }>,
  filename: string = 'serelune-photobooth'
): Promise<void> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas not supported');
    
    // Photobooth dimensions
    const stripWidth = 300;
    const stripHeight = 600;
    const photoHeight = 120;
    const headerHeight = 40;
    const spacing = 10;
    
    canvas.width = stripWidth;
    canvas.height = stripHeight;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, stripWidth, stripHeight);
    
    // Black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, stripWidth, stripHeight);
    
    // Header
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📸 PHOTO BOOTH 📸', stripWidth / 2, 25);
    
    // Load and draw images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };
    
    for (let i = 0; i < 4; i++) {
      const y = headerHeight + (i * (photoHeight + spacing));
      
      if (images[i]) {
        try {
          const img = await loadImage(images[i].dataUrl);
          ctx.drawImage(img, spacing, y, stripWidth - (spacing * 2), photoHeight);
          
          // Photo border
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(spacing, y, stripWidth - (spacing * 2), photoHeight);
        } catch (error) {
          // Draw placeholder if image fails to load
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(spacing, y, stripWidth - (spacing * 2), photoHeight);
          ctx.fillStyle = '#666666';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${i + 1}`, stripWidth / 2, y + photoHeight / 2);
        }
      } else {
        // Empty photo slot
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(spacing, y, stripWidth - (spacing * 2), photoHeight);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(spacing, y, stripWidth - (spacing * 2), photoHeight);
      }
    }
    
    // Footer
    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${new Date().toLocaleDateString()} • SERELUNE STUDIO`, stripWidth / 2, stripHeight - 15);
    
    // Perforations
    const perfSize = 3;
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 20; i++) {
      const y = 30 + (i * 25);
      // Left perforations
      ctx.beginPath();
      ctx.arc(6, y, perfSize, 0, 2 * Math.PI);
      ctx.fill();
      // Right perforations
      ctx.beginPath();
      ctx.arc(stripWidth - 6, y, perfSize, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Save the canvas
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
