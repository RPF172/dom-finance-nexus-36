
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(/lovable-uploads/54ed4a47-5f2d-46e6-947d-6576c40de655.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-thin text-white tracking-wide animate-fade-in">
          MAGAT UNIVERSITY
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 italic font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
          "Obedience is the Tuition. Ownership is the Degree."
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg"
            className="bg-domtoken-crimson hover:bg-domtoken-crimson/90 text-white px-8 py-3"
            onClick={() => window.location.href = '/auth'}
          >
            SUBMIT TO THE SYSTEM
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
