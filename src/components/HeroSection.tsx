

import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section
      className="hero relative flex flex-col justify-center items-center h-screen overflow-hidden px-6 sm:px-8"
      style={{ minHeight: '100vh' }}
    >
      {/* Background layers */}
      {/* Shame Red glowing cracks overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-background"
        style={{
          background: "url('/textures/concrete.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'multiply',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "url('/svg/cracks-red.svg')",
          mixBlendMode: 'overlay',
          opacity: 0.25,
        }}
      />
      {/* Bottom silhouettes */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 bottom-0 z-0"
        style={{
          height: '40%',
          background: "url('/svg/kneeling-silhouettes.svg') repeat-x bottom",
          opacity: 0.15,
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl text-center">
        <h1 className="font-institutional text-foreground tracking-wide uppercase z-10 text-6xl md:text-8xl">
          SUB CAMP™
        </h1>
        <p className="font-mono text-primary mt-4 z-10 text-lg md:text-xl">
          Not a camp. A conversion center.
        </p>
        {/* CTA Buttons */}
        <div
          className="flex flex-col gap-4 mt-10 w-full sm:flex-row sm:justify-center sm:items-center sm:gap-6"
        >
          <button
            className="bg-primary text-primary-foreground font-mono font-bold uppercase px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 text-lg animate-pulse-slow"
            onClick={() => navigate('/auth?enlist=1')}
          >
            ENLIST NOW
          </button>
          <button
            className="bg-secondary text-secondary-foreground font-mono font-bold uppercase px-8 py-4 border-2 border-foreground hover:bg-secondary/90 transition-all duration-300 hover:scale-105 active:scale-95 text-lg"
            onClick={() => navigate('/auth?admin=1')}
          >
            ALPHA COMMAND LOGIN
          </button>
        </div>
      </div>
      {/* Custom cursor effect */}
      <style>{`
        .hero { cursor: url('/icons/boot-footprint.svg'), auto; }
        .enlist-btn { transition: box-shadow 0.2s, animation-duration 0.2s; }
        .alpha-btn { transition: background 0.2s, box-shadow 0.2s; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,158,199,0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(255,158,199,0.4); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
