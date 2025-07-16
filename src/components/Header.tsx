
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-domtoken-obsidian/80 backdrop-blur-md border-b border-domtoken-slate">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-cinzel text-domtoken-silver">MAGAT UNIVERSITY</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
