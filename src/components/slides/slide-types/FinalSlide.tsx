import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';

interface FinalSlideProps {
  slide: ModuleSlide;
  onComplete?: () => void;
}

export const FinalSlide: React.FC<FinalSlideProps> = ({ slide, onComplete }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-b from-background via-accent/10 to-background">
      <div className="max-w-2xl w-full text-center">
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
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-destructive via-destructive/80 to-destructive blur-lg"
            />
            
            {/* Main sigil */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-4xl text-white font-bold"
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
          className="text-5xl md:text-6xl font-institutional font-bold uppercase tracking-wider text-destructive mb-6"
        >
          {slide.title}
        </motion.h1>
        
        {slide.body && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl text-foreground/80 leading-relaxed mb-8"
          >
            {slide.body.split('\n').map((line, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {line}
              </p>
            ))}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg text-muted-foreground"
        >
          Your transformation is complete. You are ready to proceed.
        </motion.div>
      </div>
    </div>
  );
};