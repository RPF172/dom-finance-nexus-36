import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  pullThreshold?: number;
  maxPullDistance?: number;
  refreshThreshold?: number;
  disabled?: boolean;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  pullThreshold = 60,
  maxPullDistance = 120,
  refreshThreshold = 80,
  disabled = false,
  className
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouch = useRef(false);

  const shouldAllowPull = useCallback(() => {
    if (disabled || isRefreshing) return false;
    
    const container = containerRef.current;
    if (!container) return false;
    
    // Only allow pull when at the top of the scrollable area
    return container.scrollTop === 0;
  }, [disabled, isRefreshing]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!shouldAllowPull()) return;
    
    isTouch.current = true;
    setStartY(e.touches[0].clientY);
    setCanPull(true);
  }, [shouldAllowPull]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!canPull || !isTouch.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    
    if (deltaY > 0) {
      // Calculate pull distance with resistance
      const resistance = Math.max(0.5, 1 - (deltaY / maxPullDistance));
      const distance = Math.min(deltaY * resistance, maxPullDistance);
      setPullDistance(distance);
      
      // Prevent default scrolling when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [canPull, startY, maxPullDistance]);

  const handleTouchEnd = useCallback(() => {
    if (!canPull || !isTouch.current) return;
    
    isTouch.current = false;
    setCanPull(false);
    
    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      onRefresh().finally(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      });
    } else {
      setPullDistance(0);
    }
  }, [canPull, pullDistance, refreshThreshold, isRefreshing, onRefresh]);

  // Mouse events for desktop testing
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!shouldAllowPull()) return;
    
    isTouch.current = false; // Distinguish from touch
    setStartY(e.clientY);
    setCanPull(true);
  }, [shouldAllowPull]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canPull || isTouch.current) return;
    
    const currentY = e.clientY;
    const deltaY = currentY - startY;
    
    if (deltaY > 0) {
      const resistance = Math.max(0.3, 1 - (deltaY / maxPullDistance));
      const distance = Math.min(deltaY * resistance, maxPullDistance);
      setPullDistance(distance);
    }
  }, [canPull, startY, maxPullDistance]);

  const handleMouseUp = useCallback(() => {
    if (!canPull || isTouch.current) return;
    
    setCanPull(false);
    
    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      onRefresh().finally(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      });
    } else {
      setPullDistance(0);
    }
  }, [canPull, pullDistance, refreshThreshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    // Mouse events for desktop
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp]);

  const pullProgress = Math.min(pullDistance / refreshThreshold, 1);
  const shouldRefresh = pullDistance >= refreshThreshold;
  const iconRotation = isRefreshing ? 360 : pullProgress * 180;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Pull indicator */}
      <div 
        className={cn(
          'absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-300',
          pullDistance > 0 ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: `${Math.min(pullDistance, maxPullDistance)}px`,
          transform: `translateY(${pullDistance - maxPullDistance}px)`
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div 
            className={cn(
              'p-3 rounded-full transition-all duration-300',
              shouldRefresh 
                ? 'bg-success text-success-foreground shadow-lg' 
                : 'bg-muted text-muted-foreground',
              isRefreshing && 'animate-spin'
            )}
            style={{
              transform: `rotate${iconRotation}deg)`,
              scale: Math.min(1, 0.5 + pullProgress * 0.5)
            }}
          >
            {isRefreshing ? (
              <RotateCcw className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
          
          <div className="text-xs font-medium px-4 py-1 rounded-full bg-background/80 backdrop-blur-sm">
            {isRefreshing 
              ? 'Refreshing...' 
              : shouldRefresh 
              ? 'Release to refresh' 
              : 'Pull to refresh'
            }
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        style={{
          transform: `translateY(${Math.min(pullDistance * 0.5, maxPullDistance * 0.5)}px)`,
          transition: canPull ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>

      {/* Background overlay when pulling */}
      {pullDistance > 0 && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-success/10 to-transparent pointer-events-none"
          style={{ opacity: pullProgress * 0.5 }}
        />
      )}
    </div>
  );
};