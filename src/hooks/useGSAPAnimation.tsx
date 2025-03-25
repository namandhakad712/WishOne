import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';

interface AnimationOptions {
  type: 
    | 'fadeIn' 
    | 'fadeOut' 
    | 'slideUp' 
    | 'slideDown' 
    | 'slideLeft' 
    | 'slideRight' 
    | 'zoomIn' 
    | 'zoomOut' 
    | 'bounce' 
    | 'pulse' 
    | 'float' 
    | 'rotate' 
    | 'shake' 
    | 'flip' 
    | 'custom';
  delay?: number;
  duration?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
  customAnimation?: gsap.TweenVars;
  shouldAnimate?: boolean;
}

// Hook that can be used with existing refs
export function useGSAPAnimation<T extends HTMLElement>(
  elementRef: RefObject<T>,
  options: AnimationOptions
) {
  const {
    type,
    delay = 0,
    duration = 0.8,
    ease = 'power2.out',
    repeat = 0,
    yoyo = false,
    onComplete,
    customAnimation,
    shouldAnimate = true,
  } = options;

  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current || !shouldAnimate) return;

    const element = elementRef.current;
    
    // Default animation options
    const animationOptions: gsap.TweenVars = {
      duration,
      delay,
      ease,
      repeat,
      yoyo,
      onComplete,
      ...customAnimation,
    };

    // Clear any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Apply different animations based on type
    switch (type) {
      case 'fadeIn':
        gsap.set(element, { opacity: 0 });
        animationRef.current = gsap.to(element, { opacity: 1, ...animationOptions });
        break;
      case 'fadeOut':
        gsap.set(element, { opacity: 1 });
        animationRef.current = gsap.to(element, { opacity: 0, ...animationOptions });
        break;
      case 'slideUp':
        gsap.set(element, { y: 50, opacity: 0 });
        animationRef.current = gsap.to(element, { y: 0, opacity: 1, ...animationOptions });
        break;
      case 'slideDown':
        gsap.set(element, { y: -50, opacity: 0 });
        animationRef.current = gsap.to(element, { y: 0, opacity: 1, ...animationOptions });
        break;
      case 'slideLeft':
        gsap.set(element, { x: 50, opacity: 0 });
        animationRef.current = gsap.to(element, { x: 0, opacity: 1, ...animationOptions });
        break;
      case 'slideRight':
        gsap.set(element, { x: -50, opacity: 0 });
        animationRef.current = gsap.to(element, { x: 0, opacity: 1, ...animationOptions });
        break;
      case 'zoomIn':
        gsap.set(element, { scale: 0.5, opacity: 0 });
        animationRef.current = gsap.to(element, { scale: 1, opacity: 1, ...animationOptions });
        break;
      case 'zoomOut':
        gsap.set(element, { scale: 1.5, opacity: 0 });
        animationRef.current = gsap.to(element, { scale: 1, opacity: 1, ...animationOptions });
        break;
      case 'bounce':
        gsap.set(element, { y: 0 });
        animationRef.current = gsap.to(element, { 
          y: -20, 
          ...animationOptions,
          ease: 'bounce.out',
          repeat: 1,
          yoyo: true
        });
        break;
      case 'pulse':
        gsap.set(element, { scale: 1 });
        animationRef.current = gsap.to(element, {
          scale: 1.05,
          ...animationOptions,
          repeat: 1,
          yoyo: true
        });
        break;
      case 'float':
        animationRef.current = gsap.to(element, {
          y: '-=10',
          ...animationOptions,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        break;
      case 'rotate':
        animationRef.current = gsap.to(element, {
          rotation: 360,
          ...animationOptions,
          ease: 'none',
          repeat: -1
        });
        break;
      case 'shake':
        animationRef.current = gsap.to(element, {
          x: '+=5',
          ...animationOptions,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut'
        });
        break;
      case 'flip':
        gsap.set(element, { rotationY: 90, opacity: 0 });
        animationRef.current = gsap.to(element, { 
          rotationY: 0, 
          opacity: 1, 
          ...animationOptions 
        });
        break;
      case 'custom':
        if (customAnimation) {
          animationRef.current = gsap.to(element, animationOptions);
        }
        break;
      default:
        animationRef.current = gsap.to(element, animationOptions);
    }

    return () => {
      // Clean up animation when component unmounts or dependencies change
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [
    elementRef,
    type,
    delay,
    duration,
    ease,
    repeat,
    yoyo,
    onComplete,
    customAnimation,
    shouldAnimate,
  ]);

  return {
    // Functions to control the animation
    play: () => animationRef.current?.play(),
    pause: () => animationRef.current?.pause(),
    restart: () => animationRef.current?.restart(),
    reverse: () => animationRef.current?.reverse(),
    kill: () => animationRef.current?.kill(),
  };
}

// Convenience hook that creates a ref and applies animation to it
export function useCreateAnimatedRef<T extends HTMLElement>(options: AnimationOptions) {
  const ref = useRef<T>(null);
  const animation = useGSAPAnimation(ref, options);
  
  return {
    ref,
    ...animation,
  };
}

export default useGSAPAnimation; 