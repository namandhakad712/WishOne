import React, { useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Home,
  MessageSquare,
} from "lucide-react";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";
import { gsap } from "gsap";

interface NavigationBarProps {
  onHomeClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
}

const NavigationBar = ({
  onHomeClick = () => {},
  onChatClick = () => {},
  onProfileClick = () => {},
}: NavigationBarProps) => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const homeButtonRef = useRef<HTMLButtonElement>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  
  // Apply animation to the navbar
  const { play } = useGSAPAnimation(navbarRef, {
    type: 'slideUp',
    delay: 0.3,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Apply hover animations to the buttons
  useEffect(() => {
    if (!homeButtonRef.current || !chatButtonRef.current || !profileButtonRef.current) return;

    // Create hover animations for buttons
    const createHoverAnimation = (buttonRef: React.RefObject<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      // Hover in animation
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.15,
          duration: 0.3,
          ease: 'back.out(1.5)'
        });
      });

      // Hover out animation
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      // Click animation
      button.addEventListener('click', () => {
        const tl = gsap.timeline();
        tl.to(button, {
          scale: 0.9,
          duration: 0.1,
          ease: 'power2.in'
        }).to(button, {
          scale: 1.15,
          duration: 0.2,
          ease: 'back.out(1.5)'
        }).to(button, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
          delay: 0.1
        });
      });
    };

    // Apply animations to all buttons
    createHoverAnimation(homeButtonRef);
    createHoverAnimation(chatButtonRef);
    createHoverAnimation(profileButtonRef);

    // Initial staggered animation for buttons
    gsap.fromTo(
      [homeButtonRef.current, chatButtonRef.current, profileButtonRef.current],
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.1,
        duration: 0.5,
        delay: 0.5,
        ease: 'back.out(1.5)'
      }
    );
  }, []);

  return (
    <div 
      ref={navbarRef} 
      className="w-full bg-[#e8eeeb] rounded-full py-3 px-6 flex justify-between items-center shadow-md"
    >
      <button
        ref={homeButtonRef}
        onClick={onHomeClick}
        className="p-2 text-[#0f3c2d] hover:text-[#0a2a1f] transition-colors"
      >
        <Home className="w-5 h-5" />
      </button>

      <button
        ref={chatButtonRef}
        onClick={onChatClick}
        className="p-2 text-[#0f3c2d] hover:text-[#0a2a1f] transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <button
        ref={profileButtonRef}
        onClick={onProfileClick}
        className="p-2 text-[#0f3c2d] hover:text-[#0a2a1f] transition-colors"
      >
        <User className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NavigationBar;
