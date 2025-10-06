import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverRevealTextProps {
  trigger: string;
  revealed: string;
}

export const HoverRevealText: React.FC<HoverRevealTextProps> = ({
  trigger,
  revealed
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div 
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      <motion.span
        className="font-mono text-[hsl(var(--bronze))] underline decoration-dashed"
        whileHover={{ scale: 1.05 }}
      >
        {trigger}
      </motion.span>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute left-0 top-full mt-2 bg-[hsl(var(--ritual-khaki))] border-2 border-[hsl(var(--bronze))] rounded px-4 py-2 min-w-max z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-mono text-[hsl(var(--concrete-gray))] text-sm italic">
              "{revealed}"
            </div>
            
            {/* Arrow pointer */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-[hsl(var(--ritual-khaki))] border-l-2 border-t-2 border-[hsl(var(--bronze))] transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
