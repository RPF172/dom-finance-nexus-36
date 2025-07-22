
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ChapterSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="relative h-48 sm:h-56">
        <Skeleton className="w-full h-full" />
        {/* Status badges skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="absolute top-4 left-4">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Skeleton className="w-8 h-6 rounded-full" />
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};
