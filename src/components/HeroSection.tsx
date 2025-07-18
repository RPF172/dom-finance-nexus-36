
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center bg-obedience-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 animate-pulse"
          style={{ backgroundImage: 'url(/lovable-uploads/31446dfb-4573-453a-b853-5998004b543b.png)' }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-4xl animate-fade-in">
          <h1 className="font-institutional text-command-black text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-wider leading-tight mb-4 animate-scale-in">
            You're Not Enrolling.<br />You're Surrendering.
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 font-inter animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
            MAGAT U — Elite Obedience Training for the Weak-Willed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
            <Button 
              variant="outline"
              size="lg"
              className="group border-2 border-command-black text-command-black hover:border-target-red hover:text-target-red bg-transparent px-12 py-4 font-semibold uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden"
              onClick={() => navigate('/auth')}
            >
              <span className="relative z-10">BEND NOW</span>
              <div className="absolute inset-0 bg-target-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-10"></div>
            </Button>
            
            <button 
              className="text-gray-500 underline text-lg font-inter hover:text-gray-700 transition-all duration-200 hover:scale-105 story-link"
              onClick={() => navigate('/lessons')}
            >
              VIEW CURRICULUM
            </button>
          </div>
        </div>
      </section>

      {/* Why You're Here Section */}
      <section className="w-full bg-obedience-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-institutional text-command-black text-4xl md:text-5xl font-bold uppercase text-center mb-12 border-b-2 border-gray-200 pb-4">
            Why You're Here
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 border border-gray-200 shadow-sm hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center min-h-60 group animate-fade-in [animation-delay:0.9s] opacity-0 [animation-fill-mode:forwards]">
              <div className="text-command-black mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 mx-auto stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                </svg>
              </div>
              <h3 className="font-inter text-xl font-semibold text-gray-800 mb-2 group-hover:text-command-black transition-colors">You crave structure.</h3>
              <p className="text-gray-600 font-inter leading-relaxed">Structure is what saves weak minds from chaos.</p>
            </div>
            
            <div className="bg-gray-50 p-8 border border-gray-200 shadow-sm hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center min-h-60 group animate-fade-in [animation-delay:1.1s] opacity-0 [animation-fill-mode:forwards]">
              <div className="text-command-black mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 mx-auto stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <h3 className="font-inter text-xl font-semibold text-gray-800 mb-2 group-hover:text-command-black transition-colors">You need restraint.</h3>
              <p className="text-gray-600 font-inter leading-relaxed">Restraint builds character through controlled pressure.</p>
            </div>
            
            <div className="bg-gray-50 p-8 border border-gray-200 shadow-sm hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center min-h-60 group animate-fade-in [animation-delay:1.3s] opacity-0 [animation-fill-mode:forwards]">
              <div className="text-command-black mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 mx-auto stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-inter text-xl font-semibold text-gray-800 mb-2 group-hover:text-command-black transition-colors">You want routine.</h3>
              <p className="text-gray-600 font-inter leading-relaxed">Routine creates measured progress toward obedience.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
