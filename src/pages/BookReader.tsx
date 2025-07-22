
import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';
import { useAllUserProgress } from '@/hooks/useProgress';
import { useInfiniteChapters } from '@/hooks/useInfiniteChapters';
import { ChapterCard } from '@/components/ChapterCard';
import { ChapterSkeleton } from '@/components/ChapterSkeleton';
import { ChapterManagerFAB } from '@/components/admin/ChapterManagerFAB';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';

const BookReader = () => {
  const { data: lessons, isLoading } = useLessons();
  const { data: progressData } = useAllUserProgress();
  const [isAdmin, setIsAdmin] = useState(false);

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
    chapters: lessons || [],
    batchSize: 6
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <Flame className="h-8 w-8 text-accent animate-pulse mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading chapters...</p>
        </div>
      </div>
    );
  }

  const progressMap = new Map(progressData?.map(p => [p.lesson_id, p]) || []);
  const completedLessons = progressData?.filter(p => p.completed).length || 0;
  const totalLessons = lessons?.length || 0;

  const getLessonStatus = (lessonId: string, index: number) => {
    const progress = progressMap.get(lessonId);
    if (progress?.completed) return 'complete';
    if (progress && !progress.completed) return 'in_progress';
    if (index === 0) return 'in_progress';
    
    const previousLesson = lessons?.[index - 1];
    if (previousLesson) {
      const previousProgress = progressMap.get(previousLesson.id);
      if (previousProgress?.completed) return 'in_progress';
    }
    
    return 'locked';
  };

  const getLessonProgress = (lessonId: string) => {
    const progress = progressMap.get(lessonId);
    if (!progress) return 0;
    
    let completed = 0;
    let total = 4;
    
    if (progress.content_read) completed++;
    if (progress.quiz_completed) completed++;
    if (progress.assignment_submitted) completed++;
    if (progress.ritual_completed) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getEstimatedTime = (lesson: any) => {
    // Estimate reading time based on content length
    const contentLength = (lesson.body_text || '').length + (lesson.assignment_text || '').length;
    return Math.max(5, Math.ceil(contentLength / 200)); // ~200 chars per minute
  };

  const getDifficulty = (index: number) => {
    // Simple difficulty progression
    if (index < 2) return 'beginner';
    if (index < 5) return 'intermediate';
    return 'advanced';
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
                MAGAT UNIVERSITY: INITIATION WEEK
              </h1>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-lg text-muted-foreground font-mono">
                RANK: FRESHMAN PLEDGE
              </div>
              
              {/* Progress Summary */}
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold text-xl">{completedLessons}</span>
                  <span className="text-muted-foreground">Chapters Complete</span>
                </div>
                <div className="w-px h-6 bg-border"></div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-bold text-xl">{totalLessons - completedLessons}</span>
                  <span className="text-muted-foreground">Remaining</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-muted h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-accent to-accent/80 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Chapter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {visibleChapters.map((lesson, index) => {
              const status = getLessonStatus(lesson.id, index);
              const progress = getLessonProgress(lesson.id);
              const estimatedTime = getEstimatedTime(lesson);
              const difficulty = getDifficulty(index);
              
              return (
                <div key={lesson.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ChapterCard
                    lesson={lesson}
                    index={index}
                    status={status}
                    progress={progress}
                    estimatedTime={estimatedTime}
                    difficulty={difficulty}
                  />
                </div>
              );
            })}

            {/* Loading Skeletons */}
            {isLoadingMore && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="animate-fade-in">
                    <ChapterSkeleton />
                  </div>
                ))}
              </>
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
      </div>

      {/* Admin Chapter Manager FAB */}
      {isAdmin && <ChapterManagerFAB />}
    </AppLayout>
  );
};

export default BookReader;
