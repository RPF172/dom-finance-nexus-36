import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { SlideStage } from '../SlideStage';
import { CheckCircle } from 'lucide-react';

interface InstructionSlideProps {
  slide: ModuleSlide;
}

export const InstructionSlide: React.FC<InstructionSlideProps> = ({ slide }) => {
  const instructions = slide.body?.split('\n').filter(line => line.trim()) || [];
  const mediaAspectRatio = slide.interactive_config?.aspectRatio || 'auto';
  
  return (
    <SlideStage
      mediaUrl={slide.media_url}
      mediaAspectRatio={mediaAspectRatio}
      backgroundType={slide.media_url ? "image" : "solid"}
      overlayIntensity={slide.media_url ? "light" : "none"}
      animation="slide"
      className="w-full h-full"
    >
      <div className="max-w-4xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-institutional font-bold uppercase tracking-wider text-destructive text-center mb-8 md:mb-12"
        >
          {slide.title}
        </motion.h1>
        
        <div className="space-y-4 md:space-y-6">
          {instructions.map((instruction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start space-x-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 md:p-6"
            >
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-destructive mt-1 flex-shrink-0" />
              <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed flex-1">
                {instruction}
              </p>
            </motion.div>
          ))}
        </div>
        
        {slide.media_url && !slide.interactive_config?.backgroundMedia && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 md:mt-8 flex justify-center"
          >
            <div className="max-w-xs md:max-w-sm">
              <img
                src={slide.media_url}
                alt="Instruction visual"
                className="w-full rounded-lg shadow-xl border border-border/50"
              />
            </div>
          </motion.div>
        )}
      </div>
    </SlideStage>
  );
};