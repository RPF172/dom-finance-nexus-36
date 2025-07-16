
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-domtoken-obsidian/80 backdrop-blur-md border-b border-domtoken-slate">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-cinzel text-domtoken-silver">$DOM</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-domtoken-silver hover:text-white transition-colors">Features</a>
          <a href="#tokenomics" className="text-domtoken-silver hover:text-white transition-colors">Tokenomics</a>
          <a href="#roadmap" className="text-domtoken-silver hover:text-white transition-colors">Roadmap</a>
          <a href="#team" className="text-domtoken-silver hover:text-white transition-colors">Team</a>
          <a href="#faq" className="text-domtoken-silver hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-domtoken-crimson text-domtoken-silver bg-transparent hover:bg-domtoken-crimson/20">
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-domtoken-silver" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-domtoken-obsidian border-t border-domtoken-slate">
          <div className="px-4 py-2 space-y-3">
            <a href="#features" className="block py-2 text-domtoken-silver hover:text-white">Features</a>
            <a href="#tokenomics" className="block py-2 text-domtoken-silver hover:text-white">Tokenomics</a>
            <a href="#roadmap" className="block py-2 text-domtoken-silver hover:text-white">Roadmap</a>
            <a href="#team" className="block py-2 text-domtoken-silver hover:text-white">Team</a>
            <a href="#faq" className="block py-2 text-domtoken-silver hover:text-white">FAQ</a>
            <Button variant="outline" className="w-full mt-4 border-domtoken-crimson text-domtoken-silver bg-transparent hover:bg-domtoken-crimson/20">
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
