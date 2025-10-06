import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export const CommandSeal: React.FC = () => {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 -m-12"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full rounded-full bg-[hsl(var(--bronze))] blur-3xl" />
        </motion.div>

        {/* Main seal */}
        <motion.div
          className="relative w-48 h-48 rounded-full bg-gradient-to-br from-[hsl(var(--bronze))] to-[hsl(var(--shame-red))] flex items-center justify-center border-4 border-[hsl(var(--concrete-gray))]/30"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Inner circle */}
          <div className="absolute inset-4 rounded-full bg-[hsl(var(--alpha-black))] border-2 border-[hsl(var(--bronze))]" />
          
          {/* Icon */}
          <motion.div
            className="relative z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: -360
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Shield className="w-20 h-20 text-[hsl(var(--bronze))]" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Decorative corners */}
        {[0, 90, 180, 270].map((rotation) => (
          <motion.div
            key={rotation}
            className="absolute top-1/2 left-1/2 w-32 h-1 bg-[hsl(var(--bronze))]"
            style={{ 
              rotate: rotation,
              transformOrigin: 'center',
              x: '-50%',
              y: '-50%'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1 + (rotation / 360) }}
          />
        ))}
      </div>
    </motion.div>
  );
};
