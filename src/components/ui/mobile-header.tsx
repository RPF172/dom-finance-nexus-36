import React from 'react';
import { ArrowLeft, Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function MobileHeader({ 
  title, 
  onBack, 
  showBack = false, 
  actions,
  className,
  subtitle 
}: MobileHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="touch-target shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="min-w-0 flex-1">
            <h1 className="font-institutional font-bold uppercase tracking-wider text-lg truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

interface MobileActionButtonProps {
  icon: React.ElementType;
  onClick: () => void;
  'aria-label': string;
  badge?: boolean;
}

export function MobileActionButton({ 
  icon: Icon, 
  onClick, 
  'aria-label': ariaLabel,
  badge = false 
}: MobileActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="touch-target relative"
      aria-label={ariaLabel}
    >
      <Icon className="h-5 w-5" />
      {badge && (
        <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
      )}
    </Button>
  );
}