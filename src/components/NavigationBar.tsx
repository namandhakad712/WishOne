import React from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Home,
  MessageSquare,
} from "lucide-react";

interface NavigationBarProps {
  onHomeClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
}

const NavigationBar = ({
  onHomeClick = () => {},
  onChatClick = () => {},
  onProfileClick = () => {},
}: NavigationBarProps) => {
  return (
    <div className="w-full bg-[#e8eeeb] rounded-full py-3 px-6 flex justify-between items-center shadow-md">
      <button
        onClick={onHomeClick}
        className="p-2 text-[#0f3c2d] hover:text-[#0a2a1f] transition-colors"
      >
        <Home className="w-5 h-5" />
      </button>

      <button
        onClick={onChatClick}
        className="p-2 text-[#0f3c2d] hover:text-[#0a2a1f] transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <button
        onClick={onProfileClick}
        className="p-2 text-[#0f3c2d] hover:text-[#0a2a1f] transition-colors"
      >
        <User className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NavigationBar;
