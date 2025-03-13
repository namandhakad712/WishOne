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

const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
  </svg>
);

type MenuOption = {
  name: string;
  icon: React.ReactNode;
  path: string;
  color: string;
};

const ExpandableMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuOptions: MenuOption[] = [
    { 
      name: 'Convert', 
      icon: <HomeIcon />, 
      path: '/',
      color: 'bg-pink-200'
    },
    { 
      name: 'Scan', 
      icon: <ScanIcon />, 
      path: '/chat',
      color: 'bg-blue-200'
    },
    { 
      name: 'Edit', 
      icon: <EditIcon />, 
      path: '/profile',
      color: 'bg-yellow-200'
    }
  ];

  const handleOptionClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-8 z-50">
      <div className="relative">
        {/* Curved Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-16 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative flex justify-center">
                {menuOptions.map((option, index) => {
                  // Calculate position on arc
                  const angle = -40 + index * 40; // -40, 0, 40 degrees
                  const radius = 120; // Distance from center
                  const x = Math.sin(angle * Math.PI / 180) * radius;
                  const y = -Math.cos(angle * Math.PI / 180) * radius;
                  
                  return (
                    <motion.div
                      key={option.name}
                      className={`absolute ${option.color} rounded-2xl p-4 shadow-lg cursor-pointer flex flex-col items-center justify-center w-24 h-24`}
                      style={{ 
                        left: `calc(50% + ${x}px - 48px)`, 
                        bottom: `${y}px` 
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionClick(option.path)}
                    >
                      <div className="text-gray-800 mb-1">
                        {option.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{option.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Menu Button */}
        <motion.button
          className="bg-gray-900 rounded-full p-4 shadow-lg text-white z-10 relative"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SearchIcon />
        </motion.button>
      </div>
    </div>
  );
};

export default ExpandableMenu; 