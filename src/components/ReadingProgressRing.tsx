
import React from 'react';
import { cn } from '@/lib/utils';

interface ReadingProgressRingProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

const strokeWidths = {
  sm: 2,
  md: 3,
  lg: 4,
};

export const ReadingProgressRing: React.FC<ReadingProgressRingProps> = ({
  progress,
  size = 'md',
  className
}) => {
  const radius = size === 'sm' ? 18 : size === 'md' ? 26 : 34;
  const strokeWidth = strokeWidths[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn(sizeClasses[size], 'relative', className)}>
      <svg className="transform -rotate-90 w-full h-full" viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}>
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted-foreground/20"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-accent transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-accent">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
