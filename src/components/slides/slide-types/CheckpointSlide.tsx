import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { Progress } from '@/components/ui/progress';

interface CheckpointSlideProps {
  slide: ModuleSlide;
  currentIndex: number;
  totalSlides: number;
}

export const CheckpointSlide: React.FC<CheckpointSlideProps> = ({ 
  slide, 
  currentIndex, 
  totalSlides 
}) => {
  const progressPercentage = (currentIndex / totalSlides) * 100;
  const egoReduction = Math.min(Math.round(progressPercentage * 0.8), 100);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-b from-background to-background/90">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-destructive to-destructive/70 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
              <span className="text-2xl font-bold text-destructive">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-institutional font-bold uppercase tracking-wider text-destructive mb-6"
        >
          {slide.title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <p className="text-xl text-foreground/80">
            You've passed Slide {currentIndex}/{totalSlides}
          </p>
          
          <div className="space-y-3">
            <p className="text-lg text-muted-foreground">Ego Reduction Progress</p>
            <Progress value={egoReduction} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Your ego has been reduced by {egoReduction}%
            </p>
          </div>
          
          {slide.body && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-foreground/70 leading-relaxed"
            >
              {slide.body}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};