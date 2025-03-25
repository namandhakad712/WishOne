import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/Auth/AuthForm";
import { useSupabase } from "@/contexts/SupabaseContext";
import { gsap } from "gsap";

export default function LoginPage() {
  const { isAuthenticated } = useSupabase();
  const navigate = useNavigate();
  
  // Refs for animation targets
  const pageRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const bgElements = useRef<(HTMLDivElement | null)[]>([]);
  
  // Handle authentication redirects
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  // Initialize animations
  useEffect(() => {
    // Page entrance animation
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 1,
          ease: "power2.out"
        }
      );
    }
    
    // Form container animation
    if (formContainerRef.current) {
      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)"
        }
      );
    }
    
    // Background elements animations
    bgElements.current.forEach((el, index) => {
      if (!el) return;
      
      // Create random animation paths
      const xOffset = 20 + (index * 5);
      const yOffset = 30 + (index * 3);
      const duration = 15 + (index * 3);
      
      // Initial state
      gsap.set(el, { opacity: 0, scale: 0.8 });
      
      // Fade in
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        delay: 0.2 * index,
        ease: "power2.out"
      });
      
      // Continuous floating animation
      gsap.to(el, {
        x: `+=${xOffset}`,
        y: `+=${yOffset}`,
        duration: duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.5
      });
    });
    
    // Cleanup
    return () => {
      gsap.killTweensOf(pageRef.current);
      gsap.killTweensOf(formContainerRef.current);
      bgElements.current.forEach(el => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={el => bgElements.current[0] = el}
          className="absolute w-96 h-96 rounded-full bg-purple-300/30 blur-3xl"
          style={{ top: '10%', right: '5%' }}
        />
        <div 
          ref={el => bgElements.current[1] = el}
          className="absolute w-80 h-80 rounded-full bg-pink-300/30 blur-3xl"
          style={{ bottom: '10%', left: '5%' }}
        />
        <div 
          ref={el => bgElements.current[2] = el}
          className="absolute w-64 h-64 rounded-full bg-blue-300/30 blur-3xl"
          style={{ top: '40%', left: '25%' }}
        />
      </div>
      
      <div ref={formContainerRef} className="w-full max-w-md relative z-10">
        <AuthForm />
      </div>
    </div>
  );
} 