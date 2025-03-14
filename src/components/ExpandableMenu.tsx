import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle, User, Grid } from 'lucide-react';

// Updated modern icons using Lucide React components
// We're removing the old SVG icons and using Lucide components instead

const BottomNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOptionClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Calculate positions for a semi-circle arrangement
  const radius = 120; // Distance from center button
  const calculatePosition = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.sin(radian);
    const y = radius * Math.cos(radian);
    return { x, y };
  };

  // Position for each menu item
  const leftPosition = calculatePosition(270); // Left item at 210 degrees
  const topPosition = calculatePosition(357);  // Top item at 270 degrees
  const rightPosition = calculatePosition(451); // Right item at 330 degrees

  const variants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1, duration: 0.2 }, // Faster transition
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.2 }, // Faster transition
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20, duration: 0.2 }, // Faster spring animation
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.15 }, // Faster closing animation
    },
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-8 z-50">
      <div className="relative">
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Calendar - Left */}
              <motion.div
                className="absolute"
                style={{ 
                  bottom: `${leftPosition.y}px`, 
                  left: `${leftPosition.x}px`,
                  transform: 'translate(-50%, 50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={() => handleOptionClick('/calendar')}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div className="text-green-500 mb-1 bg-green-100/50 p-2 rounded-full">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Calendar</span>
                </div>
              </motion.div>

              {/* Chat - Top */}
              <motion.div
                className="absolute"
                style={{ 
                  bottom: `${topPosition.y}px`, 
                  left: `${topPosition.x}px`,
                  transform: 'translate(-50%, 50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={() => handleOptionClick('/chat')}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div className="text-purple-500 mb-1 bg-purple-100/50 p-2 rounded-full">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Chat</span>
                </div>
              </motion.div>

              {/* Profile - Right */}
              <motion.div
                className="absolute"
                style={{ 
                  bottom: `${rightPosition.y}px`, 
                  left: `${rightPosition.x}px`,
                  transform: 'translate(-50%, 50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => handleOptionClick('/profile')}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div className="text-yellow-500 mb-1 bg-yellow-100/50 p-2 rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Profile</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Menu Button - Glassmorphic Style */}
        <motion.button
          className="bg-purple-600/80 backdrop-blur-md rounded-xl p-4 shadow-lg text-white z-10 relative w-[56px] h-[56px] flex items-center justify-center border border-white/40 hover:bg-purple-700/90 transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Grid className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default BottomNavigation; 