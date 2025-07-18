import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  type?: 'general' | 'network' | 'not-found' | 'unauthorized' | 'server';
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  showIcon?: boolean;
}

const errorConfig = {
  general: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
  network: {
    icon: WifiOff,
    title: 'Connection Error',
    description: 'Please check your internet connection and try again.',
  },
  'not-found': {
    icon: AlertTriangle,
    title: 'Not Found',
    description: 'The content you\'re looking for could not be found.',
  },
  unauthorized: {
    icon: AlertTriangle,
    title: 'Access Denied',
    description: 'You don\'t have permission to access this content.',
  },
  server: {
    icon: AlertTriangle,
    title: 'Server Error',
    description: 'Our servers are experiencing issues. Please try again later.',
  },
};

export function ErrorState({
  title,
  description,
  type = 'general',
  onRetry,
  retryText = 'Try Again',
  className,
  showIcon = true,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const IconComponent = config.icon;

  return (
    <Card className={cn('max-w-md mx-auto', className)}>
      <CardHeader className="text-center">
        {showIcon && (
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <IconComponent className="h-6 w-6 text-destructive" />
          </div>
        )}
        <CardTitle>{title || config.title}</CardTitle>
        <CardDescription>
          {description || config.description}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent className="text-center">
          <Button onClick={onRetry} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('max-w-md mx-auto', className)}>
      <CardHeader className="text-center">
        {icon && (
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent className="text-center">
          {action}
        </CardContent>
      )}
    </Card>
  );
}