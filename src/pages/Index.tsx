
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import WhyMagatSection from '@/components/WhyMagatSection';
import LearningPathsSection from '@/components/LearningPathsSection';
import TraditionalVsMagatSection from '@/components/TraditionalVsMagatSection';
import UniversityFeaturesSection from '@/components/UniversityFeaturesSection';
import TokenomicsSection from '@/components/TokenomicsSection';
import AcademicRoadmapSection from '@/components/AcademicRoadmapSection';
import InteractiveLessonPreview from '@/components/InteractiveLessonPreview';
import TeamSection from '@/components/TeamSection';

import FooterSection from '@/components/FooterSection';
import StatsCounter from '@/components/StatsCounter';
import InvestorModal from '@/components/InvestorModal';
import SlidingBottomNav from '@/components/SlidingBottomNav';
import BlinkingArrow from '@/components/BlinkingArrow';

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolledToTrigger, setHasScrolledToTrigger] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasScrolledToTrigger) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage >= 0.66) {
        setShowModal(true);
        setHasScrolledToTrigger(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledToTrigger]);

  return (
    <div className="flex flex-col min-h-screen bg-domtoken-obsidian relative">
      <Header />
      <main className={showModal ? 'pointer-events-none' : 'relative z-10'}>
        <HeroSection />
        <StatsCounter />
        <WhyMagatSection />
        <LearningPathsSection />
        <TraditionalVsMagatSection />
        <UniversityFeaturesSection />
        
        {/* Interactive Preview Section */}
        <section className="py-20 bg-domtoken-slate/10">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
                Experience <span className="text-domtoken-crimson">MAGAT</span> Learning
              </h2>
              <p className="text-xl text-domtoken-silver max-w-2xl mx-auto">
                Try our interactive lesson system and see how MAGAT University transforms traditional education.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <InteractiveLessonPreview />
            </div>
          </div>
        </section>

        <TokenomicsSection />
        <AcademicRoadmapSection />
        <TeamSection />
      </main>
      <BlinkingArrow />
      <FooterSection />
      <SlidingBottomNav />
      <InvestorModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </div>
  );
};

export default Index;
