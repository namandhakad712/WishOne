import React, { useState, useRef } from 'react';
import AnimatedElement from '@/components/AnimatedElement';
import ScrollAnimatedElement from '@/components/ScrollAnimatedElement';
import { useCreateAnimatedRef } from '@/hooks/useGSAPAnimation';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';

const AnimationDemo = () => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Using our custom hook to create an animated element
  const { ref: titleRef, play: playTitleAnimation } = useCreateAnimatedRef<HTMLHeadingElement>({
    type: 'slideDown',
    duration: 1,
    delay: 0.2
  });
  
  // List of available animations
  const basicAnimations = [
    'fadeIn',
    'fadeOut',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'zoomIn',
    'zoomOut',
    'bounce',
    'pulse',
    'float',
    'rotate',
    'shake',
    'flip'
  ];
  
  const scrollAnimations = [
    'fadeIn',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'zoomIn',
    'staggerChildren',
    'reveal',
    'bounce',
    'flip'
  ];
  
  const playSequenceAnimation = () => {
    if (!containerRef.current) return;
    
    const elements = containerRef.current.querySelectorAll('.card');
    const tl = gsap.timeline();
    
    // Reset positions
    gsap.set(elements, { clearProps: 'all' });
    
    // Staggered animation for all cards
    tl.fromTo(
      elements,
      { y: 50, opacity: 0, scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        stagger: 0.1, 
        duration: 0.5,
        ease: 'back.out(1.4)'
      }
    );
    
    // Sequence of different animations on the first few cards
    tl.to(elements[0], { 
      rotation: 360, 
      duration: 1,
      ease: 'power2.inOut'
    }, "+=0.5");
    
    tl.to(elements[1], { 
      scale: 1.2,
      boxShadow: '0 20px 30px rgba(0,0,0,0.2)', 
      duration: 0.5,
      ease: 'power2.out'
    }, "-=0.8");
    
    tl.to(elements[1], { 
      scale: 1,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
      duration: 0.5,
      ease: 'power2.in'
    }, "+=0.5");
    
    tl.to(elements[2], { 
      x: 50, 
      duration: 0.5,
      ease: 'power1.out'
    }, "-=0.8");
    
    tl.to(elements[2], { 
      x: 0, 
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
    
    tl.to(elements[3], { 
      backgroundColor: '#ffd166', 
      color: '#000000',
      duration: 0.5
    }, "-=0.5");
    
    tl.to(elements[3], { 
      backgroundColor: 'white', 
      color: 'inherit',
      duration: 0.5,
      delay: 0.5
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Demo Title */}
        <h1 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        >
          GSAP Animation Showcase
        </h1>
        
        <p className="text-center text-lg mb-10 max-w-2xl mx-auto">
          This page demonstrates the various animation capabilities implemented using 
          GSAP (GreenSock Animation Platform) throughout the application.
        </p>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <Button 
            onClick={() => setIsVisible(!isVisible)} 
            variant="outline" 
            className="bg-white"
          >
            {isVisible ? 'Hide' : 'Show'} Animations
          </Button>
          
          <Button 
            onClick={playTitleAnimation} 
            variant="outline"
            className="bg-white"
          >
            Replay Title Animation
          </Button>
          
          <Button 
            onClick={playSequenceAnimation}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Play Animation Sequence
          </Button>
        </div>
        
        {isVisible && (
          <>
            {/* Basic Animations */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 text-center">Basic Animations</h2>
              <div 
                ref={containerRef} 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {basicAnimations.map((type) => (
                  <AnimatedElement 
                    key={type} 
                    type={type as any}
                    duration={type === 'float' || type === 'rotate' ? 2.5 : 1}
                    className="card bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[140px] text-center transition-all"
                  >
                    <h3 className="text-lg font-medium mb-2 text-gray-800">{type}</h3>
                    <p className="text-sm text-gray-500">Animation Type</p>
                  </AnimatedElement>
                ))}
              </div>
            </div>
            
            {/* Scroll Animations */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-center">Scroll Animations</h2>
              <p className="text-center text-gray-500 mb-8">Scroll down to see these animations trigger.</p>
              
              <div className="flex flex-col gap-20 mb-20">
                {scrollAnimations.map((type, index) => (
                  <ScrollAnimatedElement
                    key={type}
                    type={type as any}
                    duration={1}
                    className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
                    rootMargin="-100px"
                  >
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-medium mb-4 text-purple-600">{type}</h3>
                      <p className="text-gray-600 text-center">
                        This element animates with the <strong>{type}</strong> animation 
                        when it enters the viewport. Scroll animations are perfect for creating
                        engaging page transitions and drawing attention to content as users scroll.
                      </p>
                      
                      {type === 'staggerChildren' && (
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div 
                              key={i} 
                              className="bg-purple-100 p-4 rounded-md text-center flex items-center justify-center"
                            >
                              Item {i}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollAnimatedElement>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnimationDemo; 