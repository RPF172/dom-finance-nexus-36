import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollTriggerProps {
  children: React.ReactNode;
  threshold?: number;
  once?: boolean;
}

export const ScrollTrigger: React.FC<ScrollTriggerProps> = ({
  children,
  threshold = 0.3,
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
