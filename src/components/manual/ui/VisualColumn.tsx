import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VisualColumnProps {
  children: React.ReactNode;
  className?: string;
}

export const VisualColumn: React.FC<VisualColumnProps> = ({ children, className }) => {
  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
