import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Heart, Calendar, Gift, MessageCircle, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import AnimatedElement from "./AnimatedElement";

interface WelcomeWindowProps {
  onClose: () => void;
}

const WelcomeWindow: React.FC<WelcomeWindowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    {
      title: "Welcome to WishOne!",
      description: "Your personal birthday companion and emotional support assistant.",
      icon: <Heart className="h-12 w-12 text-pink-500" />,
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop",
      color: "from-pink-500/20 to-purple-500/20"
    },
    {
      title: "Never Miss a Birthday",
      description: "Keep track of all your loved ones' special days in one beautiful place.",
      icon: <Calendar className="h-12 w-12 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=500&auto=format&fit=crop",
      color: "from-purple-500/20 to-blue-500/20"
    },
    {
      title: "Personalized Wishes",
      description: "Get help creating heartfelt birthday messages for any relationship.",
      icon: <Gift className="h-12 w-12 text-green-500" />,
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop",
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      title: "Emotional Support",
      description: "Chat with your AI companion whenever you need someone to talk to.",
      icon: <MessageCircle className="h-12 w-12 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=500&auto=format&fit=crop",
      color: "from-blue-500/20 to-indigo-500/20"
    },
  ];
  
  // Initial animation when component mounts
  useEffect(() => {
    if (!containerRef.current) return;
    
    const tl = gsap.timeline();
    
    // Animate the background overlay
    tl.fromTo(
      containerRef.current, 
      { backgroundColor: 'rgba(0, 0, 0, 0)' }, 
      { backgroundColor: 'rgba(0, 0, 0, 0.5)', duration: 0.4 }
    );
    
    // Animate the modal
    tl.fromTo(
      contentRef.current, 
      { y: 50, opacity: 0, scale: 0.9 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
      "-=0.2"
    );
    
    // Animate the background image
    tl.fromTo(
      bgRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
      "-=0.3"
    );
    
    return () => {
      tl.kill();
    };
  }, []);
  
  // Animate step changes
  useEffect(() => {
    if (!contentRef.current) return;
    
    const content = contentRef.current;
    const textElements = content.querySelectorAll('.animate-text');
    const imageElement = content.querySelector('.animate-image');
    const buttonElements = content.querySelectorAll('.animate-button');
    
    // Create new timeline for step transitions
    const tl = gsap.timeline();
    
    // Animate out previous step content
    tl.to(textElements, { 
      opacity: 0, 
      y: direction > 0 ? -20 : 20, 
      duration: 0.3,
      stagger: 0.05
    });
    
    // Animate out image
    tl.to(imageElement, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3
    }, "-=0.2");
    
    // Reset positions after fadeout
    tl.set(textElements, { 
      opacity: 0, 
      y: direction > 0 ? 20 : -20
    });
    
    tl.set(imageElement, {
      opacity: 0,
      scale: 1.1
    });
    
    // Animate in new content
    tl.to(textElements, { 
      opacity: 1, 
      y: 0, 
      duration: 0.4,
      stagger: 0.05
    });
    
    tl.to(imageElement, {
      opacity: 1,
      scale: 1,
      duration: 0.5
    }, "-=0.3");
    
    // Bounce buttons slightly
    tl.fromTo(buttonElements, 
      { y: 5, opacity: 0.8 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' },
      "-=0.2"
    );
    
    return () => {
      tl.kill();
    };
  }, [currentStep, direction]);
  
  const handleNextStep = () => {
    console.log("Next button clicked, current step:", currentStep);
    setDirection(1);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create exit animation
      const tl = gsap.timeline({ onComplete: onClose });
      
      // Animate the modal out
      tl.to(contentRef.current, { 
        y: 20, 
        opacity: 0, 
        scale: 0.95, 
        duration: 0.4, 
        ease: 'power2.in' 
      });
      
      // Fade out the overlay
      tl.to(containerRef.current, { 
        backgroundColor: 'rgba(0, 0, 0, 0)', 
        duration: 0.3 
      }, "-=0.2");
    }
  };
  
  const handlePrevStep = () => {
    console.log("Previous button clicked, current step:", currentStep);
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleClose = () => {
    // Create exit animation
    const tl = gsap.timeline({ onComplete: onClose });
    
    // Animate the modal out
    tl.to(contentRef.current, { 
      y: 20, 
      opacity: 0, 
      scale: 0.95, 
      duration: 0.4, 
      ease: 'power2.in' 
    });
    
    // Fade out the overlay
    tl.to(containerRef.current, { 
      backgroundColor: 'rgba(0, 0, 0, 0)', 
      duration: 0.3 
    }, "-=0.2");
  };
  
  const currentStepData = steps[currentStep];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center z-50 p-6 bg-black/50 backdrop-blur-sm"
    >
      <div 
        ref={contentRef}
        className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-3xl relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <AnimatedElement type="zoomIn" duration={0.3} delay={0.5}>
            <X className="h-6 w-6" />
          </AnimatedElement>
        </button>
        
        <div className="flex flex-col md:flex-row h-full min-h-[450px]">
          {/* Left column - Image */}
          <div className="w-full md:w-2/5 relative overflow-hidden">
            <div
              ref={bgRef}
              className="animate-image absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentStepData.image})` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.color} mix-blend-multiply`}></div>
          </div>
        </div>
        
          {/* Right column - Content */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
            {/* Step indicator */}
            <div className="flex justify-center md:justify-start mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-10 rounded-full mx-1 ${
                    index === currentStep
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-gray-200"
                  }`}
                ></div>
              ))}
                </div>
            
            {/* Step content */}
            <div className="flex flex-col space-y-6 flex-grow justify-center items-center md:items-start text-center md:text-left">
              <div className="animate-text">
                {currentStepData.icon}
                </div>
              
              <h2 className="animate-text text-2xl font-bold text-gray-800">
                {currentStepData.title}
              </h2>
              
              <p className="animate-text text-gray-600 max-w-md">
                {currentStepData.description}
              </p>
        </div>
        
            {/* Navigation buttons */}
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                  className="animate-button border-white/50 bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white/70 rounded-xl flex items-center gap-1 shadow-sm"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
                className="animate-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md rounded-xl flex items-center gap-1"
              type="button"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Get Started
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeWindow; 