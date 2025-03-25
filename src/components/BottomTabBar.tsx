import React from "react";
import { Home, MessageSquare, User, CheckCircle } from "lucide-react";

interface BottomTabBarProps {
  activeTab?: "home" | "chat" | "profile" | "goals";
  onHomeClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onGoalsClick?: () => void;
}

const BottomTabBar = ({
  activeTab = "home",
  onHomeClick = () => {},
  onChatClick = () => {},
  onProfileClick = () => {},
  onGoalsClick = () => {},
}: BottomTabBarProps) => {
  // Function to reset the welcome window (for testing)
  const resetWelcomeWindow = () => {
    localStorage.removeItem('wishone_has_visited');
    alert('Welcome window reset! Refresh the page to see it again.');
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center pb-4 pt-2 z-10">
      <div className="w-[90%] max-w-md bg-[#e8eeeb] rounded-full py-3 px-6 flex justify-between items-center shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)] relative">
        <button
          onClick={onHomeClick}
          className={`p-2 ${activeTab === "home" ? "text-[#0f3c2d]" : "text-gray-400"} hover:text-[#0f3c2d] transition-colors`}
        >
          <Home className="w-6 h-6" />
        </button>

        <button
          onClick={onChatClick}
          className={`p-2 ${activeTab === "chat" ? "text-[#0f3c2d]" : "text-gray-400"} hover:text-[#0f3c2d] transition-colors`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        <button
          onClick={onGoalsClick}
          className={`p-2 ${activeTab === "goals" ? "text-[#0f3c2d]" : "text-gray-400"} hover:text-[#0f3c2d] transition-colors`}
        >
          <CheckCircle className="w-6 h-6" />
        </button>

        <button
          onClick={onProfileClick}
          className={`p-2 ${activeTab === "profile" ? "text-[#0f3c2d]" : "text-gray-400"} hover:text-[#0f3c2d] transition-colors`}
        >
          <User className="w-6 h-6" />
        </button>
        
        {/* Hidden button to reset welcome window - double click to activate */}
        <button 
          onDoubleClick={resetWelcomeWindow}
          className="absolute bottom-0 right-0 w-4 h-4 opacity-0"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default BottomTabBar;
