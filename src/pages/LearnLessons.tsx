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
import ProtectedContent from '@/components/ProtectedContent';

const LearnLessons = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Try to use content sequence first, fallback to mixed content
  const { data: sequencedContent, isLoading: isSequenceLoading } = useContentSequence();
  const { data: fallbackContent, isLoading: isFallbackLoading } = useFallbackMixedContent();
  const { data: progressData } = useAllUserProgress();

  // Use sequenced content if available, otherwise fallback
  const mixedContent = sequencedContent?.length ? sequencedContent : fallbackContent;
  
  // Filter to only show modules
  const modulesOnly = mixedContent?.filter(item => item.type === 'lesson') || [];
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
    chapters: modulesOnly,
    batchSize: 6
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  // Process progress data into a map for efficient lookup
  const progressMap = new Map(
    progressData?.map(progress => [progress.lesson_id, progress]) || []
  );

  // Helper function to determine lesson status
  const getLessonStatus = (item: any, index: number) => {
    const progress = progressMap.get(item.content.id);
    if (progress?.completed) return 'complete';
    
    // All lessons are now accessible regardless of previous completion
    return 'in_progress';
  };

  // Helper function to get lesson progress percentage (only content_read and quiz_completed)
  const getLessonProgress = (item: any) => {
    const progress = progressMap.get(item.content.id);
    if (!progress) return 0;
    let completedCount = 0;
    if (progress.content_read) completedCount++;
    if (progress.quiz_completed) completedCount++;
    return Math.round((completedCount / 2) * 100);
  };

  // Handle content click
  const handleContentClick = (item: any) => {
    navigate(`/lesson/${item.content.id}`);
  };

  const completedModules = progressData?.filter(p => p.completed).length || 0;
  const totalModules = modulesOnly.length;

  return (
    <AppLayout>
      <ProtectedContent>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Enhanced Header */}
            <div className="text-center mb-12 space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-6 bg-accent animate-pulse"></div>
                <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  TRAINING MODULES
                </h1>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground">
                  {completedModules} of {totalModules} modules completed
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${totalModules > 0 ? (completedModules / totalModules) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Blog-Style Content Feed */}
            <div className="max-w-4xl mx-auto space-y-8 mb-8">
              {visibleChapters.map((item, index) => (
                <ContentCard
                  key={`${item.type}-${item.content.id}`}
                  item={item}
                  index={index}
                  isLocked={false}
                  isCompleted={getLessonStatus(item, index) === 'complete'}
                  progress={getLessonProgress(item)}
                  onClick={() => handleContentClick(item)}
                />
              ))}
              
              {/* Loading skeletons */}
              {isLoadingMore && (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ChapterSkeleton key={`skeleton-${index}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Load More Sentinel */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flame className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-mono">Loading more modules...</span>
                </div>
              </div>
            )}

            {/* Completion Message */}
            {!hasMore && totalModules > 0 && (
              <div className="text-center py-12 border-t border-border">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-2xl font-institutional uppercase tracking-wide text-accent">
                    Training Complete
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    You have completed all available modules in the training curriculum.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Admin Content Manager FAB */}
          {isAdmin && <ContentManagerFAB />}
        </div>
      </ProtectedContent>
    </AppLayout>
  );
};

export default LearnLessons;