import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.43z" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97zM21 9.12a.75.75 0 00-.75.75v4.883a1.5 1.5 0 01-1.5 1.5h-.75a.75.75 0 000 1.5h.75a3 3 0 003-3V9.87a.75.75 0 00-.75-.75z" clipRule="evenodd" />
    <path d="M6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zm4 0a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zm4 0a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const GroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
  </svg>
);

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

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-8 z-50">
      <div className="relative">
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Calendar - Left (previously Home) */}
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
                <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer">
                  <div className="text-green-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
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
                <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer">
                  <div className="text-purple-500 mb-1">
                    <ChatIcon />
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
                <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-4 w-[70px] h-[70px] flex flex-col items-center justify-center cursor-pointer">
                  <div className="text-yellow-500 mb-1">
                    <ProfileIcon />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Profile</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Menu Button */}
        <motion.button
          className="bg-gray-800 rounded-lg p-4 shadow-lg text-white z-10 relative w-[56px] h-[56px] flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GroupIcon />
        </motion.button>
      </div>
    </div>
  );
};

export default BottomNavigation; 