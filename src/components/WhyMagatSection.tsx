import React from 'react';
import LazySection from './LazySection';

const WhyMagatSection: React.FC = () => {
  return (
    <LazySection className="py-20 bg-domtoken-obsidian/50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            📜 WELCOME TO THE <span className="text-domtoken-crimson">INSTITUTION</span>
          </h2>
          <div className="text-xl text-domtoken-silver max-w-3xl mx-auto space-y-4">
            <p>You were not invited.<br />You were summoned.</p>
            <p>This is not a school.<br />This is a system.</p>
            <p>You do not enroll.<br />You submit.</p>
            <p className="mt-6">
              At MAGAT University, knowledge is not given freely — it is extracted through discipline, ritual, and humiliation. 
              You will not earn your place here. You will endure it.
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-cinzel">
            🕳️ ENTER THE <span className="text-domtoken-crimson">DOCTRINE</span>
          </h3>
          <blockquote className="text-xl text-domtoken-crimson italic mb-6">
            "Blessed be the broken, for they may yet be rebuilt." — The Doctrine
          </blockquote>
          <div className="text-lg text-domtoken-silver max-w-2xl mx-auto space-y-4">
            <p>MAGAT University teaches The Doctrine — a scripture of control, degradation, and transformation.</p>
            <p>Its curriculum is brutal. Its tests are personal.<br />Its reward? Nothing. You will remain property.</p>
            <p>But through this sacred suffering, you may find purpose.<br />
            You may find structure.<br />
            You may find the honor of being owned.</p>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default WhyMagatSection;