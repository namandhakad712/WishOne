import React, { useState } from "react";
import { Button } from "./ui/button";
import { Heart, Calendar, Gift, MessageCircle, X } from "lucide-react";
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
    },
    {
      title: "Never Miss a Birthday",
      description: "Keep track of all your loved ones' special days in one beautiful place.",
      icon: <Calendar className="h-12 w-12 text-purple-500" />,
    },
    {
      title: "Personalized Wishes",
      description: "Get help creating heartfelt birthday messages for any relationship.",
      icon: <Gift className="h-12 w-12 text-green-500" />,
    },
    {
      title: "Emotional Support",
      description: "Chat with your AI companion whenever you need someone to talk to.",
      icon: <MessageCircle className="h-12 w-12 text-blue-500" />,
    },
  ];
  
  const handleNextStep = () => {
    console.log("Next button clicked, current step:", currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevStep = () => {
    console.log("Back button clicked, current step:", currentStep);
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md relative"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-300"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-green-300"></div>
        </div>
        
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-purple-100 to-green-100">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white p-3 rounded-full shadow-sm">
              {steps[currentStep].icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-purple-700">{steps[currentStep].title}</h2>
              <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-purple-50/30 to-green-50/30 min-h-[300px]">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <img 
                    src="https://api.dicebear.com/7.x/thumbs/svg?seed=wishone&backgroundColor=gradient&gradientColors[]=a78bfa,bef264" 
                    alt="WishOne" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                  />
                </div>
                <p className="text-center text-gray-700">
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
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <Calendar className="h-24 w-24 text-purple-500" />
                  </div>
                </div>
                <p className="text-center text-gray-700">
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
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <Gift className="h-24 w-24 text-green-500" />
                  </div>
                </div>
                <p className="text-center text-gray-700">
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
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <MessageCircle className="h-24 w-24 text-blue-500" />
                  </div>
                </div>
                <p className="text-center text-gray-700">
                  Our emotionally intelligent AI companion is always here to chat.
                  Share your thoughts, ask for advice, or just have a friendly conversation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                type="button"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              type="button"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeWindow; 