
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-24 min-h-screen flex items-center relative overflow-hidden circuit-overlay">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-domtoken-obsidian/40 to-domtoken-obsidian"></div>
      
      <div className="section-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-xl">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white animate-fade-in">
              The Token That <span className="text-domtoken-crimson">Owns You</span>
            </h1>
            <p className="text-xl text-domtoken-silver leading-relaxed animate-fade-in mb-6" style={{ animationDelay: '0.2s' }}>
              $DOM is the deflationary cryptocurrency engineered for financial domination and kink-based creator economies. Every transaction burns supply like dignity itself.
            </p>
            <div className="space-y-4 text-domtoken-silver animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-domtoken-crimson rounded-full"></div>
                <span>1 Billion Total Supply with 5-10% Burn on Every Transfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-domtoken-crimson rounded-full"></div>
                <span>Built for Tribute Payments & Humiliating Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-domtoken-crimson rounded-full"></div>
                <span>No Banks, No Bans, No Mercy</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button className="bg-domtoken-crimson hover:bg-domtoken-crimson/90 text-white crimson-glow">
              <Download className="mr-2 h-5 w-5" /> Download Whitepaper
            </Button>
            <Button variant="outline" className="border-domtoken-silver/30 hover:bg-domtoken-slate text-domtoken-silver">
              <Mail className="mr-2 h-5 w-5" /> Join Investor List
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="relative w-60 h-60 md:w-80 md:h-80">
            <div className="absolute inset-0 rounded-full bg-domtoken-crimson/20 blur-2xl animate-pulse-slow"></div>
            <div className="relative w-full h-full">
              <img 
                src="/lovable-uploads/c516afb7-d01c-4b53-a003-d948fdee16d6.png" 
                alt="$DOM Token" 
                className="w-full h-full animate-float"
              />
              <div className="absolute inset-0 bg-gradient-radial from-domtoken-crimson/10 to-transparent animate-spin-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
