
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(/lovable-uploads/29b2e657-3f9e-4c6c-be36-64645480d368.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-thin text-white tracking-wide animate-fade-in">
          MAGAT University
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 italic font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Submit Surrender Serve
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg"
            className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-3"
            onClick={() => window.location.href = '/doctrine'}
          >
            Preview the Doctrine
          </Button>
          <Button 
            size="lg"
            className="bg-domtoken-crimson hover:bg-domtoken-crimson/90 text-white px-8 py-3"
            onClick={() => window.location.href = '/auth'}
          >
            Register
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
