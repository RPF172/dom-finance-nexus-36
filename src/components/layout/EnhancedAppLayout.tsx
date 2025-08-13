import React from 'react';
import { AccessibilityProvider, SkipNavigation } from '@/components/ui/enhanced-accessibility';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAppLayoutProps {
  children: React.ReactNode;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  className?: string;
}

export const EnhancedAppLayout: React.FC<EnhancedAppLayoutProps> = ({
  children,
  enablePullToRefresh = false,
  onRefresh,
  className = ''
}) => {
  const { toast } = useToast();

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
      toast({
        title: "Content refreshed",
        description: "Your content has been updated",
      });
    }
  };

  return (
    <AccessibilityProvider>
      <div className={`min-h-screen bg-gradient-to-b from-background to-muted/10 ${className}`}>
        <SkipNavigation />
        
        {enablePullToRefresh && onRefresh ? (
          <PullToRefresh onRefresh={handleRefresh}>
            <main id="main-content" className="pb-20 md:pb-4">
              {children}
            </main>
          </PullToRefresh>
        ) : (
          <main id="main-content" className="pb-20 md:pb-4">
            {children}
          </main>
        )}
      </div>
    </AccessibilityProvider>
  );
};