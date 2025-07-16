
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProblemSolutionSection from '@/components/ProblemSolutionSection';
import UseCasesSection from '@/components/UseCasesSection';
import ComparisonSection from '@/components/ComparisonSection';
import FeaturesSection from '@/components/FeaturesSection';
import TokenomicsSection from '@/components/TokenomicsSection';
import RoadmapSection from '@/components/RoadmapSection';
import TeamSection from '@/components/TeamSection';
import FAQSection from '@/components/FAQSection';
import FooterSection from '@/components/FooterSection';
import StatsCounter from '@/components/StatsCounter';
import InvestorModal from '@/components/InvestorModal';

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
      <main className={showModal ? 'pointer-events-none' : ''}>
        <HeroSection />
        <StatsCounter />
        <ProblemSolutionSection />
        <UseCasesSection />
        <ComparisonSection />
        <FeaturesSection />
        <TokenomicsSection />
        <RoadmapSection />
        <TeamSection />
        <FAQSection />
      </main>
      <FooterSection />
      <InvestorModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </div>
  );
};

export default Index;
