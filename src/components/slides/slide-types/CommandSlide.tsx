import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { SlideStage } from '../SlideStage';

interface CommandSlideProps {
  slide: ModuleSlide;
}

export const CommandSlide: React.FC<CommandSlideProps> = ({ slide }) => {
  const mediaAspectRatio = slide.interactive_config?.aspectRatio || 'auto';
  
  return (
    <SlideStage
      mediaUrl={slide.media_url}
      mediaAspectRatio={mediaAspectRatio}
      backgroundType={slide.media_url ? "blur" : "solid"}
      overlayIntensity={slide.media_url ? "heavy" : "none"}
      animation="scale"
      className="w-full h-full"
    >
      <div className="text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-institutional font-bold uppercase tracking-wider text-destructive mb-8 leading-none drop-shadow-2xl"
          style={{ fontFamily: 'var(--font-army-rust)' }}
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl text-foreground/95 leading-relaxed max-w-4xl mx-auto"
          >
            {slide.body.split('\n').map((line, index) => (
              <motion.p 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className="mb-4 last:mb-0"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </div>
    </SlideStage>
  );
};