import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { SectionTitle } from '../ui/SectionTitle';
import { ChevronDown } from 'lucide-react';

interface SectionHeroProps {
  onComplete: () => void;
  isActive: boolean;
}

export const SectionHero: React.FC<SectionHeroProps> = ({ isActive }) => {
  return (
    <SectionWrapper sectionId={0} background="alpha-black">
      <div className="flex flex-col items-center justify-center h-full px-12">
        {/* Ember particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[hsl(var(--bronze))] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="font-mono text-[hsl(var(--bronze))] text-sm tracking-[0.3em] uppercase mb-4">
              Sub Camp™ Field Manual
            </div>
            <SectionTitle subtitle="Your indoctrination begins now">
              Welcome to Hell,<br />Maggot
            </SectionTitle>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto font-mono text-[hsl(var(--concrete-gray))] text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            This is not a book. This is not a course. This is a{' '}
            <span className="text-[hsl(var(--bronze))] font-bold">ritual of transformation</span>.
            <br /><br />
            Scroll to proceed. Obey to advance.
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="font-mono text-[hsl(var(--bronze))]/60 text-xs tracking-wider uppercase">
              Scroll Down
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-[hsl(var(--bronze))]" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};
