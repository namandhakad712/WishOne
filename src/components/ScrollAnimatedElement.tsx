import React, { useEffect, useRef, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';

export type ScrollAnimationType = 
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoomIn'
  | 'staggerChildren'
  | 'reveal'
  | 'bounce'
  | 'flip';

interface ScrollAnimatedElementProps {
  children: ReactNode;
  type?: ScrollAnimationType;
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  stagger?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  customAnimation?: gsap.TweenVars;
  rootMargin?: string;
}

const ScrollAnimatedElement: React.FC<ScrollAnimatedElementProps> = ({
  children,
  type = 'fadeIn',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  stagger = 0.1,
  className = '',
  as: Component = 'div',
  customAnimation,
  rootMargin = '0px',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [inViewRef, inView] = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  const setRefs = (node: HTMLDivElement | null) => {
    // Set both refs - the one from useInView and our own
    inViewRef(node);
    elementRef.current = node;
  };

  useEffect(() => {
    if (!elementRef.current || !inView) return;

    const element = elementRef.current;
    const animationOptions: gsap.TweenVars = {
      duration,
      delay,
      ease: 'power2.out',
      ...customAnimation,
    };

    const childElements = element.children;

    switch (type) {
      case 'fadeIn':
        gsap.fromTo(
          element,
          { opacity: 0 },
          { opacity: 1, ...animationOptions }
        );
        break;
      case 'slideUp':
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ...animationOptions }
        );
        break;
      case 'slideDown':
        gsap.fromTo(
          element,
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, ...animationOptions }
        );
        break;
      case 'slideLeft':
        gsap.fromTo(
          element,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, ...animationOptions }
        );
        break;
      case 'slideRight':
        gsap.fromTo(
          element,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, ...animationOptions }
        );
        break;
      case 'zoomIn':
        gsap.fromTo(
          element,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, ...animationOptions }
        );
        break;
      case 'staggerChildren':
        // Animate each child with a stagger effect
        if (childElements.length > 0) {
          gsap.fromTo(
            childElements,
            { y: 20, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              stagger, 
              duration, 
              delay,
              ease: 'power2.out' 
            }
          );
        }
        break;
      case 'reveal':
        // Reveal from left to right (like a curtain)
        gsap.set(element, { overflow: 'hidden' });
        const revealer = document.createElement('div');
        revealer.style.position = 'absolute';
        revealer.style.top = '0';
        revealer.style.left = '0';
        revealer.style.width = '100%';
        revealer.style.height = '100%';
        revealer.style.backgroundColor = '#ffffff';
        revealer.style.zIndex = '1';
        element.style.position = 'relative';
        element.appendChild(revealer);
        
        gsap.to(revealer, { 
          x: '100%', 
          duration: duration,
          ease: 'power2.inOut',
          onComplete: () => {
            element.removeChild(revealer);
            element.style.overflow = '';
          }
        });
        break;
      case 'bounce':
        gsap.fromTo(
          element,
          { y: -20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            ease: 'bounce.out',
            duration: duration * 1.5,
            delay 
          }
        );
        break;
      case 'flip':
        gsap.fromTo(
          element,
          { rotationY: 90, opacity: 0 },
          { 
            rotationY: 0, 
            opacity: 1, 
            duration, 
            delay,
            ease: 'power3.out' 
          }
        );
        break;
      default:
        if (customAnimation) {
          gsap.to(element, animationOptions);
        }
    }
  }, [inView, type, duration, delay, customAnimation, stagger]);

  return (
    <Component ref={setRefs} className={className}>
      {children}
    </Component>
  );
};

export default ScrollAnimatedElement; 