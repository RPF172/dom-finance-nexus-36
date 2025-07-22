
import React, { useEffect, useState } from 'react';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { ContentCard } from '@/components/ContentCard';
import { ChapterSkeleton } from '@/components/ChapterSkeleton';
import { Flame } from 'lucide-react';
import { useInfiniteChapters } from '@/hooks/useInfiniteChapters';
import { ChapterManagerFAB } from '@/components/admin/ChapterManagerFAB';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Chapter } from '@/hooks/useChapters';
import { Lesson } from '@/hooks/useLessons';
import AppLayout from '@/components/layout/AppLayout';

const BookReader = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Try to use content sequence first, fallback to mixed content
  const { data: sequencedContent, isLoading: isSequenceLoading } = useContentSequence();
  const { data: fallbackContent, isLoading: isFallbackLoading } = useFallbackMixedContent();
  const { data: progressData } = useAllUserProgress();

  // Use sequenced content if available, otherwise fallback
  const mixedContent = sequencedContent?.length ? sequencedContent : fallbackContent;
  const isLoading = isSequenceLoading || isFallbackLoading;

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if user has admin role
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
    chapters: mixedContent || [],
    batchSize: 6
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading your content...</p>
        </div>
      </div>
    );
  }

  // Process progress data into a map for efficient lookup
  const progressMap = new Map(
    progressData?.map(progress => [progress.lesson_id, progress]) || []
  );

  // Helper function to determine content status
  const getContentStatus = (item: any, index: number) => {
    if (item.type === 'chapter') {
      // Chapters are always accessible if previous content is complete
      if (index === 0) return 'in_progress';
      const previousItem = visibleChapters[index - 1];
      if (previousItem?.type === 'lesson') {
        const progress = progressMap.get(previousItem.content.id);
        return progress?.completed ? 'in_progress' : 'locked';
      }
      return 'in_progress';
    } else {
      // Lesson logic
      const progress = progressMap.get(item.content.id);
      if (progress?.completed) return 'complete';
      
      // First lesson is always unlocked
      if (index === 0) return 'in_progress';
      
      // Check if previous content is completed
      const previousItem = visibleChapters[index - 1];
      if (previousItem) {
        if (previousItem.type === 'chapter') {
          return 'in_progress'; // Lessons after chapters are unlocked
        } else {
          const previousProgress = progressMap.get(previousItem.content.id);
          return previousProgress?.completed ? 'in_progress' : 'locked';
        }
      }
      
      return 'locked';
    }
  };

  // Helper function to get lesson progress percentage
  const getLessonProgress = (item: any) => {
    if (item.type === 'chapter') return 0; // Chapters don't have progress
    
    const progress = progressMap.get(item.content.id);
    if (!progress) return 0;
    
    let completedCount = 0;
    if (progress.content_read) completedCount++;
    if (progress.quiz_completed) completedCount++;
    if (progress.assignment_submitted) completedCount++;
    if (progress.ritual_completed) completedCount++;
    
    return Math.round((completedCount / 4) * 100);
  };

  // Handle content click
  const handleContentClick = (item: any) => {
    if (item.type === 'chapter') {
      navigate(`/chapter/${item.content.id}`);
    } else {
      navigate(`/lesson/${item.content.id}`);
    }
  };

  const completedLessons = progressData?.filter(p => p.completed).length || 0;
  const totalLessons = visibleChapters.filter(item => item.type === 'lesson').length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-12 space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-6 h-6 bg-accent animate-pulse"></div>
              <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                MAGAT UNIVERSITY: INITIATION WEEK
              </h1>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-xl text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleChapters.map((item, index) => (
              <ContentCard
                key={`${item.type}-${item.content.id}`}
                item={item}
                index={index}
                isLocked={getContentStatus(item, index) === 'locked'}
                isCompleted={getContentStatus(item, index) === 'complete'}
                progress={getLessonProgress(item)}
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
          {!hasMore && totalLessons > 0 && (
            <div className="text-center py-12 border-t border-border">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-2xl font-institutional uppercase tracking-wide text-accent">
                  Journey Complete
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  You have reached the end of your initiation week materials. Continue your institutional education.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Chapter Manager FAB */}
        {isAdmin && <ChapterManagerFAB />}
      </div>
    </AppLayout>
  );
};

export default BookReader;
