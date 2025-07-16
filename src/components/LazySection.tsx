import React from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  animationClass?: string;
}

const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  className = '', 
  fallback,
  animationClass = 'animate-fade-in'
}) => {
  const { elementRef, isVisible } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '50px'
  });

  const defaultFallback = (
    <div className={`py-20 ${className}`}>
      <div className="section-container">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? (
        <div className={animationClass}>
          {children}
        </div>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazySection;