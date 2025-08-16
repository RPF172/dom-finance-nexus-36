import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { SlideStage } from '../SlideStage';

interface VisualSlideProps {
  slide: ModuleSlide;
}

export const VisualSlide: React.FC<VisualSlideProps> = ({ slide }) => {
  const mediaAspectRatio = slide.interactive_config?.aspectRatio || 'auto';
  
  return (
    <SlideStage
      mediaUrl={slide.media_url}
      mediaAspectRatio={mediaAspectRatio}
      backgroundType="image"
      overlayIntensity="medium"
      animation="fade"
      className="w-full h-full"
    >
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-institutional font-bold uppercase tracking-wider text-white mb-6 drop-shadow-2xl"
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed drop-shadow-lg max-w-3xl mx-auto"
          >
            {slide.body}
          </motion.p>
        )}
      </div>
    </SlideStage>
  );
};