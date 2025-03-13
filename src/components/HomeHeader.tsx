import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, User } from 'lucide-react';

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center w-full px-4 py-6">
      <motion.button
        className="rounded-full p-3 bg-[#f0f4f1] text-[#5a7d7c] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ 
          scale: 0.95,
          boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)"
        }}
        onClick={() => navigate('/help')}
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      <motion.button
        className="rounded-full p-3 bg-[#f0f4f1] text-[#5a7d7c] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ 
          scale: 0.95,
          boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)"
        }}
        onClick={() => navigate('/profile')}
      >
        <User className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default HomeHeader; 