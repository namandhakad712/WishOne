import React from 'react';

interface FrostGlassOverlayProps {
  className?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

/**
 * A component that creates a frosted glass effect overlay
 * This will be conditionally rendered on the home screen when enabled in settings
 */
const FrostGlassOverlay: React.FC<FrostGlassOverlayProps> = ({ className = '', imageUrl, children }) => {
  const backgroundImage = imageUrl || 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/jess-harding-lqT6NAmTaiY-unsplash.jpg';
  return (
    <div className={`frost-glass ${className}`}>
      <div
        className="frost-glass__background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="frost-glass__shadow">
        {children && (
          <span className="frost-glass__content">{children}</span>
        )}
      </div>
    </div>
  );
};

export default FrostGlassOverlay; 