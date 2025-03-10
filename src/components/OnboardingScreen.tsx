import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface OnboardingScreenProps {
  onGetStarted?: () => void;
}

const OnboardingScreen = ({
  onGetStarted = () => {},
}: OnboardingScreenProps) => {
  return (
    <div className="relative w-full h-full max-w-md mx-auto overflow-hidden bg-[#0f3c2d] rounded-[40px] text-white shadow-2xl">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="border-r border-b border-white/10"></div>
        <div className="border-b border-white/10"></div>
        <div className="border-r border-white/10"></div>
        <div></div>
      </div>

      {/* Floating circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-white/80 -bottom-10 left-4"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-purple-400/90 bottom-20 left-20"
          animate={{
            y: [0, 10, 0],
            x: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-pink-400/80 bottom-10 right-10"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-10 h-10 rounded-full bg-pink-300/90 top-32 left-6"
          animate={{
            y: [0, 8, 0],
            x: [0, 4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8 pt-12 pb-16">
        <div className="flex-1"></div>

        <div className="bg-[#e8eeeb] rounded-3xl p-6 text-[#0f3c2d] mb-8">
          <h1 className="text-3xl font-serif mb-2">
            Make <span className="text-[#0f3c2d] font-semibold">your</span>
            <br />
            <span className="text-pink-500">world blossom</span>
            <br />
            with{" "}
            <span className="font-serif italic">
              WishOne<sup className="text-purple-500">+</sup>
            </span>
          </h1>

          <Button
            onClick={onGetStarted}
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-12 w-40 uppercase text-sm font-medium"
          >
            GET STARTED
          </Button>

          <div className="mt-8 text-xs text-[#0f3c2d]/70 space-y-1">
            <p>JOIN OVER 7 MILLION SATISFIED CUSTOMERS.</p>
            <div className="flex justify-between">
              <p>NEVER MISS A BIRTHDAY.</p>
              <p>AI-POWERED REMINDERS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
