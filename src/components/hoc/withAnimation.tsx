import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@/contexts/GSAPContext';
import { pageTransitions, uiAnimations, textAnimations, scrollAnimations, specialEffects } from '@/utils/animations';

export type AnimationType = 
  | 'fadeIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'zoomIn' 
  | 'staggerElements'
  | 'buttonHover'
  | 'buttonClick'
  | 'shake'
  | 'pulse'
  | 'fadeInLetters'
  | 'typewriter'
  | 'fadeInOnScroll'
  | 'parallax'
  | 'revealFromMask'
  | 'floatingAnimation'
  | 'rotationAnimation'
  | 'glowingEffect';

interface AnimationOptions {
  animationType: AnimationType;
  delay?: number;
  duration?: number;
  staggerTime?: number;
  animation?: object;
  triggerElement?: string;
  scrollStart?: string;
  speed?: number;
  intensity?: number;
  scale?: number;
  baseColor?: string;
  glowColor?: string;
  amount?: number;
  degrees?: number;
}

interface WithAnimationProps {
  animationOptions?: AnimationOptions;
  className?: string;
  id?: string;
}

const animationMap = {
  fadeIn: pageTransitions.fadeIn,
  slideUp: pageTransitions.slideUp,
  slideDown: pageTransitions.slideDown,
  zoomIn: pageTransitions.zoomIn,
  staggerElements: pageTransitions.staggerElements,
  buttonHover: uiAnimations.buttonHover,
  buttonClick: uiAnimations.buttonClick,
  shake: uiAnimations.shake,
  pulse: uiAnimations.pulse,
  fadeInLetters: textAnimations.fadeInLetters,
  typewriter: textAnimations.typewriter,
  fadeInOnScroll: scrollAnimations.fadeInOnScroll,
  parallax: scrollAnimations.parallax,
  revealFromMask: specialEffects.revealFromMask,
  floatingAnimation: specialEffects.floatingAnimation,
  rotationAnimation: specialEffects.rotationAnimation,
  glowingEffect: specialEffects.glowingEffect,
};

export function withAnimation<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithAnimationProps> {
  const WithAnimation: React.FC<P & WithAnimationProps> = ({ 
    animationOptions, 
    ...props 
  }) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const { gsap } = useGSAP();
    
    useEffect(() => {
      if (!componentRef.current || !animationOptions) return;
      
      const { 
        animationType, 
        delay = 0, 
        duration,
        staggerTime,
        animation = {},
        triggerElement,
        scrollStart,
        speed,
        intensity,
        scale,
        baseColor,
        glowColor,
        amount,
        degrees
      } = animationOptions;
      
      const animationFunc = animationMap[animationType];
      
      if (!animationFunc) {
        console.warn(`Animation type "${animationType}" not found.`);
        return;
      }
      
      let animationInstance;
      
      switch (animationType) {
        case 'fadeIn':
        case 'slideUp':
        case 'slideDown':
        case 'zoomIn':
          animationInstance = animationFunc(componentRef.current as Element, duration, delay);
          break;
        case 'staggerElements':
          if (componentRef.current.children.length > 0) {
            // Convert HTMLCollection to array for compatibility
            const childrenArray = Array.from(componentRef.current.children);
            animationInstance = animationFunc(
              childrenArray as Element[], 
              staggerTime, 
              animation
            );
          }
          break;
        case 'buttonHover':
          const handleMouseEnter = () => {
            animationFunc(componentRef.current as Element);
          };
          componentRef.current.addEventListener('mouseenter', handleMouseEnter);
          return () => {
            componentRef.current?.removeEventListener('mouseenter', handleMouseEnter);
          };
        case 'buttonClick':
          const handleClick = () => {
            animationFunc(componentRef.current as Element);
          };
          componentRef.current.addEventListener('click', handleClick);
          return () => {
            componentRef.current?.removeEventListener('click', handleClick);
          };
        case 'shake':
          animationInstance = animationFunc(componentRef.current as Element, intensity, duration);
          break;
        case 'pulse':
          animationInstance = animationFunc(componentRef.current as Element, scale, duration);
          break;
        case 'fadeInLetters':
          animationInstance = animationFunc(componentRef.current as Element, staggerTime, duration);
          break;
        case 'typewriter':
          animationInstance = animationFunc(componentRef.current as Element, staggerTime);
          break;
        case 'fadeInOnScroll':
          const scrollTrigger = triggerElement ? document.querySelector(triggerElement) : componentRef.current;
          animationInstance = animationFunc(
            componentRef.current as Element, 
            scrollTrigger as Element, 
            scrollStart
          );
          break;
        case 'parallax':
          const parallaxTrigger = triggerElement ? document.querySelector(triggerElement) : componentRef.current;
          animationInstance = animationFunc(
            componentRef.current as Element, 
            parallaxTrigger as Element, 
            speed
          );
          break;
        case 'revealFromMask':
          animationInstance = animationFunc(componentRef.current as Element, duration, delay);
          break;
        case 'floatingAnimation':
          animationInstance = animationFunc(componentRef.current as Element, amount, duration);
          break;
        case 'rotationAnimation':
          animationInstance = animationFunc(componentRef.current as Element, degrees, duration);
          break;
        case 'glowingEffect':
          if (baseColor && glowColor) {
            animationInstance = animationFunc(componentRef.current as Element, baseColor, glowColor, duration);
          }
          break;
        default:
          break;
      }
      
      return () => {
        if (animationInstance) {
          animationInstance.kill();
        }
      };
    }, [animationOptions, gsap]);
    
    return (
      <div ref={componentRef} className={props.className} id={props.id}>
        <Component {...(props as P)} />
      </div>
    );
  };
  
  return WithAnimation;
}

export default withAnimation; 