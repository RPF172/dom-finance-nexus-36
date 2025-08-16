import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';

interface CommandSlideProps {
  slide: ModuleSlide;
}

export const CommandSlide: React.FC<CommandSlideProps> = ({ slide }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      {slide.media_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.media_url}
            alt=""
            className="w-full h-full object-cover opacity-20 filter blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
        </motion.div>
      )}
      
      <div className="relative z-10 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-institutional font-bold uppercase tracking-wider text-destructive mb-8 leading-none"
          style={{ fontFamily: 'var(--font-army-rust)' }}
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-2xl mx-auto"
          >
            {slide.body.split('\n').map((line, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};