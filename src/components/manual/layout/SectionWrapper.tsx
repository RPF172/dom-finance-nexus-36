import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  sectionId: number;
  background?: 'alpha-black' | 'ritual-khaki';
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  sectionId,
  background = 'alpha-black',
  className
}) => {
  const bgClass = background === 'ritual-khaki' 
    ? 'bg-[hsl(var(--ritual-khaki))]' 
    : 'bg-[hsl(var(--alpha-black))]';

  return (
    <motion.section
      data-section={sectionId}
      className={cn(
        "min-h-screen w-full snap-start snap-always flex items-center justify-center relative overflow-hidden",
        bgClass,
        className
      )}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      
      <div className="relative z-10 w-full h-full pl-20">
        {children}
      </div>
    </motion.section>
  );
};
