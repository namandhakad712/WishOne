import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/Auth/AuthForm";
import { useSupabase } from "@/contexts/SupabaseContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { isAuthenticated } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-purple-300/30 blur-3xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -30, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
          style={{ top: '10%', right: '5%' }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-pink-300/30 blur-3xl"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 20, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 18,
            ease: "easeInOut" 
          }}
          style={{ bottom: '10%', left: '5%' }}
        />
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-blue-300/30 blur-3xl"
          animate={{ 
            x: [0, 15, 0], 
            y: [0, 15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut" 
          }}
          style={{ top: '40%', left: '25%' }}
        />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
} 