import React from 'react';
import LiquidGradientBackground from './LiquidGradientBackground';
import AIGreeting from './AIGreeting';
import ExpandableMenu from './ExpandableMenu';
import HomeHeader from './HomeHeader';

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <LiquidGradientBackground />
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HomeHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <AIGreeting />
        </div>
        
        {/* Menu */}
        <ExpandableMenu />
      </div>
    </div>
  );
};

export default HomeScreen; 