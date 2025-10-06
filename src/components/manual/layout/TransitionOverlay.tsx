import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionOverlayProps {
  isActive: boolean;
  message?: string;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  isActive,
  message = "PROCESSING..."
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(var(--alpha-black))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-[hsl(var(--bronze))] font-['Rakkas'] text-4xl tracking-widest">
              {message}
            </div>
            <motion.div
              className="w-32 h-1 mx-auto bg-[hsl(var(--shame-red))]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
