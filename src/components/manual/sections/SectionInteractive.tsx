import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { InteractiveRitual } from '../ui/InteractiveRitual';
import { ScrollTrigger } from '../motion/ScrollTrigger';

interface SectionInteractiveProps {
  onComplete: () => void;
  isActive: boolean;
}

export const SectionInteractive: React.FC<SectionInteractiveProps> = ({ 
  onComplete 
}) => {
  return (
    <SectionWrapper sectionId={3} background="ritual-khaki">
      <div className="px-12 py-24 max-w-4xl mx-auto">
        <SectionHeader 
          number="III"
          title="Ritual of Submission"
          subtitle="Actions speak louder than intention"
        />
        
        <div className="space-y-12">
          <ScrollTrigger>
            <div className="font-mono text-[hsl(var(--concrete-gray))] text-base leading-relaxed max-w-2xl">
              <p>
                You have read the words. Now you must prove your commitment.
              </p>
              <p className="mt-4">
                Every transformation requires a sacrifice. Every ascension demands submission 
                to something greater than yourself.
              </p>
              <p className="mt-4 text-[hsl(var(--bronze))] font-bold">
                Complete this ritual to proceed.
              </p>
            </div>
          </ScrollTrigger>

          <InteractiveRitual 
            onComplete={onComplete}
            ritualType="mark"
          >
            <div className="text-center space-y-6 py-12">
              <div className="font-['Rakkas'] text-5xl text-[hsl(var(--bronze))] tracking-wider">
                I SUBMIT TO<br />THE SYSTEM
              </div>
              <div className="font-mono text-[hsl(var(--concrete-gray))]/70 text-sm max-w-md mx-auto">
                By marking this as obeyed, you acknowledge your commitment to 
                follow the path of discipline and transformation.
              </div>
            </div>
          </InteractiveRitual>
        </div>
      </div>
    </SectionWrapper>
  );
};
