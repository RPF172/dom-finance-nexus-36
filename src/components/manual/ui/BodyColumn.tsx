import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BodyColumnProps {
  children: React.ReactNode;
  className?: string;
}

export const BodyColumn: React.FC<BodyColumnProps> = ({ children, className }) => {
  return (
    <motion.div
      className={cn(
        "max-w-2xl space-y-6 font-mono text-[hsl(var(--concrete-gray))] text-base leading-relaxed",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
