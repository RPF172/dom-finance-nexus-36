
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="min-h-screen bg-alpha-steel text-obedience-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        {/* Main Header */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-institutional text-obedience-white tracking-widest animate-fade-in">
              MAGAT UNIVERSITY
            </h1>
            <div className="h-1 w-32 bg-target-red mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <p className="text-2xl md:text-3xl text-obedience-white/90 font-mono animate-fade-in" style={{ animationDelay: '0.4s' }}>
            "Get on your knees. You're here to be broken, not understood."
          </p>
          
          <div className="bg-command-black/60 border-2 border-control-blue p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-xl md:text-2xl text-obedience-white font-inter font-bold tracking-wide">
              Welcome to the Institution Where Failure Gets Fucked Out of You.
            </p>
          </div>
        </div>

        {/* Coach Drake Section */}
        <div className="bg-command-black/80 border-l-8 border-target-red p-8 shadow-2xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-target-red mr-4"></div>
            <h2 className="text-2xl md:text-4xl text-target-red font-institutional tracking-wider">
              FROM THE DESK — NO, THE WHISTLE — OF COACH DRAKE:
            </h2>
          </div>
          
          <div className="space-y-6 text-obedience-white font-inter">
            <div className="space-y-3 text-lg md:text-xl leading-relaxed">
              <p className="font-medium">You didn't stumble here by accident. You came looking for something.</p>
              <p className="text-control-blue font-bold">Structure. Power. Correction.</p>
              <p>And I'll give it to you — the Alpha way.</p>
            </div>
            
            <div className="bg-target-red/20 border border-target-red p-6 space-y-2">
              <p className="text-xl font-bold text-obedience-white">You don't enroll in MAGAT U.</p>
              <p className="text-2xl font-bold text-control-blue">You surrender to it.</p>
            </div>
            
            <div className="flex justify-center pt-6">
              <Button 
                size="lg"
                className="bg-control-blue hover:bg-control-blue/80 text-obedience-white px-12 py-6 text-xl"
                onClick={() => navigate('/auth')}
              >
                BEGIN INDOCTRINATION
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
