import React from 'react';
import { motion } from 'framer-motion';
import { hapticFeedback } from '@/components/ui/haptic-feedback';

interface DogTagButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const DogTagButton: React.FC<DogTagButtonProps> = ({
  onClick,
  children,
  disabled = false
}) => {
  const handleClick = () => {
    hapticFeedback.medium();
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Dog tag shape */}
      <div className="relative bg-[hsl(var(--bronze))] text-[hsl(var(--alpha-black))] px-8 py-4 rounded-sm transform rotate-2 transition-all duration-300 group-hover:rotate-0 border-2 border-[hsl(var(--alpha-black))]/20">
        <div className="font-mono font-bold text-lg tracking-wider uppercase">
          {children}
        </div>
        
        {/* Metallic shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"
          initial={false}
        />
      </div>

      {/* Chain hole */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[hsl(var(--alpha-black))] border-2 border-[hsl(var(--bronze))]" />
    </motion.button>
  );
};
