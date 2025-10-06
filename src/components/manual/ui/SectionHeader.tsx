import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  title,
  subtitle
}) => {
  return (
    <div className="space-y-6 mb-12">
      {/* Section number */}
      <motion.div
        className="flex items-center space-x-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-[hsl(var(--shame-red))] font-['Rakkas'] text-7xl leading-none">
          {number}
        </div>
        <div className="flex-1 h-px bg-[hsl(var(--bronze))]" />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-['Rakkas'] text-5xl text-[hsl(var(--concrete-gray))] uppercase tracking-wide"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="font-mono text-[hsl(var(--concrete-gray))]/70 text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
