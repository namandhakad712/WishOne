import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { Gift, Cake, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BirthdayPartyLauncherProps {
  personName: string;
  age?: number;
  onClose?: () => void;
}

export const BirthdayPartyLauncher: React.FC<BirthdayPartyLauncherProps> = ({ 
  personName, 
  age, 
  onClose 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Setup entrance animations
  useEffect(() => {
    const container = containerRef.current;
    const message = messageRef.current;
    const icons = iconsRef.current;
    
    if (container && message && icons) {
      // Container entrance animation
      gsap.fromTo(container, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
      
      // Message entrance animation
      gsap.fromTo(message,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "back.out" }
      );
      
      // Icons animation
      gsap.fromTo(icons.children,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.15, 
          delay: 0.5, 
          ease: "elastic.out(1, 0.5)" 
        }
      );
      
      // Create floating animation for icons
      icons.childNodes.forEach((icon, index) => {
        gsap.to(icon, {
          y: "random(-8, 8)", 
          x: "random(-5, 5)",
          rotation: "random(-10, 10)",
          duration: "random(1.5, 2.5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2
        });
      });
      
      // Button pulse animation
      gsap.to(".celebrate-btn", {
        scale: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    return () => {
      gsap.killTweensOf(container);
      gsap.killTweensOf(message);
      gsap.killTweensOf(icons?.children);
      gsap.killTweensOf(".celebrate-btn");
    };
  }, []);
  
  // Function to launch confetti
  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Position the canvas to cover the entire viewport
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    
    // Set canvas dimensions to match window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true
    });
    
    // First burst - center explosion
    myConfetti({
      particleCount: 250,
      spread: 360,
      origin: { y: 0.5, x: 0.5 },
      gravity: 0.8,
      scalar: 1.5
    });
    
    // Second burst after a delay - from left
    setTimeout(() => {
      myConfetti({
        particleCount: 150,
        angle: 60,
        spread: 120,
        origin: { x: 0, y: 0.5 },
        gravity: 1,
        scalar: 1.2
      });
    }, 250);
    
    // Third burst after another delay - from right
    setTimeout(() => {
      myConfetti({
        particleCount: 150,
        angle: 120,
        spread: 120,
        origin: { x: 1, y: 0.5 },
        gravity: 1,
        scalar: 1.2
      });
    }, 400);
    
    // Fourth burst - from bottom
    setTimeout(() => {
      myConfetti({
        particleCount: 150,
        angle: 0,
        spread: 180,
        origin: { x: 0.5, y: 1 },
        gravity: 0.7,
        scalar: 1.5
      });
    }, 600);
    
    // Top bursts
    setTimeout(() => {
      myConfetti({
        particleCount: 130,
        angle: 180,
        spread: 180,
        origin: { x: 0.3, y: 0 },
        gravity: 1,
        scalar: 1.2
      });
      
      myConfetti({
        particleCount: 130,
        angle: 180,
        spread: 180,
        origin: { x: 0.7, y: 0 },
        gravity: 1,
        scalar: 1.2
      });
    }, 800);
    
    // Cannon shooting
    let end = Date.now() + 4000;
    let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff'];
    
    (function frame() {
      myConfetti({
        particleCount: 6,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
        colors: colors,
        ticks: 300
      });
      
      myConfetti({
        particleCount: 6,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
        colors: colors,
        ticks: 300
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };
  
  // Handle celebrate button click
  const handleCelebrate = () => {
    setIsCelebrating(true);
    launchConfetti();
    
    // Add fullscreen message animation
    const wishElement = document.createElement('div');
    wishElement.className = 'fixed inset-0 flex items-center justify-center pointer-events-none z-50';
    wishElement.innerHTML = `
      <div class="text-center px-4 py-6 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl">
        <h1 class="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 drop-shadow-lg">
          Happy Birthday To ${personName}!
        </h1>
        <p class="mt-4 text-2xl font-medium text-purple-700 dark:text-purple-300">
          ${age ? `${age} years of awesome!` : 'Make a wish!'}
        </p>
      </div>
    `;
    document.body.appendChild(wishElement);
    
    // Animate the wish with GSAP
    gsap.fromTo(wishElement.firstElementChild,
      { scale: 0.5, opacity: 0, y: 50 },
      { 
        scale: 1, 
        opacity: 1,
        y: 0,
        duration: 1.2, 
        ease: "elastic.out(1, 0.5)",
        onComplete: () => {
          gsap.to(wishElement.firstElementChild, {
            opacity: 0,
            scale: 1.5,
            y: -30,
            duration: 1.5,
            delay: 3,
            ease: "power2.out",
            onComplete: () => {
              document.body.removeChild(wishElement);
            }
          });
        }
      }
    );
    
    // Show a more celebratory message
    if (messageRef.current) {
      gsap.to(messageRef.current, {
        scale: 1.1,
        color: "#FF1493",
        textShadow: "0 0 7px rgba(255,105,180,0.7)",
        duration: 0.5
      });
      
      setTimeout(() => {
        gsap.to(messageRef.current, {
          scale: 1,
          duration: 0.5
        });
      }, 1000);
    }
  };
  
  // Handle close animation
  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          if (onClose) onClose();
        }
      });
    }
  };
  
  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 9999 }}
      />
      
      <div 
        ref={containerRef}
        className="fixed bottom-8 right-8 bg-white/95 dark:bg-slate-800/95 p-5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 max-w-md"
      >
        <div ref={messageRef} className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {isCelebrating ? '🎉 HAPPY BIRTHDAY! 🎉' : "It's a Birthday!"}
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {isCelebrating 
              ? `Wishing ${personName} an amazing ${age ? `${age}${getSuffix(age)} ` : ''}birthday!`
              : `${personName} has a birthday today${age ? ` and turns ${age}` : ''}!`
            }
          </p>
        </div>
        
        <div ref={iconsRef} className="flex justify-center gap-4 mb-5">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
            <Gift className="h-6 w-6 text-pink-500" />
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Cake className="h-6 w-6 text-blue-500" />
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Music className="h-6 w-6 text-green-500" />
          </div>
        </div>
        
        <div className="flex justify-center gap-3">
          {!isCelebrating ? (
            <Button 
              className="celebrate-btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              onClick={handleCelebrate}
            >
              Celebrate!
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

// Helper function to get the correct suffix for the age
const getSuffix = (age: number): string => {
  if (age % 100 >= 11 && age % 100 <= 13) {
    return 'th';
  }
  
  switch (age % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default BirthdayPartyLauncher; 