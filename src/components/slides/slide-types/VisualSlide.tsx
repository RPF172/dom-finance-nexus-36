import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';

interface VisualSlideProps {
  slide: ModuleSlide;
}

export const VisualSlide: React.FC<VisualSlideProps> = ({ slide }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {slide.media_url && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.media_url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </motion.div>
      )}
      
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-institutional font-bold uppercase tracking-wider text-white mb-4 drop-shadow-lg">
            {slide.title}
          </h1>
          
          {slide.body && (
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md">
              {slide.body}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};