import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DogTagButton } from './DogTagButton';
import { ObeyStamp } from './ObeyStamp';
import { hapticFeedback } from '@/components/ui/haptic-feedback';

interface InteractiveRitualProps {
  onComplete: () => void;
  ritualType?: 'tap' | 'hover' | 'mark';
  children?: React.ReactNode;
}

export const InteractiveRitual: React.FC<InteractiveRitualProps> = ({
  onComplete,
  ritualType = 'tap',
  children
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setShowStamp(true);
    hapticFeedback.success();
    
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="relative">
      <motion.div
        className="flex flex-col items-center space-y-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {children}

        {!isCompleted && ritualType === 'tap' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="font-mono text-[hsl(var(--bronze))] text-sm tracking-wider uppercase animate-pulse">
              Tap the dog tag to continue
            </div>
            <DogTagButton onClick={handleComplete}>
              OBEY
            </DogTagButton>
          </div>
        )}

        {!isCompleted && ritualType === 'mark' && (
          <motion.button
            onClick={handleComplete}
            className="group relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="border-2 border-[hsl(var(--bronze))] border-dashed rounded-lg px-12 py-6 bg-[hsl(var(--alpha-black))]/50 transition-all duration-300 group-hover:bg-[hsl(var(--ritual-khaki))]/20 group-hover:border-solid">
              <div className="font-['Rakkas'] text-3xl text-[hsl(var(--bronze))] tracking-wider">
                MARK AS OBEYED
              </div>
            </div>
          </motion.button>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[hsl(var(--shame-red))] text-lg tracking-wider"
          >
            ✓ COMPLIANCE ACKNOWLEDGED
          </motion.div>
        )}
      </motion.div>

      <ObeyStamp isVisible={showStamp} />
    </div>
  );
};
