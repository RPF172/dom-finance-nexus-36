import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SlideMediaProps {
  src: string;
  aspectRatio?: '9:16' | '16:9' | 'square' | 'auto';
  loading?: 'lazy' | 'eager';
  className?: string;
  showSkeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const SlideMedia: React.FC<SlideMediaProps> = ({
  src,
  aspectRatio = 'auto',
  loading = 'lazy',
  className,
  showSkeleton = true,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16]';
      case '16:9':
        return 'aspect-[16/9]';
      case 'square':
        return 'aspect-square';
      default:
        return '';
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [loading]);

  // Preload image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;
  }, [isInView, src]);

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          getAspectRatioClasses(),
          className
        )}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        getAspectRatioClasses(),
        className
      )}
    >
      {/* Skeleton Loader */}
      {isLoading && showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Image */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={src}
          alt=""
          loading={loading}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoading ? 0 : 1, 
            scale: 1 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};