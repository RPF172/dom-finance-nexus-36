import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const enhancedCardVariants = cva(
  'transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'enhanced-card',
        obsidian: 'obsidian-card',
        premium: 'premium-card',
        glass: 'glass-morphism rounded-xl p-6',
        mobile: 'enhanced-mobile-card p-4',
        floating: 'enhanced-card hover:scale-105 hover:rotate-1',
        minimal: 'bg-card/30 border border-border/20 rounded-lg p-4 backdrop-blur-sm'
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      interactive: {
        none: '',
        hover: 'hover:shadow-lg cursor-pointer',
        press: 'pressed-obsidian cursor-pointer',
        glow: 'crimson-glow-hover cursor-pointer',
        tilt: 'obsidian-tilt cursor-pointer'
      },
      border: {
        none: 'border-0',
        subtle: 'border border-border/20',
        default: 'border border-border/50',
        accent: 'border border-accent/30',
        strong: 'border-2 border-border'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: 'hover',
      border: 'default'
    },
  }
);

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardVariants> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  badge?: React.ReactNode;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive,
    border,
    children,
    header,
    footer,
    loading = false,
    badge,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          enhancedCardVariants({ variant, size, interactive, border }),
          loading && 'loading-shimmer',
          className
        )}
        {...props}
      >
        {badge && (
          <div className="absolute top-4 right-4 z-10">
            {badge}
          </div>
        )}
        
        {header && (
          <div className="mb-6 pb-4 border-b border-border/20">
            {header}
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
        
        {footer && (
          <div className="mt-6 pt-4 border-t border-border/20">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

// Card header component
const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    action?: React.ReactNode;
  }
>(({ className, title, description, action, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-start justify-between space-y-2', className)}
    {...props}
  >
    <div className="space-y-1 flex-1">
      {title && (
        <h3 className="font-institutional text-lg uppercase tracking-wide">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </div>
    {action && (
      <div className="flex-shrink-0">
        {action}
      </div>
    )}
  </div>
));

EnhancedCardHeader.displayName = 'EnhancedCardHeader';

// Card content component
const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props} />
));

EnhancedCardContent.displayName = 'EnhancedCardContent';

// Card footer component
const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actions?: React.ReactNode;
    meta?: React.ReactNode;
  }
>(({ className, actions, meta, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between', className)}
    {...props}
  >
    <div className="flex-1">
      {meta && (
        <div className="text-xs text-muted-foreground mb-2">
          {meta}
        </div>
      )}
      {children}
    </div>
    {actions && (
      <div className="flex items-center gap-2">
        {actions}
      </div>
    )}
  </div>
));

EnhancedCardFooter.displayName = 'EnhancedCardFooter';

export { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardContent, 
  EnhancedCardFooter,
  enhancedCardVariants 
};