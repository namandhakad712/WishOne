import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle, User, Grid, X, Plus } from 'lucide-react';
import { gsap } from 'gsap';

const BottomNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for animation targets
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuIconRef = useRef<HTMLDivElement>(null);
  
  // Calculate positions for a semi-circle arrangement (keeping the same positioning)
  const radius = 120; // Distance from center button
  const calculatePosition = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.sin(radian);
    const y = radius * Math.cos(radian);
    return { x, y };
  };

  // Position for each menu item (keeping the exact same positions)
  const leftPosition = calculatePosition(270); // Left item at 270 degrees
  const topPosition = calculatePosition(360); // Top item at 360 degrees
  const rightPosition = calculatePosition(450); // Right item at 450 degrees
  
  // Create particles on button click
  const createParticles = () => {
    if (!mainButtonRef.current) return;
    
    // Get the button element's position information
    const buttonRect = mainButtonRef.current.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Create 20 particles
    for (let i = 0; i < 20; i++) {
      // Create a particle element
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 3-8px (reduced from 5-15px)
      const size = Math.random() * 5 + 3;
      
      // Random color from purple palette
      const colors = ['#9333EA', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Style the particle
      Object.assign(particle.style, {
        position: 'fixed',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '5', // Lower z-index to place behind the button (which has z-10)
        left: `${buttonCenterX}px`,
        top: `${buttonCenterY}px`,
        transform: 'translate(-50%, -50%)'
      });
      
      // Add to document
      document.body.appendChild(particle);
      
      // Animate the particle
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: Math.random() * 1.2 + 0.3, // Reduced scale factor
        duration: Math.random() * 1 + 0.5,
        ease: 'power2.out',
        onComplete: () => {
          // Remove particle from DOM when animation completes
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    }
  };
  
  // Handle menu toggle with animations
  const toggleMenu = () => {
    const newState = !isOpen;
    
    // If opening the menu, animate the grid dots first
    if (!isOpen && menuIconRef.current) {
      const dots = menuIconRef.current.querySelectorAll('.grid-dot');
      const centerDot = menuIconRef.current.querySelector('.center-dot');
      
      // Animate the dots outward
      gsap.to(dots, {
        scale: 1.5,
        opacity: 0,
        x: (i, el) => {
          const isLeft = el.classList.contains('left-dot');
          const isTop = el.classList.contains('top-dot');
          return isLeft ? -15 : 15;
        },
        y: (i, el) => {
          const isTop = el.classList.contains('top-dot');
          return isTop ? -15 : 15;
        },
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out"
      });
      
      // Animate the center dot
      gsap.to(centerDot, {
        scale: 2,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Actually update the state after animation completes
          setIsOpen(newState);
        }
      });
    } else {
      // Just close the menu immediately if we're closing
      setIsOpen(newState);
    }
    
    // Main button animation
    if (mainButtonRef.current) {
      gsap.to(mainButtonRef.current, {
        rotate: newState ? 45 : 0,
        scale: newState ? 1.1 : 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.7)"
      });
    }
    
    // Create particles on toggle
    createParticles();
  };
  
  const handleOptionClick = (path: string) => {
    // Click animation
    const clickedItem = menuItemRefs.current.find(ref => 
      ref?.getAttribute('data-path') === path
    );
    
    if (clickedItem) {
      gsap.to(clickedItem, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          navigate(path);
          setIsOpen(false);
        }
      });
    } else {
      navigate(path);
      setIsOpen(false);
    }
  };
  
  // Setup hover animations
  useEffect(() => {
    // Setup hover animations for menu items
    menuItemRefs.current.forEach(item => {
      if (item) {
        // Create hover animation
        const enterHandler = () => {
          gsap.to(item, {
            scale: 1.1,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: "power1.out"
          });
        };
        
        const leaveHandler = () => {
          gsap.to(item, {
            scale: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: "power1.out"
          });
        };
        
        item.addEventListener('mouseenter', enterHandler);
        item.addEventListener('mouseleave', leaveHandler);
      }
    });
    
    // Hover animation for main button
    const mainButton = mainButtonRef.current;
    if (mainButton) {
      const enterHandler = () => {
        gsap.to(mainButton, {
          scale: 1.05,
          duration: 0.3,
          ease: "power1.out"
        });
      };
      
      const leaveHandler = () => {
        gsap.to(mainButton, {
          scale: 1,
          duration: 0.3,
          ease: "power1.out"
        });
      };
      
      const downHandler = () => {
        gsap.to(mainButton, {
          scale: 0.95,
          duration: 0.1
        });
      };
      
      const upHandler = () => {
        gsap.to(mainButton, {
          scale: 1.05,
          duration: 0.1
        });
      };
      
      mainButton.addEventListener('mouseenter', enterHandler);
      mainButton.addEventListener('mouseleave', leaveHandler);
      mainButton.addEventListener('mousedown', downHandler);
      mainButton.addEventListener('mouseup', upHandler);
    }
  }, [isOpen]);
  
  // Animate menu items when visibility changes
  useEffect(() => {
    if (isOpen) {
      // Animate items in
      menuItemRefs.current.forEach((item, index) => {
        if (item) {
          // Reset initial style
          gsap.set(item, { 
            opacity: 0, 
            scale: 0,
            y: 20,
            display: 'flex' 
          });
          
          // Animate in
          gsap.to(item, { 
            opacity: 1, 
            scale: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          });
        }
      });
    } else {
      // Animate items out
      menuItemRefs.current.forEach((item, index) => {
        if (item) {
          gsap.to(item, {
      opacity: 0,
            scale: 0,
            duration: 0.3,
            delay: (menuItemRefs.current.length - 1 - index) * 0.05,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(item, { display: 'none' });
            }
          });
        }
      });
    }
  }, [isOpen]);

  // Add useEffect for grid icon animation
  useEffect(() => {
    const menuIcon = menuIconRef.current;
    if (!menuIcon) return;
    
    // Get all grid dots
    const dots = menuIcon.querySelectorAll('.grid-dot');
    const centerDot = menuIcon.querySelector('.center-dot');
    
    // Set up hover animation
    const handleMouseEnter = () => {
      gsap.to(dots, {
        scale: 1.2,
        rotate: 45,
        stagger: 0.05,
        duration: 0.3,
        ease: "back.out(1.5)"
      });
      
      gsap.to(centerDot, {
        scale: 1.5,
        backgroundColor: "#f0abfc", // Light purple color
        duration: 0.3
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(dots, {
        scale: 1,
        rotate: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: "power1.out"
      });
      
      gsap.to(centerDot, {
        scale: 1,
        backgroundColor: "white",
        duration: 0.3
      });
    };
    
    // Add event listeners to parent button
    const parentButton = menuIcon.closest('button');
    if (parentButton) {
      parentButton.addEventListener('mouseenter', handleMouseEnter);
      parentButton.addEventListener('mouseleave', handleMouseLeave);
      
      // Cleanup
      return () => {
        parentButton.removeEventListener('mouseenter', handleMouseEnter);
        parentButton.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-8 z-50">
      <div className="relative">
        {/* Menu Items */}
        <div
          ref={el => menuItemRefs.current[0] = el}
          data-path="/calendar"
          className="absolute bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:bg-white/80 transition-colors duration-300"
                style={{ 
                  bottom: `${leftPosition.y}px`, 
                  left: `${leftPosition.x}px`,
                  transform: 'translate(-50%, 50%)',
            opacity: 0,
            scale: 0,
            display: 'none'
                }}
                onClick={() => handleOptionClick('/calendar')}
              >
                  <div className="text-green-500 mb-1 bg-green-100/50 p-2 rounded-full">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Calendar</span>
                </div>

        <div
          ref={el => menuItemRefs.current[1] = el}
          data-path="/chat"
          className="absolute bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:bg-white/80 transition-colors duration-300"
                style={{ 
                  bottom: `${topPosition.y}px`, 
                  left: `${topPosition.x}px`,
                  transform: 'translate(-50%, 50%)',
            opacity: 0,
            scale: 0,
            display: 'none'
                }}
                onClick={() => handleOptionClick('/chat')}
              >
                  <div className="text-purple-500 mb-1 bg-purple-100/50 p-2 rounded-full">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Chat</span>
                </div>

        <div
          ref={el => menuItemRefs.current[2] = el}
          data-path="/profile"
          className="absolute bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:bg-white/80 transition-colors duration-300"
                style={{ 
                  bottom: `${rightPosition.y}px`, 
                  left: `${rightPosition.x}px`,
                  transform: 'translate(-50%, 50%)',
            opacity: 0,
            scale: 0, 
            display: 'none'
                }}
                onClick={() => handleOptionClick('/profile')}
              >
                  <div className="text-yellow-500 mb-1 bg-yellow-100/50 p-2 rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Profile</span>
                </div>

        {/* Main Menu Button - Glassmorphic Style */}
        <button
          ref={mainButtonRef}
          className="bg-purple-600/80 backdrop-blur-md rounded-xl p-4 shadow-lg text-white z-10 relative w-[56px] h-[56px] flex items-center justify-center border border-white/40 hover:bg-purple-700/90 transition-colors duration-300"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div ref={menuIconRef} className="w-6 h-6 relative">
              <div className="grid-dot top-dot left-dot absolute top-0 left-0 w-[7px] h-[7px] bg-white rounded-sm transform origin-center transition-all duration-300"></div>
              <div className="grid-dot top-dot absolute top-0 right-0 w-[7px] h-[7px] bg-white rounded-sm transform origin-center transition-all duration-300"></div>
              <div className="grid-dot left-dot absolute bottom-0 left-0 w-[7px] h-[7px] bg-white rounded-sm transform origin-center transition-all duration-300"></div>
              <div className="grid-dot absolute bottom-0 right-0 w-[7px] h-[7px] bg-white rounded-sm transform origin-center transition-all duration-300"></div>
              <div className="center-dot absolute top-1/2 left-1/2 w-[5px] h-[5px] bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 origin-center transition-all duration-300"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation; 