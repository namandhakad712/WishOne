import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

// Register plugins
gsap.registerPlugin(CustomEase);

// Custom easing functions
CustomEase.create('bounce', 'M0,0 C0.14,0 0.27,0.3 0.3,0.5 0.33,0.71 0.24,1.02 0.5,1 0.71,0.98 0.75,0.83 1,1');
CustomEase.create('elastic', 'M0,0 C0.12,0 0.16,0.17 0.2,0.28 0.27,0.45 0.27,0.78 0.48,0.8 0.7,0.83 0.72,0.55 0.82,0.79 0.88,0.93 0.96,1 1,1');

// Page transition animations
export const pageTransitions = {
  fadeIn: (element: Element | string, duration = 0.8) => {
    return gsap.fromTo(
      element,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration, 
        ease: 'power2.inOut',
        clearProps: 'opacity' 
      }
    );
  },
  
  slideUp: (element: Element | string, duration = 0.8, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out',
        clearProps: 'all' 
      }
    );
  },
  
  slideDown: (element: Element | string, duration = 0.8, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: -30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out',
        clearProps: 'all' 
      }
    );
  },
  
  zoomIn: (element: Element | string, duration = 0.8, delay = 0) => {
    return gsap.fromTo(
      element,
      { scale: 0.9, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out',
        clearProps: 'all' 
      }
    );
  },
  
  staggerElements: (elements: Element[] | string, staggerTime = 0.1, animation = {}) => {
    return gsap.to(elements, { 
      stagger: staggerTime,
      ...animation,
      ease: 'power2.inOut' 
    });
  }
};

// Button and UI element animations
export const uiAnimations = {
  buttonHover: (element: Element | string) => {
    return gsap.to(element, { 
      scale: 1.05, 
      duration: 0.3, 
      ease: 'power1.out' 
    });
  },
  
  buttonClick: (element: Element | string) => {
    const tl = gsap.timeline();
    tl.to(element, { 
      scale: 0.95, 
      duration: 0.1, 
      ease: 'power1.inOut' 
    }).to(element, { 
      scale: 1, 
      duration: 0.2, 
      ease: 'elastic.out(1, 0.3)' 
    });
    return tl;
  },
  
  shake: (element: Element | string, intensity = 5, duration = 0.5) => {
    return gsap.to(element, {
      x: `random(-${intensity}, ${intensity})`,
      y: `random(-${intensity}, ${intensity})`,
      duration: 0.1,
      repeat: Math.floor(duration / 0.1),
      repeatRefresh: true,
      ease: 'power1.inOut',
      clearProps: 'x,y'
    });
  },
  
  pulse: (element: Element | string, scale = 1.05, duration = 0.5) => {
    return gsap.to(element, {
      scale,
      duration: duration / 2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
      clearProps: 'scale'
    });
  }
};

// Text animations
export const textAnimations = {
  fadeInLetters: (element: Element | string, staggerTime = 0.03, duration = 0.5) => {
    const letters = gsap.utils.toArray(`${element} > *`);
    return gsap.fromTo(
      letters,
      { opacity: 0, y: 10 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: staggerTime, 
        duration, 
        ease: 'power2.out',
        clearProps: 'opacity,y' 
      }
    );
  },
  
  typewriter: (element: Element | string, staggerTime = 0.05) => {
    const chars = gsap.utils.toArray(`${element} > *`);
    return gsap.fromTo(
      chars,
      { opacity: 0, display: 'none' },
      { 
        opacity: 1, 
        display: 'inline-block', 
        stagger: staggerTime, 
        ease: 'none',
        clearProps: 'opacity' 
      }
    );
  }
};

// Scroll animations
export const scrollAnimations = {
  fadeInOnScroll: (element: Element | string, trigger: Element | string, start = 'top 80%') => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none reverse'
      }
    });
    
    tl.fromTo(
      element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    return tl;
  },
  
  parallax: (element: Element | string, trigger: Element | string, speed = 0.5) => {
    return gsap.to(element, {
      y: `${speed * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
};

// Special effects
export const specialEffects = {
  revealFromMask: (element: Element | string, duration = 1, delay = 0) => {
    // First, we wrap the element in a container with overflow hidden
    const parent = (element as Element).parentNode as Element;
    gsap.set(parent, { overflow: 'hidden' });
    
    return gsap.fromTo(
      element,
      { xPercent: -100 },
      { 
        xPercent: 0, 
        duration, 
        delay,
        ease: 'power2.inOut' 
      }
    );
  },
  
  floatingAnimation: (element: Element | string, amount = 10, duration = 2) => {
    return gsap.to(element, {
      y: `-=${amount}`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  },
  
  rotationAnimation: (element: Element | string, degrees = 360, duration = 20) => {
    return gsap.to(element, {
      rotation: degrees,
      duration,
      repeat: -1,
      ease: 'none'
    });
  },
  
  glowingEffect: (element: Element | string, baseColor: string, glowColor: string, duration = 1.5) => {
    return gsap.to(element, {
      boxShadow: `0 0 20px ${glowColor}`,
      duration: duration / 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }
}; 