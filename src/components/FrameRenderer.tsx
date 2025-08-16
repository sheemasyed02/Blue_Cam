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
          border: '20px solid #ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.1)',
          background: '#ffffff'
        };
      
      case 'polaroid':
        return {
          border: '20px solid #ffffff',
          borderBottom: '80px solid #ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          transform: 'rotate(-1.5deg)',
          background: '#ffffff',
          position: 'relative'
        };
      
      case 'filmstrip':
        return {
          border: '20px solid #1a1a1a',
          borderLeft: '50px solid #1a1a1a',
          borderRight: '50px solid #1a1a1a',
          boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
          background: '#1a1a1a',
          position: 'relative'
        };
      
      case 'aesthetic':
        return {
          border: '30px solid #f8f9fa',
          borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          background: '#f8f9fa'
        };
      
      case 'vintage':
        return {
          border: '25px solid #8B4513',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 0 2px #654321, 0 8px 25px rgba(0,0,0,0.3)',
          background: 'linear-gradient(45deg, #8B4513, #A0522D)',
          position: 'relative'
        };
      
      case 'golden':
        return {
          border: '30px solid #DAA520',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 0 3px #FFD700, inset 0 0 0 6px #B8860B, 0 10px 35px rgba(0,0,0,0.25)',
          background: 'linear-gradient(45deg, #DAA520, #FFD700, #DAA520)',
          position: 'relative'
        };
      
      case 'scrapbook':
        return {
          border: '25px solid #faf0e6',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 0 4px #d4af37, 0 8px 30px rgba(0,0,0,0.2)',
          background: 'linear-gradient(135deg, #faf0e6, #f5deb3)',
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
    <div className={className} style={frameStyle}>
      <img 
        src={image} 
        alt="Framed" 
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
      
      {/* Special decorative elements for specific frames */}
      {frameId === 'filmstrip' && (
        <>
          <div className="absolute left-2 top-4 bottom-4 w-6 flex flex-col justify-around">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-4 h-3 bg-white border border-gray-400"></div>
            ))}
          </div>
          <div className="absolute right-2 top-4 bottom-4 w-6 flex flex-col justify-around">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-4 h-3 bg-white border border-gray-400"></div>
            ))}
          </div>
        </>
      )}
      
      {frameId === 'polaroid' && (
        <div className="absolute bottom-2 left-4 right-4 text-center">
          <div className="text-gray-600 text-sm font-handwriting">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      )}
      
      {frameId === 'vintage' && (
        <>
          <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-yellow-600"></div>
          <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-yellow-600"></div>
          <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-yellow-600"></div>
          <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-yellow-600"></div>
        </>
      )}
      
      {frameId === 'golden' && (
        <>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
        </>
      )}
      
      {frameId === 'scrapbook' && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 transform -rotate-12">
            <div className="w-full h-full bg-yellow-200 border border-yellow-400 rounded-sm shadow-sm"></div>
          </div>
          <div className="absolute top-0 right-0 w-6 h-6 transform rotate-12">
            <div className="w-full h-full bg-pink-200 border border-pink-400 rounded-sm shadow-sm"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-6 h-6 transform rotate-45">
            <div className="w-full h-full bg-blue-200 border border-blue-400 rounded-sm shadow-sm"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 transform -rotate-45">
            <div className="w-full h-full bg-green-200 border border-green-400 rounded-sm shadow-sm"></div>
          </div>
        </>
      )}
    </div>
  );
};
