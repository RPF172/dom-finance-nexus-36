import React from 'react';
import { motion } from 'framer-motion';

interface SideProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  estimatedTimeLeft?: number;
}

export const SideProgressBar: React.FC<SideProgressBarProps> = ({
  currentSlide,
  totalSlides,
  estimatedTimeLeft,
}) => {
  const progressPercentage = (currentSlide / totalSlides) * 100;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col items-center space-y-4">
        {/* Progress Bar */}
        <div className="relative w-1 h-64 bg-muted-foreground/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-destructive rounded-full"
            initial={{ height: 0 }}
            animate={{ height: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="text-xs text-muted-foreground text-center">
          <div className="font-institutional uppercase tracking-wider">
            {currentSlide}/{totalSlides}
          </div>
          {estimatedTimeLeft && (
            <div className="mt-1 opacity-75">
              ~{estimatedTimeLeft}m left
            </div>
          )}
        </div>
      </div>
    </div>
  );
};