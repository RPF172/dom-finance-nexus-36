import React from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../ui/ProgressBar';

interface MarginaliaProps {
  currentSection: number;
  totalSections: number;
  completedSections: number[];
}

export const Marginalia: React.FC<MarginaliaProps> = ({
  currentSection,
  totalSections,
  completedSections
}) => {
  return (
    <motion.div 
      className="fixed left-0 top-0 h-full w-20 z-50 flex flex-col items-center justify-center bg-[hsl(var(--alpha-black))]/80 backdrop-blur-sm border-r border-[hsl(var(--concrete-gray))]/20"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Section Counter */}
      <div className="absolute top-8 flex flex-col items-center space-y-2">
        <div className="text-[hsl(var(--bronze))] font-mono text-xs tracking-wider">
          SEC
        </div>
        <div className="text-[hsl(var(--concrete-gray))] font-bold text-2xl font-['Rakkas']">
          {String(currentSection + 1).padStart(2, '0')}
        </div>
        <div className="text-[hsl(var(--concrete-gray))]/50 font-mono text-xs">
          / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        current={currentSection + 1}
        total={totalSections}
        completed={completedSections}
      />

      {/* Command Notes */}
      <div className="absolute bottom-8 flex flex-col items-center space-y-4">
        {completedSections.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--shame-red))] flex items-center justify-center">
              <span className="text-white font-bold text-sm">{completedSections.length}</span>
            </div>
            <div className="text-[hsl(var(--bronze))] font-mono text-[10px] mt-1 rotate-90 whitespace-nowrap origin-center">
              OBEYED
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
