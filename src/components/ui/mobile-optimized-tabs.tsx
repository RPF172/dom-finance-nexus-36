import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileOptimizedTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface MobileTabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface MobileTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedTabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {}
});

export const MobileOptimizedTabs: React.FC<MobileOptimizedTabsProps> = ({
  value,
  onValueChange,
  children,
  className
}) => {
  return (
    <MobileOptimizedTabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </MobileOptimizedTabsContext.Provider>
  );
};

export const MobileTabsList: React.FC<MobileTabsListProps> = ({
  children,
  className
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScrollability();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScrollability);
      return () => element.removeEventListener('scroll', checkScrollability);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 120;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm shadow-sm"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable tabs container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex items-center overflow-x-auto scrollbar-none bg-muted p-1 rounded-lg',
          'md:justify-start',
          canScrollLeft && 'pl-10',
          canScrollRight && 'pr-10',
          className
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm shadow-sm"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const MobileTabsTrigger: React.FC<MobileTabsTriggerProps> = ({
  value,
  children,
  className
}) => {
  const { value: selectedValue, onValueChange } = React.useContext(MobileOptimizedTabsContext);
  const isActive = value === selectedValue;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'min-w-0 flex-shrink-0', // Prevent shrinking on mobile
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
        className
      )}
      onClick={() => onValueChange(value)}
      type="button"
    >
      {children}
    </button>
  );
};

export const MobileTabsContent: React.FC<MobileTabsContentProps> = ({
  value,
  children,
  className
}) => {
  const { value: selectedValue } = React.useContext(MobileOptimizedTabsContext);
  
  if (value !== selectedValue) {
    return null;
  }

  return (
    <div 
      className={cn(
        'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};