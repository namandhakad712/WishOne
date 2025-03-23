import React, { useState, useEffect } from 'react';
import LiquidGradientBackground from './LiquidGradientBackground';
import AIGreeting from './AIGreeting';
import ExpandableMenu from './ExpandableMenu';
import HomeHeader from './HomeHeader';
import FrostGlassOverlay from './FrostGlassOverlay';
import { getUserSettings } from '@/lib/supabaseClient';

const HomeScreen: React.FC = () => {
  const [showFrostEffect, setShowFrostEffect] = useState(false);
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getUserSettings();
        if (settings?.appearance?.frostBg !== undefined) {
          setShowFrostEffect(settings.appearance.frostBg);
        } else {
          // Fall back to localStorage
          const savedSettings = localStorage.getItem('wishone_settings');
          if (savedSettings) {
            try {
              const parsedSettings = JSON.parse(savedSettings);
              setShowFrostEffect(parsedSettings?.appearance?.frostBg || false);
            } catch (error) {
              console.error('Error parsing saved settings:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <LiquidGradientBackground />
      
      {/* Frost Glass Overlay - conditionally rendered */}
      {showFrostEffect && <FrostGlassOverlay />}
      
      {/* Content - ensure it's above the frost overlay */}
      <div className="flex-1 flex flex-col h-full relative z-20">
        {/* Header */}
        <HomeHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-24">
          <AIGreeting />
        </div>
      </div>
      
      {/* Menu - positioned absolutely and above frost overlay */}
      <div className="relative z-20">
        <ExpandableMenu />
      </div>
    </div>
  );
};

export default HomeScreen; 