import React from 'react';
import { motion } from 'framer-motion';
import { ClipPathReveal } from '../motion/ClipPathReveal';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, subtitle }) => {
  return (
    <div className="space-y-4">
      <ClipPathReveal>
        <motion.h1 
          className="font-['Rakkas'] text-6xl md:text-8xl tracking-wider text-[hsl(var(--bronze))] uppercase leading-none"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {children}
        </motion.h1>
      </ClipPathReveal>
      
      {subtitle && (
        <motion.p
          className="font-mono text-[hsl(var(--concrete-gray))] text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
