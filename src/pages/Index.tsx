
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
import AppLayout from '@/components/layout/AppLayout';
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
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      <Header />
      <main className={`${showModal ? 'pointer-events-none' : 'relative z-10'} flex-1`}>
        <HeroSection />
      </main>
      <BlinkingArrow />
      <FooterSection />
      
      <InvestorModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </div>
  );
};

export default Index;
