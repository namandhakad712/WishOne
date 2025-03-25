import React, { useState, useEffect, useRef } from 'react';
import LiquidGradientBackground from './LiquidGradientBackground';
import AIGreeting from './AIGreeting';
import ExpandableMenu from './ExpandableMenu';
import HomeHeader from './HomeHeader';
import FrostGlassOverlay from './FrostGlassOverlay';
import { getUserSettings } from '@/lib/supabaseClient';
import ScrollAnimatedElement from './ScrollAnimatedElement';
import AnimatedElement from './AnimatedElement';
import { gsap } from 'gsap';

const HomeScreen: React.FC = () => {
  const [showFrostEffect, setShowFrostEffect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
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
  
  // Initial animation sequence when the component mounts
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a timeline for sequential animations
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Animate background
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      0
    );
    
    // Animate header
    tl.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.2
    );
    
    // Animate main content
    tl.fromTo(
      contentRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
      0.5
    );
    
    // Animate menu
    tl.fromTo(
      menuRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.7
    );
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <div ref={containerRef} className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <LiquidGradientBackground />
      
      {/* Frost Glass Overlay - conditionally rendered */}
      {showFrostEffect && <FrostGlassOverlay />}
      
      {/* Content - ensure it's above the frost overlay */}
      <div className="flex-1 flex flex-col h-full relative z-20">
        {/* Header */}
        <div ref={headerRef}>
          <AnimatedElement type="slideDown" delay={0.2} duration={0.8}>
            <HomeHeader />
          </AnimatedElement>
        </div>
        
        {/* Main Content */}
        <div 
          ref={contentRef} 
          className="flex-1 flex items-center justify-center px-6 pb-24"
        >
          <ScrollAnimatedElement type="zoomIn" duration={1} delay={0.3}>
            <AIGreeting />
          </ScrollAnimatedElement>
        </div>
      </div>
      
      {/* Menu - positioned absolutely and above frost overlay */}
      <div ref={menuRef} className="relative z-20">
        <AnimatedElement type="slideUp" delay={0.6} duration={0.8}>
          <ExpandableMenu />
        </AnimatedElement>
      </div>
    </div>
  );
};

export default HomeScreen; 