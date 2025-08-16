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
          background: '#ffffff',
          border: '5px solid #ffffff',
          boxShadow: `
            inset 0 0 0 1px #e5e5e5,
            0 3px 15px rgba(0,0,0,0.1),
            0 1px 4px rgba(0,0,0,0.06)
          `,
          borderRadius: '1px'
        };
      
      case 'polaroid':
        return {
          padding: '15px 15px 50px 15px',
          background: '#ffffff',
          boxShadow: `
            0 4px 20px rgba(0,0,0,0.15),
            0 1px 3px rgba(0,0,0,0.1)
          `,
          transform: 'rotate(-1deg)',
          borderRadius: '2px',
          position: 'relative'
        };
      
      case 'filmstrip':
        return {
          padding: '15px 30px',
          background: '#1c1c1c',
          border: '2px solid #0a0a0a',
          boxShadow: `
            0 4px 20px rgba(0,0,0,0.4),
            inset 0 0 0 1px #333333
          `,
          borderRadius: '1px',
          position: 'relative'
        };
      
      case 'aesthetic':
        return {
          padding: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
          borderRadius: '12px',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.06),
            0 2px 8px rgba(0,0,0,0.03),
            inset 0 1px 0 rgba(255,255,255,0.8)
          `,
          border: '1px solid rgba(0,0,0,0.02)'
        };
      
      case 'vintage':
        return {
          padding: '25px',
          background: `
            linear-gradient(45deg, 
              #8B4513 0%, 
              #A0522D 50%, 
              #8B4513 100%
            )
          `,
          borderRadius: '8px',
          boxShadow: `
            inset 0 0 0 2px #654321,
            inset 0 0 0 4px #D2691E,
            0 6px 25px rgba(0,0,0,0.3)
          `,
          border: '2px solid #5d4037',
          position: 'relative'
        };
      
      case 'golden':
        return {
          padding: '20px',
          background: `
            linear-gradient(45deg, 
              #B8860B 0%, 
              #DAA520 25%, 
              #FFD700 50%, 
              #DAA520 75%, 
              #B8860B 100%
            )
          `,
          borderRadius: '10px',
          boxShadow: `
            inset 0 0 0 1px #FFD700,
            inset 0 0 0 3px #DAA520,
            0 8px 30px rgba(0,0,0,0.2)
          `,
          border: '3px solid #8B7355',
          position: 'relative'
        };
      
      case 'scrapbook':
        return {
          padding: '18px',
          background: `
            linear-gradient(135deg, 
              #faf0e6 0%, 
              #f5deb3 50%, 
              #faf0e6 100%
            )
          `,
          borderRadius: '6px',
          boxShadow: `
            inset 0 0 0 1px #d4af37,
            inset 0 0 0 2px #ffffff,
            0 5px 20px rgba(0,0,0,0.15)
          `,
          border: '1px solid #cd853f',
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
        boxShadow: `
          inset 0 0 0 2px #000000,
          0 6px 24px rgba(0,0,0,0.3),
          0 3px 12px rgba(0,0,0,0.15)
        `,
        background: '#ffffff',
        width: '240px',
        height: 'auto',
        margin: '0 auto',
        position: 'relative',
        borderRadius: '3px'
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
                className="w-full h-16 bg-gray-100 border border-black overflow-hidden relative"
                style={{ borderRadius: '1px' }}
              >
                {photo ? (
                  <img 
                    src={photo.dataUrl} 
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
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
        
        <div className="text-center text-black text-xs mt-3 font-mono tracking-wide">
          {new Date().toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
          })} • SERELUNE
        </div>
        
        {/* Side perforations */}
        <div className="absolute left-1 top-6 bottom-6 flex flex-col justify-around">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 bg-black rounded-full"
            ></div>
          ))}
        </div>
        <div className="absolute right-1 top-6 bottom-6 flex flex-col justify-around">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 bg-black rounded-full"
            ></div>
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
          <div className="absolute left-2 top-4 bottom-4 w-6 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-3 bg-gray-700 border border-gray-500 rounded-sm"></div>
            ))}
          </div>
          <div className="absolute right-2 top-4 bottom-4 w-6 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-3 bg-gray-700 border border-gray-500 rounded-sm"></div>
            ))}
          </div>
        </>
      )}
      
      {frameId === 'polaroid' && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="text-gray-600 text-sm font-mono tracking-wide">
            {new Date().toLocaleDateString()} • SERELUNE
          </div>
        </div>
      )}
      
      {frameId === 'vintage' && (
        <>
          <div className="absolute top-2 left-2 w-6 h-6">
            <div className="w-full h-full border-l-2 border-t-2 border-yellow-400 opacity-60"></div>
          </div>
          <div className="absolute top-2 right-2 w-6 h-6">
            <div className="w-full h-full border-r-2 border-t-2 border-yellow-400 opacity-60"></div>
          </div>
          <div className="absolute bottom-2 left-2 w-6 h-6">
            <div className="w-full h-full border-l-2 border-b-2 border-yellow-400 opacity-60"></div>
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6">
            <div className="w-full h-full border-r-2 border-b-2 border-yellow-400 opacity-60"></div>
          </div>
        </>
      )}
      
      {frameId === 'golden' && (
        <>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full"></div>
          </div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-400 rounded-full"></div>
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 via-yellow-200 to-yellow-400 rounded-full"></div>
          </div>
        </>
      )}
      
      {frameId === 'scrapbook' && (
        <>
          <div className="absolute -top-2 -left-2 w-6 h-6 transform -rotate-15">
            <div className="w-full h-full bg-yellow-300 border border-yellow-500 rounded shadow-sm opacity-80"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 transform rotate-20">
            <div className="w-full h-full bg-pink-300 border border-pink-500 rounded shadow-sm opacity-80"></div>
          </div>
          <div className="absolute -bottom-2 -left-1 w-4 h-4 transform rotate-45">
            <div className="w-full h-full bg-blue-300 border border-blue-500 rounded shadow-sm opacity-80"></div>
          </div>
          <div className="absolute -bottom-1 -right-2 w-6 h-6 transform -rotate-30">
            <div className="w-full h-full bg-green-300 border border-green-500 rounded shadow-sm opacity-80"></div>
          </div>
        </>
      )}
      
      {frameId === 'aesthetic' && (
        <>
          <div className="absolute top-1 left-1 w-6 h-6 border-l border-t border-gray-200 rounded-tl-lg opacity-40"></div>
          <div className="absolute top-1 right-1 w-6 h-6 border-r border-t border-gray-200 rounded-tr-lg opacity-40"></div>
          <div className="absolute bottom-1 left-1 w-6 h-6 border-l border-b border-gray-200 rounded-bl-lg opacity-40"></div>
          <div className="absolute bottom-1 right-1 w-6 h-6 border-r border-b border-gray-200 rounded-br-lg opacity-40"></div>
        </>
      )}
    </div>
  );
};
