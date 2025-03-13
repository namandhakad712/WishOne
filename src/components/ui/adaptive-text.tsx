import React from 'react';
import { cn } from '@/lib/utils';
import { useTextColor } from '@/contexts/TextColorContext';

interface AdaptiveTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  forceWhite?: boolean;
  forceDark?: boolean;
}

export const AdaptiveText: React.FC<AdaptiveTextProps> = ({
  children,
  className,
  as = 'p',
  forceWhite = false,
  forceDark = false,
  ...props
}) => {
  const { shouldUseWhite } = useTextColor();
  
  // Determine text color
  const textColorClass = forceWhite 
    ? 'text-white' 
    : forceDark 
      ? 'text-gray-900' 
      : shouldUseWhite 
        ? 'text-white' 
        : 'text-gray-900';
  
  const Component = as;
  
  return (
    <Component
      className={cn(textColorClass, 'transition-colors duration-300', className)}
      {...props}
    >
      {children}
    </Component>
  );
}; 