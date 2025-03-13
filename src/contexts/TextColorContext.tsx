import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSettings } from '@/lib/supabaseClient';
import { gradientOptions, shouldUseWhiteText, generateRandomGradient } from '@/components/SettingsDialog';

interface TextColorContextType {
  shouldUseWhite: boolean;
  setShouldUseWhite?: (value: boolean) => void;
}

const defaultContext: TextColorContextType = {
  shouldUseWhite: false,
};

export const TextColorContext = createContext<TextColorContextType>(defaultContext);

export const useTextColor = () => useContext(TextColorContext);

export const TextColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldUseWhite, setShouldUseWhite] = useState<boolean>(false);

  useEffect(() => {
    const determineTextColor = async () => {
      try {
        // Get user settings
        const settings = await getUserSettings();
        let gradientId = settings?.appearance?.backgroundGradient || 'mint-gold';
        let colors: [string, string];

        // Handle random gradient
        if (gradientId === 'random') {
          colors = generateRandomGradient();
        } else {
          // Find predefined gradient
          const selectedGradient = gradientOptions.find(g => g.id === gradientId);
          colors = selectedGradient?.colors || ['173, 216, 200', '240, 219, 165']; // Default to mint-gold
        }

        // Calculate average color (simplified approach)
        const avgColor = colors[0]; // Using first color as dominant for simplicity
        
        // Determine if white text should be used
        setShouldUseWhite(shouldUseWhiteText(avgColor));
      } catch (error) {
        console.error('Error determining text color:', error);
        
        // Fallback to localStorage
        try {
          const savedSettings = localStorage.getItem('wishone_settings');
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            const gradientId = parsedSettings?.appearance?.backgroundGradient || 'mint-gold';
            
            if (gradientId === 'random') {
              const colors = generateRandomGradient();
              setShouldUseWhite(shouldUseWhiteText(colors[0]));
            } else {
              const selectedGradient = gradientOptions.find(g => g.id === gradientId);
              if (selectedGradient) {
                setShouldUseWhite(shouldUseWhiteText(selectedGradient.colors[0]));
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing saved settings:', parseError);
        }
      }
    };

    determineTextColor();
  }, []);

  return (
    <TextColorContext.Provider value={{ shouldUseWhite, setShouldUseWhite }}>
      {children}
    </TextColorContext.Provider>
  );
}; 