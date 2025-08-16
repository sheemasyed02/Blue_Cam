import type { CSSProperties } from 'react';

interface PhotoboothImage {
  id: string;
  dataUrl: string;
  timestamp: Date;
}

interface FrameRendererProps {
  frameId: string;
  image: string;
  frameData?: {
    images?: PhotoboothImage[];
  };
  className?: string;
}

export const FrameRenderer = ({ frameId, image, frameData, className }: FrameRendererProps) => {
  const getFrameStyle = (frameId: string): CSSProperties => {
    switch (frameId) {
      case 'classic':
        return {
          padding: '20px',
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          border: '1px solid #e0e0e0',
          boxShadow: 'inset 0 0 0 8px #ffffff, inset 0 0 0 9px #d0d0d0, 0 5px 15px rgba(0,0,0,0.2)',
          borderRadius: '2px'
        };
      
      case 'polaroid':
        return {
          padding: '15px 15px 60px 15px',
          background: '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1)',
          transform: 'rotate(-1.2deg)',
          borderRadius: '3px',
          position: 'relative'
        };
      
      case 'filmstrip':
        return {
          padding: '20px 40px',
          background: '#1a1a1a',
          border: '2px solid #0a0a0a',
          boxShadow: '0 6px 25px rgba(0,0,0,0.5), inset 0 0 0 2px #333',
          position: 'relative'
        };
      
      case 'aesthetic':
        return {
          padding: '25px',
          background: 'linear-gradient(135deg, #fafafa, #f5f5f5)',
          borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.8)'
        };
      
      case 'vintage':
        return {
          padding: '30px',
          background: 'linear-gradient(45deg, #8B4513, #A0522D, #8B4513)',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 0 4px #654321, inset 0 0 0 6px #D2691E, 0 8px 25px rgba(0,0,0,0.4)',
          border: '2px solid #654321',
          position: 'relative'
        };
      
      case 'golden':
        return {
          padding: '25px',
          background: 'linear-gradient(45deg, #DAA520, #FFD700, #DAA520, #B8860B)',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 0 3px #FFD700, inset 0 0 0 6px #B8860B, inset 0 0 0 8px #DAA520, 0 10px 35px rgba(0,0,0,0.3)',
          border: '2px solid #B8860B',
          position: 'relative'
        };
      
      case 'scrapbook':
        return {
          padding: '20px',
          background: 'linear-gradient(135deg, #faf0e6, #f5deb3, #faf0e6)',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 0 3px #d4af37, inset 0 0 0 5px #ffffff, 0 8px 30px rgba(0,0,0,0.2)',
          border: '1px solid #d4af37',
          position: 'relative'
        };
      
      default:
        return {};
    }
  };

  if (frameId === 'photobooth' && frameData?.images && frameData.images.length > 0) {
    return (
      <div className={`bg-white ${className}`} style={{
        border: '12px solid #ffffff',
        borderTop: '30px solid #ffffff',
        borderBottom: '30px solid #ffffff',
        boxShadow: 'inset 0 0 0 2px #000000, 0 6px 25px rgba(0,0,0,0.3)',
        background: '#ffffff',
        minWidth: '240px',
        maxWidth: '300px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div className="text-center text-black font-bold mb-3 text-sm tracking-wider">
          📸 PHOTO BOOTH 📸
        </div>
        
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => {
            const photo = frameData.images?.[index];
            return (
              <div 
                key={index} 
                className="aspect-[4/3] bg-gray-200 border border-black overflow-hidden relative"
              >
                {photo ? (
                  <img 
                    src={photo.dataUrl} 
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    Photo {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center text-black text-xs mt-3 font-mono">
          {new Date().toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
          })} • SERELUNE STUDIO
        </div>
        
        {/* Decorative perforations */}
        <div className="absolute left-1 top-6 bottom-6 flex flex-col justify-around">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-black rounded-full"></div>
          ))}
        </div>
        <div className="absolute right-1 top-6 bottom-6 flex flex-col justify-around">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-black rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const frameStyle = getFrameStyle(frameId);

  return (
    <div className={`inline-block ${className}`} style={frameStyle}>
      <div className="relative overflow-hidden" style={{ borderRadius: frameId === 'aesthetic' ? '4px' : '2px' }}>
        <img 
          src={image} 
          alt="Framed" 
          className="w-full h-full object-cover"
          style={{ 
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            aspectRatio: '4/3'
          }}
        />
      </div>
      
      {/* Special decorative elements for specific frames */}
      {frameId === 'filmstrip' && (
        <>
          <div className="absolute left-2 top-4 bottom-4 w-8 flex flex-col justify-around">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-5 h-3 bg-gray-800 border border-gray-600 rounded-sm"></div>
            ))}
          </div>
          <div className="absolute right-2 top-4 bottom-4 w-8 flex flex-col justify-around">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-5 h-3 bg-gray-800 border border-gray-600 rounded-sm"></div>
            ))}
          </div>
        </>
      )}
      
      {frameId === 'polaroid' && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="text-gray-600 text-sm font-mono">
            {new Date().toLocaleDateString()} • SERELUNE
          </div>
        </div>
      )}
      
      {frameId === 'vintage' && (
        <>
          <div className="absolute top-2 left-2 w-6 h-6">
            <div className="w-full h-full border-4 border-l-yellow-600 border-t-yellow-600 border-r-transparent border-b-transparent rotate-0"></div>
          </div>
          <div className="absolute top-2 right-2 w-6 h-6">
            <div className="w-full h-full border-4 border-r-yellow-600 border-t-yellow-600 border-l-transparent border-b-transparent rotate-0"></div>
          </div>
          <div className="absolute bottom-2 left-2 w-6 h-6">
            <div className="w-full h-full border-4 border-l-yellow-600 border-b-yellow-600 border-r-transparent border-t-transparent rotate-0"></div>
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6">
            <div className="w-full h-full border-4 border-r-yellow-600 border-b-yellow-600 border-l-transparent border-t-transparent rotate-0"></div>
          </div>
        </>
      )}
      
      {frameId === 'golden' && (
        <>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-3 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full shadow-inner"></div>
          </div>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-3 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full shadow-inner"></div>
          </div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-12 bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-400 rounded-full shadow-inner"></div>
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-12 bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-400 rounded-full shadow-inner"></div>
          </div>
        </>
      )}
      
      {frameId === 'scrapbook' && (
        <>
          <div className="absolute -top-2 -left-2 w-8 h-8 transform -rotate-12">
            <div className="w-full h-full bg-yellow-300 border-2 border-yellow-500 rounded-lg shadow-md"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 transform rotate-12">
            <div className="w-full h-full bg-pink-300 border-2 border-pink-500 rounded-lg shadow-md"></div>
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 transform rotate-45">
            <div className="w-full h-full bg-blue-300 border-2 border-blue-500 rounded-lg shadow-md"></div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 transform -rotate-45">
            <div className="w-full h-full bg-green-300 border-2 border-green-500 rounded-lg shadow-md"></div>
          </div>
        </>
      )}
    </div>
  );
};
