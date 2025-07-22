import React, { useEffect, useState } from 'react';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { ContentCard } from '@/components/ContentCard';
import { ChapterSkeleton } from '@/components/ChapterSkeleton';
import { Flame } from 'lucide-react';
import { useInfiniteChapters } from '@/hooks/useInfiniteChapters';
import { ContentManagerFAB } from '@/components/admin/ContentManagerFAB';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const ReadChapters = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Try to use content sequence first, fallback to mixed content
  const { data: sequencedContent, isLoading: isSequenceLoading } = useContentSequence();
  const { data: fallbackContent, isLoading: isFallbackLoading } = useFallbackMixedContent();
  const { data: progressData } = useAllUserProgress();

  // Use sequenced content if available, otherwise fallback
  const mixedContent = sequencedContent?.length ? sequencedContent : fallbackContent;
  
  // Filter to only show chapters
  const chaptersOnly = mixedContent?.filter(item => item.type === 'chapter') || [];
  const isLoading = isSequenceLoading || isFallbackLoading;

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();
          
          setIsAdmin(!!userRoles);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const {
    visibleChapters,
    loadMoreRef,
    isLoadingMore,
    hasMore
  } = useInfiniteChapters({
    chapters: chaptersOnly,
    batchSize: 6
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading chapters...</p>
        </div>
      </div>
    );
  }

  // Handle content click
  const handleContentClick = (item: any) => {
    navigate(`/chapter/${item.content.id}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-12 space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-6 h-6 bg-accent animate-pulse"></div>
              <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                NARRATIVE CHAPTERS
              </h1>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-xl text-muted-foreground">
                {chaptersOnly.length} chapters available
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleChapters.map((item, index) => (
              <ContentCard
                key={`${item.type}-${item.content.id}`}
                item={item}
                index={index}
                isLocked={false} // Chapters are always accessible
                isCompleted={false}
                progress={0}
                onClick={() => handleContentClick(item)}
              />
            ))}
            
            {/* Loading skeletons */}
            {isLoadingMore && (
              Array.from({ length: 3 }).map((_, index) => (
                <ChapterSkeleton key={`skeleton-${index}`} />
              ))
            )}
          </div>

          {/* Load More Sentinel */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-mono">Loading more chapters...</span>
              </div>
            </div>
          )}

          {/* Completion Message */}
          {!hasMore && chaptersOnly.length > 0 && (
            <div className="text-center py-12 border-t border-border">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-2xl font-institutional uppercase tracking-wide text-accent">
                  All Chapters Available
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  You have access to all narrative chapters in the collection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Chapter Manager FAB */}
        {isAdmin && <ContentManagerFAB />}
      </div>
    </AppLayout>
  );
};

export default ReadChapters;