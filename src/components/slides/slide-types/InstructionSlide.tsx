import React from 'react';
import { motion } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { CheckCircle } from 'lucide-react';

interface InstructionSlideProps {
  slide: ModuleSlide;
}

export const InstructionSlide: React.FC<InstructionSlideProps> = ({ slide }) => {
  const instructions = slide.body?.split('\n').filter(line => line.trim()) || [];
  
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-institutional font-bold uppercase tracking-wider text-destructive text-center mb-12"
        >
          {slide.title}
        </motion.h1>
        
        <div className="space-y-6">
          {instructions.map((instruction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start space-x-4 bg-card border border-border rounded-lg p-6"
            >
              <CheckCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
              <p className="text-lg md:text-xl text-foreground leading-relaxed flex-1">
                {instruction}
              </p>
            </motion.div>
          ))}
        </div>
        
        {slide.media_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <img
              src={slide.media_url}
              alt="Instruction visual"
              className="max-w-sm rounded-lg shadow-lg border border-border"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};