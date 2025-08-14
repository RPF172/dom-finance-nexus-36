import React, { memo, lazy, Suspense, useMemo, useCallback } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Lazy load heavy components
const LazyLearningAnalyticsDashboard = lazy(() => 
  import('./LearningAnalyticsDashboard').then(module => ({
    default: module.LearningAnalyticsDashboard
  }))
);

const LazySessionTracker = lazy(() => 
  import('./SessionTracker').then(module => ({
    default: module.SessionTracker
  }))
);

// Optimized Image Component with lazy loading and WebP support
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = memo(({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false 
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (!src) return;

    // Create WebP version URL if possible
    const webpSrc = src.includes('.') 
      ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : src;

    // Test WebP support
    const testWebP = (callback: (supported: boolean) => void) => {
      const webp = new Image();
      webp.onload = webp.onerror = () => callback(webp.height === 2);
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    testWebP((supported) => {
      setImageSrc(supported ? webpSrc : src);
    });
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    // Fallback to original source
    if (imageSrc !== src) {
      setImageSrc(src);
      setHasError(false);
    }
  }, [imageSrc, src]);

  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label="Image failed to load"
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <LoadingSpinner size="sm" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Debounced Search Hook
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized Chart Component
interface ChartDataPoint {
  label: string;
  value: number;
}

interface OptimizedChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar';
  className?: string;
}

export const OptimizedChart = memo(({ data, type, className }: OptimizedChartProps) => {
  const chartData = useMemo(() => {
    // Expensive chart calculations
    return data.map(point => ({
      ...point,
      normalizedValue: (point.value / Math.max(...data.map(d => d.value))) * 100
    }));
  }, [data]);

  if (type === 'bar') {
    return (
      <div className={`space-y-2 ${className}`} role="img" aria-label="Bar chart">
        {chartData.map((point, index) => (
          <div key={point.label} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-20">
              {point.label}
            </span>
            <div className="flex-1 bg-muted rounded-full h-4 relative">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${point.normalizedValue}%` }}
                role="progressbar"
                aria-valuenow={point.value}
                aria-valuemin={0}
                aria-valuemax={Math.max(...data.map(d => d.value))}
              />
            </div>
            <span className="text-sm font-medium min-w-12 text-right">
              {point.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`h-32 ${className}`} role="img" aria-label="Line chart">
      <svg className="w-full h-full" viewBox="0 0 400 100">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        {/* Generate path */}
        <path
          d={`M 0,${100 - chartData[0]?.normalizedValue || 0} ${chartData
            .map((point, index) => 
              `L ${(index * 400) / (chartData.length - 1)},${100 - point.normalizedValue}`
            )
            .join(' ')}`}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="url(#chartGradient)"
        />
        
        {/* Data points */}
        {chartData.map((point, index) => (
          <circle
            key={point.label}
            cx={(index * 400) / (chartData.length - 1)}
            cy={100 - point.normalizedValue}
            r="3"
            fill="hsl(var(--primary))"
          />
        ))}
      </svg>
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

// Performance Monitor Component
export const PerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = React.useState<{
    memory?: number;
    timing?: number;
  }>({});

  React.useEffect(() => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            setMetrics(prev => ({
              ...prev,
              timing: entry.duration
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      // Memory usage (if available)
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memory: memoryInfo.usedJSHeapSize / 1024 / 1024 // MB
        }));
      }

      return () => observer.disconnect();
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-2 text-xs opacity-75 z-50">
      <div>Load: {metrics.timing?.toFixed(0)}ms</div>
      {metrics.memory && <div>Memory: {metrics.memory.toFixed(1)}MB</div>}
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

// Lazy Loading Wrapper with Error Boundary
interface LazyComponentProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const LazyWrapper = ({ 
  fallback = <LoadingSpinner />, 
  children 
}: LazyComponentProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Export optimized components
export const OptimizedLearningAnalytics = memo(() => (
  <LazyWrapper>
    <LazyLearningAnalyticsDashboard />
  </LazyWrapper>
));

export const OptimizedSessionTracker = memo(({ weekId }: { weekId?: string }) => (
  <LazyWrapper>
    <LazySessionTracker weekId={weekId} />
  </LazyWrapper>
));

OptimizedLearningAnalytics.displayName = 'OptimizedLearningAnalytics';
OptimizedSessionTracker.displayName = 'OptimizedSessionTracker';