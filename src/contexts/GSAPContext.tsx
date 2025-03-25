import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface GSAPContextProps {
  gsap: typeof gsap;
  animate: (element: Element | string, animation: object, options?: object) => gsap.core.Tween;
  fadeIn: (element: Element | string, duration?: number, delay?: number) => gsap.core.Tween;
  fadeOut: (element: Element | string, duration?: number, delay?: number) => gsap.core.Tween;
  slideIn: (element: Element | string, from?: string, duration?: number, delay?: number) => gsap.core.Tween;
  staggerElements: (elements: Element[] | string, animation: object, staggerTime?: number) => gsap.core.Tween;
  createScrollTrigger: (trigger: Element | string, animation: gsap.core.Tween | gsap.core.Timeline, options?: object) => ScrollTrigger;
}

const GSAPContext = createContext<GSAPContextProps | null>(null);

export const useGSAP = () => {
  const context = useContext(GSAPContext);
  if (!context) {
    throw new Error('useGSAP must be used within a GSAPProvider');
  }
  return context;
};

interface GSAPProviderProps {
  children: ReactNode;
}

export const GSAPProvider: React.FC<GSAPProviderProps> = ({ children }) => {
  // Utility animation functions
  const animate = (element: Element | string, animation: object, options: object = {}) => {
    return gsap.to(element, { ...animation, ...options });
  };

  const fadeIn = (element: Element | string, duration = 0.5, delay = 0) => {
    return gsap.fromTo(
      element,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration, delay, ease: 'power2.inOut' }
    );
  };

  const fadeOut = (element: Element | string, duration = 0.5, delay = 0) => {
    return gsap.to(element, { 
      autoAlpha: 0, 
      duration, 
      delay, 
      ease: 'power2.inOut' 
    });
  };

  const slideIn = (element: Element | string, from = 'bottom', duration = 0.7, delay = 0) => {
    const directions = {
      left: { x: -50, y: 0 },
      right: { x: 50, y: 0 },
      top: { x: 0, y: -50 },
      bottom: { x: 0, y: 50 },
    };
    
    const direction = directions[from as keyof typeof directions] || directions.bottom;
    
    return gsap.fromTo(
      element,
      { autoAlpha: 0, ...direction },
      { autoAlpha: 1, x: 0, y: 0, duration, delay, ease: 'power2.out' }
    );
  };

  const staggerElements = (elements: Element[] | string, animation: object, staggerTime = 0.1) => {
    return gsap.to(elements, { 
      ...animation,
      stagger: staggerTime,
      ease: 'power2.inOut' 
    });
  };

  const createScrollTrigger = (trigger: Element | string, animation: gsap.core.Tween | gsap.core.Timeline, options: object = {}) => {
    return ScrollTrigger.create({
      trigger,
      animation,
      toggleActions: 'play none none reverse',
      start: 'top 80%',
      ...options
    });
  };

  const value = {
    gsap,
    animate,
    fadeIn,
    fadeOut,
    slideIn,
    staggerElements,
    createScrollTrigger,
  };

  return <GSAPContext.Provider value={value}>{children}</GSAPContext.Provider>;
}; 