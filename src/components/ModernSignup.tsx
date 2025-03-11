import React, { useState } from "react";
import { InputKwity } from "./ui/input-kwity";
import { ButtonKwity } from "./ui/button-kwity";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";

interface ModernSignupProps {
  onSignup?: (name: string, email: string, password: string) => void;
  onSocialSignup?: (provider: string) => void;
  onBackToLogin?: () => void;
}

const ModernSignup = ({
  onSignup = () => {},
  onSocialSignup = () => {},
  onBackToLogin = () => {},
}: ModernSignupProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(name, email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-[40px] bg-white shadow-xl">
      {/* Background with floating circles */}
      <div className="relative h-64 bg-emerald-800 overflow-hidden">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-purple-400 opacity-80 left-4 top-4"
          animate={{
            y: [0, 10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-purple-500 opacity-80 right-8 top-8"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-pink-400 opacity-80 left-1/2 top-16"
          animate={{
            y: [0, 20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-purple-300 opacity-80 right-1/4 bottom-8"
          animate={{
            y: [0, -10, 0],
            x: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-pink-300 opacity-80 left-1/4 bottom-4"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="p-8 pt-6">
        <h1 className="text-2xl font-serif italic text-center mb-2">
          Kwity<sup>+</sup>
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputKwity
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl h-14 border-gray-200"
            required
          />
          
          <InputKwity
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl h-14 border-gray-200"
            required
          />
          
          <InputKwity
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl h-14 border-gray-200"
            required
          />

          <ButtonKwity
            type="submit"
            className="w-full h-14 rounded-xl bg-purple-400 hover:bg-purple-500 text-white font-medium text-lg"
          >
            SIGN UP
          </ButtonKwity>
        </form>

        <div className="flex items-center gap-4 my-8">
          <Separator className="flex-grow" />
          <span className="text-gray-400 text-sm">OR SIGN UP WITH</span>
          <Separator className="flex-grow" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { name: "facebook", icon: "f", color: "text-emerald-800" },
            { name: "apple", icon: "", color: "text-emerald-800" },
            { name: "snapchat", icon: "s", color: "text-emerald-800" },
            { name: "google", icon: "G", color: "text-emerald-800" },
          ].map((provider) => (
            <button
              key={provider.name}
              onClick={() => onSocialSignup(provider.name)}
              className="w-12 h-12 mx-auto rounded-full border border-emerald-800 flex items-center justify-center"
            >
              <span className={`${provider.color} font-medium`}>
                {provider.icon === "" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M11.9999 3.75C13.9374 3.75 15.3124 4.78125 16.0999 5.53125C16.1999 5.625 16.3249 5.625 16.4249 5.53125C17.3249 4.6875 18.0374 4.03125 18.7499 3.375C18.8499 3.28125 18.8499 3.09375 18.7499 3C17.6249 1.96875 15.9374 1.125 13.9999 1.125C10.4999 1.125 7.49994 3.375 6.18744 6.5625C6.14994 6.65625 6.18744 6.75 6.28119 6.75H9.84369C9.93744 6.75 10.0312 6.65625 10.0687 6.5625C10.5937 4.96875 12.0937 3.75 13.9999 3.75H11.9999Z" />
                    <path d="M18.75 12C18.75 11.8125 18.6562 11.7188 18.5625 11.7188H5.53125C5.34375 11.7188 5.25 11.8125 5.25 12C5.25 16.4062 8.90625 20.0625 13.3125 20.0625H10.6875C15.0938 20.0625 18.75 16.4062 18.75 12Z" />
                    <path d="M10.0687 17.4375C10.0312 17.3438 9.93744 17.25 9.84369 17.25H6.28119C6.18744 17.25 6.14994 17.3438 6.18744 17.4375C7.49994 20.625 10.4999 22.875 13.9999 22.875C15.9374 22.875 17.6249 22.0312 18.7499 21C18.8499 20.9062 18.8499 20.7188 18.7499 20.625C18.0374 19.9688 17.3249 19.3125 16.4249 18.4688C16.3249 18.375 16.1999 18.375 16.0999 18.4688C15.3124 19.2188 13.9374 20.25 11.9999 20.25H13.9999C12.0937 20.25 10.5937 19.0312 10.0687 17.4375Z" />
                  </svg>
                ) : provider.icon === "s" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12.0002 2.25C14.9252 2.25 17.3252 4.5 17.4752 7.425C17.4752 7.5 17.5502 7.5 17.5502 7.5C18.3002 7.5 19.0502 7.8 19.5752 8.325C20.1002 8.85 20.4002 9.6 20.3252 10.35C20.3252 11.925 19.1252 13.2 17.5502 13.275C17.4752 13.275 17.4752 13.35 17.4752 13.425C17.4752 14.4 17.2502 15.375 16.8002 16.2C15.9002 17.85 14.1752 18.975 12.3002 19.275C11.7752 19.35 11.2502 19.425 10.7252 19.35C10.0502 19.275 9.45023 19.125 8.85023 18.9C8.55023 18.825 8.25023 18.675 7.95023 18.525C7.87523 18.525 7.80023 18.45 7.72523 18.45C7.65023 18.45 7.57523 18.45 7.50023 18.525C6.90023 18.9 6.22523 19.125 5.55023 19.125C5.32523 19.125 5.17523 19.05 5.10023 18.9C5.02523 18.75 5.02523 18.525 5.17523 18.375C5.47523 18 5.85023 17.7 6.15023 17.325C6.30023 17.175 6.45023 16.95 6.52523 16.725C6.60023 16.575 6.60023 16.425 6.52523 16.275C6.45023 16.125 6.30023 16.05 6.15023 15.975C4.65023 15.45 3.75023 14.175 3.75023 12.675C3.75023 11.85 4.05023 11.1 4.57523 10.5C5.02523 9.975 5.70023 9.6 6.45023 9.45C6.52523 9.45 6.60023 9.375 6.60023 9.3C6.67523 6.3 9.07523 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9C12.0002 3.9 12.0002 3.9 12.0002 3.9M12.0002 2.25C12.0002 2.25 12.0002 2.25 12.0002 2.25C12.0002 2.25 12.0002 2.25 12.0002 2.25C12.0002 2.25 12.0002 2.25 12.0002 2.25C12.0002 2.25 12.0002 2.25 12.0002 2.25C12.0002 2.25 12.0002 2.25 12.0002 2.25C8.55023 2.25 5.70023 5.025 5.62523 8.475C4.72523 8.7 3.97523 9.15 3.37523 9.825C2.70023 10.575 2.32523 11.55 2.32523 12.6C2.32523 14.625 3.52523 16.35 5.47523 17.025C5.47523 17.025 5.47523 17.025 5.47523 17.025C5.25023 17.325 4.95023 17.625 4.65023 17.925C4.12523 18.525 3.97523 19.35 4.27523 20.025C4.57523 20.7 5.25023 21.075 6.00023 21.075C6.97523 21.075 7.87523 20.7 8.62523 20.175C9.15023 20.4 9.75023 20.55 10.3502 20.625C10.9502 20.7 11.5502 20.7 12.1502 20.55C14.4002 20.175 16.4252 18.9 17.5502 16.95C18.0752 15.975 18.3752 14.85 18.3752 13.65C20.4752 13.5 22.0502 11.85 22.0502 9.825C22.1252 8.775 21.7502 7.725 21.0002 6.975C20.2502 6.225 19.2002 5.85 18.1502 5.925C17.7002 3.75 15.9752 1.95 13.8002 1.425C13.2002 1.275 12.6002 1.2 12.0002 1.2C12.0002 1.275 12.0002 2.25 12.0002 2.25Z" />
                  </svg>
                ) : (
                  provider.icon
                )}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button 
              onClick={onBackToLogin}
              className="text-purple-500 hover:text-purple-700 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernSignup; 