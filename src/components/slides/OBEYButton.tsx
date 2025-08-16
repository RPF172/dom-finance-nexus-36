import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { hapticFeedback } from '@/components/ui/haptic-feedback';

interface OBEYButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'default' | 'final';
}

export const OBEYButton: React.FC<OBEYButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'default',
}) => {
  const handleClick = () => {
    hapticFeedback.medium();
    onClick();
  };

  const buttonText = variant === 'final' ? 'SUBMIT' : 'OBEY';

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        size="lg"
        className={`
          px-12 py-6 text-lg font-institutional font-bold uppercase tracking-widest
          ${variant === 'final' 
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
            : 'bg-primary hover:bg-primary/90'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          transition-all duration-200 shadow-lg
        `}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          buttonText
        )}
      </Button>
    </motion.div>
  );
};