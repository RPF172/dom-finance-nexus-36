import React from 'react';
import { Loader2, Zap, BookOpen, Brain, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'crimson' | 'success' | 'glass';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className
}) => {
  const variantClasses = {
    default: 'text-foreground',
    crimson: 'text-primary',
    success: 'text-success',
    glass: 'text-foreground/60'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
    />
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'h-4 w-full',
    card: 'h-32 w-full',
    text: 'h-4 w-3/4',
    circle: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24'
  };

  return (
    <div 
      className={cn(
        'skeleton rounded-lg',
        variantClasses[variant],
        className
      )} 
    />
  );
};

interface PageLoadingProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  title = 'Loading...',
  description = 'Please wait while we prepare your content',
  icon: Icon = BookOpen
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse">
            <div className="w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
          </div>
          <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary-foreground animate-bounce-gentle" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-institutional uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="flex justify-center">
          <LoadingSpinner size="md" variant="crimson" />
        </div>
      </div>
    </div>
  );
};

interface ContentLoadingProps {
  lines?: number;
  showAvatar?: boolean;
  showButtons?: boolean;
  className?: string;
}

export const ContentLoading: React.FC<ContentLoadingProps> = ({
  lines = 3,
  showAvatar = false,
  showButtons = false,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="enhanced-card">
        {showAvatar && (
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton variant="circle" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i}
              className={cn(
                'h-4',
                i === lines - 1 ? 'w-2/3' : 'w-full'
              )}
            />
          ))}
        </div>
        
        {showButtons && (
          <div className="flex space-x-3 mt-6">
            <Skeleton variant="button" />
            <Skeleton variant="button" />
          </div>
        )}
      </div>
    </div>
  );
};

interface CardGridLoadingProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const CardGridLoading: React.FC<CardGridLoadingProps> = ({
  count = 6,
  columns = 3,
  className
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="enhanced-card space-y-4">
          <Skeleton variant="card" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface SuccessAnimationProps {
  title?: string;
  description?: string;
  onComplete?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  title = 'Success!',
  description = 'Action completed successfully',
  onComplete,
  autoHide = true,
  duration = 2000
}) => {
  React.useEffect(() => {
    if (autoHide && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse">
            <div className="w-20 h-20 bg-success/30 rounded-full blur-xl"></div>
          </div>
          <div className="relative w-20 h-20 mx-auto bg-success-gradient rounded-full flex items-center justify-center animate-scale-in">
            <Trophy className="h-10 w-10 text-success-foreground animate-bounce-gentle" />
          </div>
        </div>
        
        <div className="space-y-2 animate-fade-in">
          <h2 className="text-xl font-institutional uppercase tracking-wide text-success">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'crimson' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  className
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-primary',
    crimson: 'crimson-gradient',
    success: 'success-gradient'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && <span className="text-muted-foreground">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div 
          className={cn('h-full transition-all duration-500 ease-out', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};