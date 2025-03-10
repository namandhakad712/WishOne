import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "WishOne" }: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-center px-6 shadow-sm bg-gradient-to-r from-primary-mint to-white">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-primary-emerald flex items-center justify-center mr-3">
          <span className="text-white font-semibold text-lg">W</span>
        </div>
        <h1 className={cn("text-2xl font-serif text-primary-emerald")}>
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
