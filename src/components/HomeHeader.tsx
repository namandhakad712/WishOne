import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, User } from 'lucide-react';

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center w-full px-4 py-6">
      <motion.button
        className="relative rounded-full p-3 bg-white/30 backdrop-blur-md border border-white/40 shadow-lg overflow-hidden flex items-center justify-center transition-all duration-200 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:to-white/10 before:opacity-60 before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:rounded-full after:shadow-[0_4px_24px_0_rgba(0,255,255,0.10)] hover:scale-105 active:scale-95"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/help')}
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(0,255,255,0.10)'}}
      >
        <HelpCircle className="w-6 h-6 text-[#5a7d7c] drop-shadow-[0_2px_8px_rgba(0,255,255,0.10)]" />
      </motion.button>

      <motion.button
        className="relative rounded-full p-3 bg-white/30 backdrop-blur-md border border-white/40 shadow-lg overflow-hidden flex items-center justify-center transition-all duration-200 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:to-white/10 before:opacity-60 before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:rounded-full after:shadow-[0_4px_24px_0_rgba(0,255,255,0.10)] hover:scale-105 active:scale-95"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/profile')}
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(0,255,255,0.10)'}}
      >
        <User className="w-6 h-6 text-[#5a7d7c] drop-shadow-[0_2px_8px_rgba(0,255,255,0.10)]" />
      </motion.button>
    </div>
  );
};

export default HomeHeader; 