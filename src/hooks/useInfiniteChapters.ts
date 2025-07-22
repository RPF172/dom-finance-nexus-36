
import { useEffect, useState } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';

interface UseInfiniteChaptersProps {
  chapters: any[];
  batchSize?: number;
}

export const useInfiniteChapters = ({ 
  chapters, 
  batchSize = 6 
}: UseInfiniteChaptersProps) => {
  const [visibleChapters, setVisibleChapters] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const { elementRef: loadMoreRef, isVisible: shouldLoadMore } = useLazyLoading({
    threshold: 0.5,
    triggerOnce: false
  });

  // Initialize with first batch
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      const initialBatch = chapters.slice(0, batchSize);
      setVisibleChapters(initialBatch);
      setHasMore(chapters.length > batchSize);
    }
  }, [chapters, batchSize]);

  // Load more when sentinel is visible
  useEffect(() => {
    if (shouldLoadMore && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        const currentLength = visibleChapters.length;
        const nextBatch = chapters.slice(currentLength, currentLength + batchSize);
        
        if (nextBatch.length > 0) {
          setVisibleChapters(prev => [...prev, ...nextBatch]);
          setHasMore(currentLength + nextBatch.length < chapters.length);
        } else {
          setHasMore(false);
        }
        
        setIsLoadingMore(false);
      }, 800);
    }
  }, [shouldLoadMore, hasMore, isLoadingMore, visibleChapters.length, chapters, batchSize]);

  return {
    visibleChapters,
    loadMoreRef,
    isLoadingMore,
    hasMore
  };
};
