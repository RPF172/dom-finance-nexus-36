import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { CommandSlide } from './slide-types/CommandSlide';
import { VisualSlide } from './slide-types/VisualSlide';
import { InstructionSlide } from './slide-types/InstructionSlide';
import { InteractiveSlide } from './slide-types/InteractiveSlide';
import { CheckpointSlide } from './slide-types/CheckpointSlide';
import { FinalSlide } from './slide-types/FinalSlide';

interface SlideRendererProps {
  slide: ModuleSlide;
  onSubmission?: (data: any) => void;
  onComplete?: () => void;
  currentIndex: number;
  totalSlides: number;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  onSubmission,
  onComplete,
  currentIndex,
  totalSlides,
}) => {
  const slideVariants = {
    enter: {
      y: '100vh',
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: '-100vh',
      opacity: 0,
    },
  };

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'command':
        return <CommandSlide slide={slide} />;
      case 'visual':
        return <VisualSlide slide={slide} />;
      case 'instruction':
        return <InstructionSlide slide={slide} />;
      case 'interactive':
        return (
          <InteractiveSlide 
            slide={slide} 
            onSubmission={onSubmission}
          />
        );
      case 'checkpoint':
        return (
          <CheckpointSlide 
            slide={slide} 
            currentIndex={currentIndex} 
            totalSlides={totalSlides} 
          />
        );
      case 'final':
        return <FinalSlide slide={slide} onComplete={onComplete} />;
      default:
        return <div>Unknown slide type</div>;
    }
  };

  return (
    <motion.div
      key={slide.id}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-background overflow-hidden"
    >
      {renderSlideContent()}
    </motion.div>
  );
};