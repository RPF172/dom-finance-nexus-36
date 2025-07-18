import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface NetworkStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function NetworkStatus({ className, showDetails = false }: NetworkStatusProps) {
  const networkStatus = useNetworkStatus();

  if (networkStatus.online && !showDetails) {
    return null;
  }

  return (
    <Alert className={cn("border-destructive bg-destructive/10", className)}>
      <div className="flex items-center gap-2">
        {networkStatus.online ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-destructive" />
        )}
        <AlertDescription>
          {networkStatus.online ? (
            showDetails ? (
              <div className="space-y-1">
                <p>Connection: Online</p>
                {networkStatus.effectiveType && (
                  <p className="text-xs text-muted-foreground">
                    Speed: {networkStatus.effectiveType}
                    {networkStatus.downlink && ` (${networkStatus.downlink} Mbps)`}
                  </p>
                )}
              </div>
            ) : null
          ) : (
            "You're offline. Some features may not work properly."
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}

export function NetworkIndicator({ className }: { className?: string }) {
  const networkStatus = useNetworkStatus();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {networkStatus.online ? (
        <Wifi className="h-4 w-4 text-green-600" aria-label="Online" />
      ) : (
        <WifiOff className="h-4 w-4 text-destructive" aria-label="Offline" />
      )}
      <span className="sr-only">
        Network status: {networkStatus.online ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}