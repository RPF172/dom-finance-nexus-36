import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Marginalia } from './Marginalia';
import { TransitionOverlay } from './TransitionOverlay';

interface ManualLayoutProps {
  children: React.ReactNode;
  currentSection: number;
  totalSections: number;
  completedSections: number[];
  onSectionChange: (section: number) => void;
}

export const ManualLayout: React.FC<ManualLayoutProps> = ({
  children,
  currentSection,
  totalSections,
  completedSections,
  onSectionChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll('[data-section]');
      const scrollPosition = container.scrollTop + container.clientHeight / 2;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const sectionTop = element.offsetTop;
        const sectionHeight = element.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          onSectionChange(index);
        }
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onSectionChange]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[hsl(var(--alpha-black))]">
      {/* Marginalia - Fixed sidebar */}
      <Marginalia 
        currentSection={currentSection}
        totalSections={totalSections}
        completedSections={completedSections}
      />

      {/* Main scroll container */}
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Transition overlay for section changes */}
      <TransitionOverlay isActive={false} />
    </div>
  );
};
