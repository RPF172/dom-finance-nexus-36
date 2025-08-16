import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { SlideStage } from '../SlideStage';
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
  const progressPercentage = ((currentIndex + 1) / totalSlides) * 100;
  const egoReduction = Math.min(Math.round(progressPercentage * 0.8), 100);

  return (
    <SlideStage
      backgroundType="gradient"
      overlayIntensity="none"
      animation="scale"
      className="w-full h-full bg-gradient-to-b from-background via-background/95 to-accent/5"
    >
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1], 
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-destructive via-destructive/80 to-destructive"
            />
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
          className="text-3xl md:text-4xl lg:text-5xl font-institutional font-bold uppercase tracking-wider text-destructive mb-6"
        >
          {slide.title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <p className="text-lg md:text-xl text-foreground/80">
            You've completed {currentIndex + 1} of {totalSlides} slides
          </p>
          
          <div className="space-y-3">
            <p className="text-base md:text-lg text-muted-foreground">Ego Reduction Progress</p>
            <div className="relative">
              <Progress value={egoReduction} className="h-3" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${egoReduction}%` }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-destructive to-destructive/70 rounded-full opacity-20"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your ego has been reduced by {egoReduction}%
            </p>
          </div>
          
          {slide.body && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-lg mx-auto"
            >
              {slide.body}
            </motion.p>
          )}
        </motion.div>
      </div>
    </SlideStage>
  );
};