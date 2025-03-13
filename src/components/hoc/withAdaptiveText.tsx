import React from 'react';
import { useAdaptiveTextColor } from '@/hooks/useAdaptiveTextColor';
import { cn } from '@/lib/utils';

// Higher-order component to add adaptive text color to any component
export const withAdaptiveText = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    className?: string;
    forceWhite?: boolean;
    forceDark?: boolean;
  } = {}
) => {
  const WithAdaptiveText = (props: P) => {
    const { textColorClass } = useAdaptiveTextColor();
    const { className, forceWhite, forceDark } = options;
    
    // Determine text color
    const finalTextColorClass = forceWhite 
      ? 'text-white' 
      : forceDark 
        ? 'text-gray-900' 
        : textColorClass;
    
    return (
      <Component 
        {...props} 
        className={cn(finalTextColorClass, 'transition-colors duration-300', className)}
      />
    );
  };
  
  return WithAdaptiveText;
}; 