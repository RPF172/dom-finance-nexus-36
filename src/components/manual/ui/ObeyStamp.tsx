import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ObeyStampProps {
  isVisible: boolean;
}

export const ObeyStamp: React.FC<ObeyStampProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            duration: 0.5, 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          {/* Stamp background */}
          <div className="relative">
            {/* Red circle */}
            <div className="w-64 h-64 rounded-full border-8 border-[hsl(var(--shame-red))] flex items-center justify-center bg-[hsl(var(--shame-red))]/10">
              <div className="text-center">
                <div className="font-['Rakkas'] text-6xl text-[hsl(var(--shame-red))] tracking-wider">
                  OBEYED
                </div>
                <div className="font-mono text-sm text-[hsl(var(--shame-red))] mt-2">
                  {new Date().toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Ink splatter effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              initial={{ scale: 0 }}
              animate={{ scale: 1.5 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-full rounded-full bg-[hsl(var(--shame-red))] blur-2xl" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
