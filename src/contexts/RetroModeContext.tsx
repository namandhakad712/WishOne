import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserSettings } from '@/lib/supabaseClient';

interface RetroModeContextType {
  isRetroMode: boolean;
  setIsRetroMode: (value: boolean) => void;
}

const RetroModeContext = createContext<RetroModeContextType | undefined>(undefined);

export const RetroModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRetroMode, setIsRetroMode] = useState(false);

  // Load retro mode setting on mount
  useEffect(() => {
    const loadRetroModeSetting = async () => {
      try {
        const settings = await getUserSettings();
        if (settings?.appearance?.retroMode !== undefined) {
          setIsRetroMode(settings.appearance.retroMode);
        } else {
          // Fallback to localStorage
          const savedSettings = localStorage.getItem('wishone_settings');
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setIsRetroMode(parsedSettings?.appearance?.retroMode || false);
          }
        }
      } catch (error) {
        console.error('Error loading retro mode setting:', error);
      }
    };

    loadRetroModeSetting();
  }, []);

  // Update body class when retro mode changes
  useEffect(() => {
    if (isRetroMode) {
      document.body.classList.add('retro-mode');
    } else {
      document.body.classList.remove('retro-mode');
    }
  }, [isRetroMode]);

  return (
    <RetroModeContext.Provider value={{ isRetroMode, setIsRetroMode }}>
      {children}
    </RetroModeContext.Provider>
  );
};

export const useRetroMode = () => {
  const context = useContext(RetroModeContext);
  if (context === undefined) {
    throw new Error('useRetroMode must be used within a RetroModeProvider');
  }
  return context;
}; 