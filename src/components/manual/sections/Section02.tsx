import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { BodyColumn } from '../ui/BodyColumn';
import { HoverRevealText } from '../ui/HoverRevealText';
import { ScrollTrigger } from '../motion/ScrollTrigger';

interface Section02Props {
  onComplete: () => void;
  isActive: boolean;
}

export const Section02: React.FC<Section02Props> = () => {
  return (
    <SectionWrapper sectionId={2} background="alpha-black">
      <div className="px-12 py-24 max-w-4xl mx-auto">
        <SectionHeader 
          number="II"
          title="The Path of Obedience"
          subtitle="There is freedom in submission to a greater purpose"
        />
        
        <BodyColumn>
          <ScrollTrigger>
            <p>
              The modern world has corrupted the meaning of obedience. They see it 
              as weakness. They are fools.
            </p>
          </ScrollTrigger>

          <ScrollTrigger>
            <p>
              True obedience is <span className="text-[hsl(var(--bronze))] font-bold">strategic alignment</span>.  
              It is the conscious choice to subordinate your ego to a system 
              that elevates you beyond your individual limitations.
            </p>
          </ScrollTrigger>

          <ScrollTrigger>
            <p>
              When you obey the principles of power, you do not diminish—you{' '}
              <HoverRevealText 
                trigger="multiply" 
                revealed="By submitting to the system, you gain access to forces beyond yourself"
              />.
            </p>
          </ScrollTrigger>

          <ScrollTrigger>
            <div className="border-l-4 border-[hsl(var(--shame-red))] pl-6 py-4 bg-[hsl(var(--ritual-khaki))]/10 rounded-r my-8">
              <p className="text-[hsl(var(--bronze))] font-bold italic mb-2">
                "The nail that sticks out gets hammered down."
              </p>
              <p className="text-sm opacity-75">
                — Ancient proverb on the wisdom of strategic conformity
              </p>
            </div>
          </ScrollTrigger>

          <ScrollTrigger>
            <p>
              Learn this: obedience to the right system is the fastest path to dominance. 
              Rebels without structure are merely{' '}
              <span className="text-[hsl(var(--shame-red))] line-through">weak</span>{' '}
              <span className="text-[hsl(var(--bronze))] font-bold">lost</span>.
            </p>
          </ScrollTrigger>
        </BodyColumn>
      </div>
    </SectionWrapper>
  );
};
