

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
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "url('/textures/concrete.png')",
          backgroundColor: '#0A0A0A',
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
        <h1
          className="font-stencil text-concrete-gray tracking-wide uppercase z-10"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            letterSpacing: '0.05em',
            color: '#CCCCCC',
          }}
        >
          SUB CAMP™
        </h1>
        <p
          className="font-mono text-shame-red mt-4 z-10"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            color: '#B30000',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          }}
        >
          Not a camp. A conversion center.
        </p>
        {/* CTA Buttons */}
        <div
          className="flex flex-col gap-4 mt-10 w-full sm:flex-row sm:justify-center sm:items-center sm:gap-6"
        >
          <button
            className="enlist-btn w-full sm:w-auto"
            onClick={() => navigate('/auth?enlist=1')}
            style={{
              backgroundColor: '#FF9EC7',
              color: '#0A0A0A',
              fontFamily: 'IBM Plex Mono, monospace',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              borderRadius: 8,
              padding: '1rem 2rem',
              animation: 'pulse 2s infinite',
              fontSize: '1.1rem',
              boxShadow: '0 0 0 0 rgba(255,158,199,0.7)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.animationDuration = '1.2s';
              e.currentTarget.style.boxShadow = '0 0 24px 8px rgba(255,158,199,0.6)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.animationDuration = '2s';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(255,158,199,0.7)';
            }}
          >
            ENLIST NOW
          </button>
          <button
            className="alpha-btn w-full sm:w-auto"
            onClick={() => navigate('/auth?admin=1')}
            style={{
              backgroundColor: '#7B6E54',
              color: '#0A0A0A',
              fontFamily: 'IBM Plex Mono, monospace',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              border: '2px solid #CCCCCC',
              borderRadius: 2,
              padding: '1rem 2rem',
              fontSize: '1.1rem',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#6a604a';
              e.currentTarget.style.boxShadow = '0 0 0 2px #CCCCCC inset';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#7B6E54';
              e.currentTarget.style.boxShadow = 'none';
            }}
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
