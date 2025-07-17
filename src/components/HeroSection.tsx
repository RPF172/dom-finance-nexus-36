
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
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
      <div className="absolute inset-0 bg-alpha-black/80"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-16">
        {/* Main Header */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-brawler text-cumlog-chrome tracking-widest animate-fade-in drop-shadow-2xl">
              MAGAT UNIVERSITY
            </h1>
            <div className="h-1 w-32 bg-frat-red mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <p className="text-2xl md:text-3xl text-cumlog-chrome font-locker italic animate-fade-in" style={{ animationDelay: '0.4s' }}>
            "Get on your knees. You're here to be broken, not understood."
          </p>
          
          <div className="bg-alpha-black/60 border-2 border-frat-red p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-xl md:text-2xl text-cumlog-chrome font-inter font-bold tracking-wide">
              Welcome to the Institution Where Failure Gets Fucked Out of You.
            </p>
          </div>
        </div>

        {/* Coach Drake Section */}
        <div className="bg-alpha-black/80 border-l-8 border-frat-red p-8 shadow-2xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-frat-red rounded-full mr-4 animate-pulse"></div>
            <h2 className="text-2xl md:text-4xl text-frat-red font-brawler tracking-wider">
              FROM THE DESK — NO, THE WHISTLE — OF COACH DRAKE:
            </h2>
          </div>
          
          <div className="space-y-6 text-cumlog-chrome font-inter">
            <div className="space-y-3 text-lg md:text-xl leading-relaxed">
              <p className="font-medium">You didn't stumble here by accident. You came looking for something.</p>
              <p className="text-sweat-green font-bold">Structure. Power. Correction.</p>
              <p>And I'll give it to you — the Alpha way.</p>
            </div>
            
            <div className="bg-frat-red/20 border border-frat-red p-6 space-y-2">
              <p className="text-xl font-bold text-white">You don't enroll in MAGAT U.</p>
              <p className="text-2xl font-bold text-sweat-green">You surrender to it.</p>
            </div>
            
            <div className="flex justify-center pt-6">
              <Button 
                size="lg"
                className="bg-frat-red hover:bg-frat-red/80 text-white px-12 py-6 text-xl font-bold font-brawler tracking-wider shadow-2xl border-2 border-cumlog-chrome transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                OBEY
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
