import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';

export type AnimationType = 
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
  | 'flip';

interface AnimatedElementProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
  threshold?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  onAnimationComplete?: () => void;
  customAnimation?: gsap.TweenVars;
  staggerChildren?: boolean;
  scrollTrigger?: boolean;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  type = 'fadeIn',
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  ease = 'power2.out',
  repeat = 0,
  yoyo = false,
  threshold = 0.1,
  className = '',
  as: Component = 'div',
  onAnimationComplete,
  customAnimation,
  staggerChildren = false,
  scrollTrigger = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let animation: gsap.core.Tween | gsap.core.Timeline;

    // Default animation options
    const animationOptions: gsap.TweenVars = {
      duration,
      delay,
      ease,
      repeat,
      yoyo,
      onComplete: onAnimationComplete,
      ...customAnimation,
    };

    // Apply different animations based on type
    switch (type) {
      case 'fadeIn':
        gsap.set(element, { opacity: 0 });
        animation = gsap.to(element, { opacity: 1, ...animationOptions });
        break;
      case 'fadeOut':
        gsap.set(element, { opacity: 1 });
        animation = gsap.to(element, { opacity: 0, ...animationOptions });
        break;
      case 'slideUp':
        gsap.set(element, { y: 50, opacity: 0 });
        animation = gsap.to(element, { y: 0, opacity: 1, ...animationOptions });
        break;
      case 'slideDown':
        gsap.set(element, { y: -50, opacity: 0 });
        animation = gsap.to(element, { y: 0, opacity: 1, ...animationOptions });
        break;
      case 'slideLeft':
        gsap.set(element, { x: 50, opacity: 0 });
        animation = gsap.to(element, { x: 0, opacity: 1, ...animationOptions });
        break;
      case 'slideRight':
        gsap.set(element, { x: -50, opacity: 0 });
        animation = gsap.to(element, { x: 0, opacity: 1, ...animationOptions });
        break;
      case 'zoomIn':
        gsap.set(element, { scale: 0.5, opacity: 0 });
        animation = gsap.to(element, { scale: 1, opacity: 1, ...animationOptions });
        break;
      case 'zoomOut':
        gsap.set(element, { scale: 1.5, opacity: 0 });
        animation = gsap.to(element, { scale: 1, opacity: 1, ...animationOptions });
        break;
      case 'bounce':
        gsap.set(element, { y: 0 });
        animation = gsap.to(element, { 
          y: -20, 
          ...animationOptions,
          ease: 'bounce.out',
          repeat: 1,
          yoyo: true
        });
        break;
      case 'pulse':
        gsap.set(element, { scale: 1 });
        animation = gsap.to(element, {
          scale: 1.05,
          ...animationOptions,
          repeat: 1,
          yoyo: true
        });
        break;
      case 'float':
        animation = gsap.to(element, {
          y: '-=10',
          ...animationOptions,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        break;
      case 'rotate':
        animation = gsap.to(element, {
          rotation: 360,
          ...animationOptions,
          ease: 'none',
          repeat: -1
        });
        break;
      case 'shake':
        animation = gsap.to(element, {
          x: '+=5',
          ...animationOptions,
          repeat: 5,
          yoyo: true,
          ease: 'power1.inOut'
        });
        break;
      case 'flip':
        gsap.set(element, { rotationY: 90, opacity: 0 });
        animation = gsap.to(element, { 
          rotationY: 0, 
          opacity: 1, 
          ...animationOptions 
        });
        break;
      default:
        animation = gsap.to(element, animationOptions);
    }

    // Apply stagger animation to children if needed
    if (staggerChildren && element.children.length > 0) {
      gsap.set(element.children, { opacity: 0 });
      gsap.to(element.children, {
        opacity: 1,
        duration,
        delay,
        stagger,
        ease,
      });
    }

    return () => {
      // Clean up animation when component unmounts
      animation.kill();
    };
  }, [
    type,
    delay,
    duration,
    ease,
    repeat,
    yoyo,
    onAnimationComplete,
    customAnimation,
    staggerChildren,
    stagger,
  ]);

  return (
    <Component ref={elementRef} className={className}>
      {children}
    </Component>
  );
};

export default AnimatedElement; 