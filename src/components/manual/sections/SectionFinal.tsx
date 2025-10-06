import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { CommandSeal } from '../ui/CommandSeal';
import { FadeIn } from '../motion/FadeIn';

interface SectionFinalProps {
  onComplete: () => void;
  isActive: boolean;
}

export const SectionFinal: React.FC<SectionFinalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'seal' | 'message' | 'fade'>('seal');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('message'), 3000);
    const timer2 = setTimeout(() => {
      setPhase('fade');
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <SectionWrapper sectionId={4} background="alpha-black">
      <div className="flex flex-col items-center justify-center h-full px-12">
        {phase === 'seal' && (
          <FadeIn>
            <CommandSeal />
          </FadeIn>
        )}

        {phase === 'message' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8"
          >
            <div className="font-['Rakkas'] text-7xl text-[hsl(var(--bronze))] tracking-wider">
              INDOCTRINATION<br />COMPLETE
            </div>
            
            <div className="font-mono text-[hsl(var(--concrete-gray))] text-lg max-w-2xl">
              You have taken the first step. The path continues beyond these pages.
            </div>

            <motion.div
              className="inline-block px-8 py-3 border-2 border-[hsl(var(--shame-red))] rounded"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 hsl(var(--shame-red) / 0)',
                  '0 0 20px 10px hsl(var(--shame-red) / 0.3)',
                  '0 0 0 0 hsl(var(--shame-red) / 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="font-mono text-[hsl(var(--shame-red))] tracking-wider">
                PROCEED TO TRAINING
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === 'fade' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-center"
          >
            <div className="font-['Rakkas'] text-4xl text-[hsl(var(--bronze))]">
              OBEY.
            </div>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
};
