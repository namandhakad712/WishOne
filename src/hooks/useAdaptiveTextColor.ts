import { useTextColor } from '@/contexts/TextColorContext';

export const useAdaptiveTextColor = () => {
  const { shouldUseWhite } = useTextColor();
  
  return {
    textColorClass: shouldUseWhite ? 'text-white' : 'text-gray-900',
    shouldUseWhite,
    textStyle: { color: shouldUseWhite ? 'white' : '#1a202c' },
  };
}; 