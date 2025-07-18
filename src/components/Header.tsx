
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="institutional-header fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="section-container !py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-accent"></div>
          <span className="text-2xl font-institutional text-foreground tracking-wide">MAGAT UNIVERSITY</span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          INSTITUTIONAL COMMAND CENTER
        </div>
      </div>
    </header>
  );
};

export default Header;
