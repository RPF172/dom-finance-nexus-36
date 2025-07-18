import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { toast } = useToast();
  const {
    showToast = true,
    logError = true,
    fallbackMessage = 'An unexpected error occurred',
  } = options;

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      const errorMessage = error instanceof Error ? error.message : fallbackMessage;
      
      if (logError) {
        console.error('Error caught by error handler:', error, context ? `Context: ${context}` : '');
      }

      if (showToast) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }

      return errorMessage;
    },
    [toast, showToast, logError, fallbackMessage]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string,
      onError?: (error: unknown) => void
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, context);
        onError?.(error);
        return null;
      }
    },
    [handleError]
  );

  return { handleError, handleAsyncError };
}