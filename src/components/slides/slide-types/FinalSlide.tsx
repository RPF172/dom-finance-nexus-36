import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { SlideStage } from '../SlideStage';

interface FinalSlideProps {
  slide: ModuleSlide;
  onComplete?: () => void;
}

export const FinalSlide: React.FC<FinalSlideProps> = ({ slide, onComplete }) => {
  return (
    <SlideStage
      backgroundType="gradient"
      overlayIntensity="none"
      animation="scale"
      className="w-full h-full bg-gradient-to-b from-background via-accent/10 to-background"
    >
      <div className="max-w-3xl w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3, 
            type: "spring", 
            stiffness: 200,
            duration: 1
          }}
          className="mb-8"
        >
          <div className="w-40 h-40 mx-auto relative">
            {/* Outer glow ring */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-destructive via-destructive/80 to-destructive blur-xl"
            />
            
            {/* Main sigil */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-4xl text-white font-bold select-none"
              >
                ⧫
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-institutional font-bold uppercase tracking-wider text-destructive mb-6"
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            {slide.body.split('\n').map((line, index) => (
              <motion.p 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + (index * 0.1) }}
                className="mb-4 last:mb-0"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
          className="text-base md:text-lg text-muted-foreground"
        >
          Your indoctrination is complete. You are ready to proceed.
        </motion.div>
      </div>
    </SlideStage>
  );
};