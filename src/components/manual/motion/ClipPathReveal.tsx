import React from 'react';
import { motion } from 'framer-motion';

interface ClipPathRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export const ClipPathReveal: React.FC<ClipPathRevealProps> = ({ 
  children, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      transition={{ 
        duration: 1.2, 
        delay,
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
    >
      {children}
    </motion.div>
  );
};
