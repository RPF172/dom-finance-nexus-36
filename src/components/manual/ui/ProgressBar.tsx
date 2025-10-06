import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  completed: number[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  completed
}) => {
  const progress = (current / total) * 100;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Vertical progress bar */}
      <div className="relative w-1 h-48 bg-[hsl(var(--concrete-gray))]/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-full bg-[hsl(var(--bronze))] rounded-full"
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Section markers */}
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = completed.includes(index);
          const yPosition = ((index + 1) / total) * 100;
          
          return (
            <motion.div
              key={index}
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                isCompleted 
                  ? 'bg-[hsl(var(--shame-red))]' 
                  : 'bg-[hsl(var(--concrete-gray))]/40'
              }`}
              style={{ bottom: `${yPosition}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: isCompleted ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="text-[hsl(var(--bronze))] font-mono text-xs">
        {Math.round(progress)}%
      </div>
    </div>
  );
};
