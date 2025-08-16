import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SlideMedia } from './SlideMedia';

interface SlideStageProps {
  children: React.ReactNode;
  className?: string;
  mediaUrl?: string;
  mediaAspectRatio?: '9:16' | '16:9' | 'square' | 'auto';
  backgroundType?: 'solid' | 'gradient' | 'image' | 'blur';
  overlayIntensity?: 'none' | 'light' | 'medium' | 'heavy';
  animation?: 'fade' | 'slide' | 'scale' | 'none';
}

export const SlideStage: React.FC<SlideStageProps> = ({
  children,
  className,
  mediaUrl,
  mediaAspectRatio = 'auto',
  backgroundType = 'solid',
  overlayIntensity = 'medium',
  animation = 'fade',
}) => {
  const getAnimationVariants = () => {
    switch (animation) {
      case 'slide':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -50 },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      default:
        return {};
    }
  };

  const getOverlayClasses = () => {
    switch (overlayIntensity) {
      case 'light':
        return 'bg-background/20';
      case 'medium':
        return 'bg-gradient-to-t from-background/80 via-background/30 to-background/60';
      case 'heavy':
        return 'bg-background/90';
      default:
        return '';
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      className={cn(
        "relative w-full h-full overflow-hidden flex items-center justify-center",
        className
      )}
      {...(animation !== 'none' && variants)}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background Media */}
      {mediaUrl && (
        <div className="absolute inset-0 z-0">
          <SlideMedia
            src={mediaUrl}
            aspectRatio={mediaAspectRatio}
            loading="eager"
            className={cn(
              "w-full h-full object-cover",
              backgroundType === 'blur' && "filter blur-sm scale-105"
            )}
          />
          {/* Overlay */}
          {overlayIntensity !== 'none' && (
            <div className={cn("absolute inset-0", getOverlayClasses())} />
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8">
        {children}
      </div>
    </motion.div>
  );
};