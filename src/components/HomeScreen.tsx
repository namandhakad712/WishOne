import React from 'react';
import LiquidGradientBackground from './LiquidGradientBackground';
import AIGreeting from './AIGreeting';
import ExpandableMenu from './ExpandableMenu';
import HomeHeader from './HomeHeader';

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <LiquidGradientBackground />
      
      {/* Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <HomeHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-24">
          <AIGreeting />
        </div>
      </div>
      
      {/* Menu - positioned absolutely */}
      <ExpandableMenu />
    </div>
  );
};

export default HomeScreen; 