import React, { useState } from "react";
import { Button } from "./ui/button";
import { Heart, Calendar, Gift, MessageCircle, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeWindowProps {
  onClose: () => void;
}

const WelcomeWindow: React.FC<WelcomeWindowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
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
  
  const handleNextStep = () => {
    console.log("Next button clicked, current step:", currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevStep = () => {
    console.log("Back button clicked, current step:", currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden w-full max-w-md relative border border-white/50"
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none z-0"></div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute w-20 h-20 rounded-full bg-purple-300/30 backdrop-blur-md"
            animate={{ 
              x: [0, 10, 0], 
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut" 
            }}
            style={{ top: '15%', right: '10%' }}
          />
          <motion.div 
            className="absolute w-16 h-16 rounded-full bg-pink-300/30 backdrop-blur-md"
            animate={{ 
              x: [0, -10, 0], 
              y: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 7,
              ease: "easeInOut" 
            }}
            style={{ bottom: '20%', left: '10%' }}
          />
          <motion.div 
            className="absolute w-12 h-12 rounded-full bg-blue-300/30 backdrop-blur-md"
            animate={{ 
              x: [0, 8, 0], 
              y: [0, 8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut" 
            }}
            style={{ top: '60%', right: '15%' }}
          />
        </div>
        
        {/* Header */}
        <div className={`relative p-6 border-b border-white/30 bg-gradient-to-r ${steps[currentStep].color} backdrop-blur-md z-10`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 bg-white/60 backdrop-blur-md p-1.5 rounded-full transition-colors shadow-sm"
            type="button"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/70">
              {steps[currentStep].icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {steps[currentStep].title}
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </h2>
              <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-md min-h-[350px] relative z-10">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur-xl opacity-20 -z-10 transform -rotate-3"></div>
                    <img 
                      src={steps[currentStep].image}
                      alt="Welcome to WishOne" 
                      className="w-64 h-48 object-cover rounded-2xl border-2 border-white/80 shadow-xl"
                    />
                  </motion.div>
                </div>
                <p className="text-center text-gray-700 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm">
                  WishOne is your personal birthday companion and emotional support assistant. 
                  We're here to help you remember important dates and provide a friendly presence whenever you need it.
                </p>
              </motion.div>
            )}
            
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-xl opacity-20 -z-10 transform rotate-3"></div>
                    <img 
                      src={steps[currentStep].image}
                      alt="Calendar Feature" 
                      className="w-64 h-48 object-cover rounded-2xl border-2 border-white/80 shadow-xl"
                    />
                  </motion.div>
                </div>
                <p className="text-center text-gray-700 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm">
                  Our elegant calendar helps you keep track of all your important dates.
                  Add birthdays with just a few taps and get timely reminders so you never forget.
                </p>
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl blur-xl opacity-20 -z-10 transform -rotate-3"></div>
                    <img 
                      src={steps[currentStep].image}
                      alt="Personalized Wishes" 
                      className="w-64 h-48 object-cover rounded-2xl border-2 border-white/80 shadow-xl"
                    />
                  </motion.div>
                </div>
                <p className="text-center text-gray-700 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm">
                  Need help writing the perfect birthday message? Our AI can help you craft 
                  heartfelt wishes for any relationship, making your messages truly special.
                </p>
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-20 -z-10 transform rotate-3"></div>
                    <img 
                      src={steps[currentStep].image}
                      alt="Emotional Support" 
                      className="w-64 h-48 object-cover rounded-2xl border-2 border-white/80 shadow-xl"
                    />
                  </motion.div>
                </div>
                <p className="text-center text-gray-700 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm">
                  Our emotionally intelligent AI companion is always here to chat.
                  Share your thoughts, ask for advice, or just have a friendly conversation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-white/30 bg-white/40 backdrop-blur-md flex justify-between items-center relative z-10">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <motion.div 
                key={index}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-md' 
                    : 'bg-gray-200'
                }`}
                animate={index === currentStep ? { 
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{ 
                  repeat: index === currentStep ? Infinity : 0, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                className="border-white/50 bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white/70 rounded-xl flex items-center gap-1 shadow-sm"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md rounded-xl flex items-center gap-1"
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
      </motion.div>
    </div>
  );
};

export default WelcomeWindow; 