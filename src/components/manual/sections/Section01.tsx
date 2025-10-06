import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { BodyColumn } from '../ui/BodyColumn';
import { VisualColumn } from '../ui/VisualColumn';
import { ScrollTrigger } from '../motion/ScrollTrigger';
import { Target } from 'lucide-react';

interface Section01Props {
  onComplete: () => void;
  isActive: boolean;
}

export const Section01: React.FC<Section01Props> = () => {
  return (
    <SectionWrapper sectionId={1} background="ritual-khaki">
      <div className="grid lg:grid-cols-2 gap-12 px-12 py-24 max-w-7xl mx-auto items-center">
        {/* Text Column */}
        <div>
          <SectionHeader 
            number="I"
            title="Training & Discipline"
            subtitle="The foundation of all power is control"
          />
          
          <BodyColumn>
            <ScrollTrigger>
              <p>
                Before you can command others, you must first command yourself. 
                This is the first law of authority.
              </p>
            </ScrollTrigger>

            <ScrollTrigger>
              <p>
                Every great leader, every dominant force, every empire—all were 
                built on the cornerstone of <span className="text-[hsl(var(--bronze))] font-bold">ruthless self-discipline</span>.
              </p>
            </ScrollTrigger>

            <ScrollTrigger>
              <p>
                You will learn to:
              </p>
              <ul className="space-y-3 ml-6 mt-4">
                <li className="flex items-start space-x-3">
                  <span className="text-[hsl(var(--bronze))] mt-1">▸</span>
                  <span>Eliminate weakness through daily ritual</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[hsl(var(--bronze))] mt-1">▸</span>
                  <span>Build unbreakable mental fortitude</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[hsl(var(--bronze))] mt-1">▸</span>
                  <span>Command respect through presence alone</span>
                </li>
              </ul>
            </ScrollTrigger>
          </BodyColumn>
        </div>

        {/* Visual Column */}
        <VisualColumn>
          <div className="relative">
            <div className="w-full aspect-square bg-[hsl(var(--alpha-black))]/30 rounded-lg border-4 border-[hsl(var(--bronze))]/30 flex items-center justify-center">
              <Target className="w-32 h-32 text-[hsl(var(--bronze))]" strokeWidth={1} />
            </div>
            
            {/* Decorative corner brackets */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-[hsl(var(--shame-red))]" />
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-[hsl(var(--shame-red))]" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-[hsl(var(--shame-red))]" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-[hsl(var(--shame-red))]" />
          </div>
        </VisualColumn>
      </div>
    </SectionWrapper>
  );
};
