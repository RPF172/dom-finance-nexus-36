import React from 'react';
import { motion } from 'framer-motion';

interface SlideRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
}

export const SlideReveal: React.FC<SlideRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6
}) => {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 }
  };

  const initial = directionMap[direction];

  return (
    <motion.div
      initial={{ ...initial, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
