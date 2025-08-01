import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { ContentCarousel } from '@/components/ContentCarousel';
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
import RecentLessonsCarousel from '@/components/RecentLessonsCarousel';

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

  const sections = [
    {
      key: 'hero',
      content: <HeroSection />, 
      bg: 'bg-obsidian-grey',
      border: 'obsidian-card',
    },
    {
      key: 'carousel',
      content: <RecentLessonsCarousel />, 
      bg: 'bg-steel-silver text-jet-black',
      border: 'border-2 border-steel-silver',
    },
    {
      key: 'why',
      content: <WhyMagatSection />, 
      bg: 'bg-obsidian-grey',
      border: 'obsidian-card',
    },
    {
      key: 'paths',
      content: <LearningPathsSection />, 
      bg: 'bg-steel-silver text-jet-black',
      border: 'border-2 border-steel-silver',
    },
    {
      key: 'traditional',
      content: <TraditionalVsMagatSection />, 
      bg: 'bg-obsidian-grey',
      border: 'obsidian-card',
    },
    {
      key: 'features',
      content: <UniversityFeaturesSection />, 
      bg: 'bg-steel-silver text-jet-black',
      border: 'border-2 border-steel-silver',
    },
    {
      key: 'tokenomics',
      content: <TokenomicsSection />, 
      bg: 'bg-obsidian-grey',
      border: 'obsidian-card',
    },
    {
      key: 'roadmap',
      content: <AcademicRoadmapSection />, 
      bg: 'bg-steel-silver text-jet-black',
      border: 'border-2 border-steel-silver',
    },
    {
      key: 'preview',
      content: <InteractiveLessonPreview />, 
      bg: 'bg-obsidian-grey',
      border: 'obsidian-card',
    },
    {
      key: 'team',
      content: <TeamSection />, 
      bg: 'bg-steel-silver text-jet-black',
      border: 'border-2 border-steel-silver',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      <Header />
      <main className={`${showModal ? 'pointer-events-none' : 'relative z-10'} flex-1`}>
        {sections.map((section, idx) => (
          <section
            key={section.key}
            className={`my-8 mx-4 md:mx-12 lg:mx-24 py-12 px-4 md:px-8 obsidian-tilt crimson-glow-hover ${section.bg} ${section.border}`}
          >
            {section.content}
          </section>
        ))}
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
