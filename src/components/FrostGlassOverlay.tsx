import React from 'react';

interface FrostGlassOverlayProps {
  className?: string;
}

/**
 * A component that creates a frosted glass effect overlay
 * This will be conditionally rendered on the home screen when enabled in settings
 */
const FrostGlassOverlay: React.FC<FrostGlassOverlayProps> = ({ className = '' }) => {
  return (
    <div 
      className={`absolute inset-0 z-5 pointer-events-none ${className}`}
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        mixBlendMode: 'overlay'
      }}
    >
      {/* Optional subtle pattern overlay to enhance frost effect */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 8%)',
          backgroundSize: '25px 25px'
        }}
      />
    </div>
  );
};

export default FrostGlassOverlay; 