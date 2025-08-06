import React, { useEffect, useState } from 'react';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { ContentCard } from '@/components/ContentCard';
import { ContentEditorModal } from '@/components/admin/ContentEditorModal';
import { ChapterSkeleton } from '@/components/ChapterSkeleton';
import { Flame } from 'lucide-react';
import { useInfiniteChapters } from '@/hooks/useInfiniteChapters';
import { ContentManagerFAB } from '@/components/admin/ContentManagerFAB';
import { supabase } from '@/integrations/supabase/client';
import WeekEditorModal from '@/components/admin/WeekEditorModal';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedContent from '@/components/ProtectedContent';

const LearnLessons = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
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
      </AppLayout>
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

  // Admin: handle edit click
  const handleEditClick = (item: any) => {
    setEditingModule(item);
    setEditorOpen(true);
  };

  const completedModules = progressData?.filter(p => p.completed).length || 0;
  const totalModules = modulesOnly.length;

  return (
    <AppLayout>
      <ProtectedContent>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <button
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 font-semibold shadow"
                onClick={() => setWeekModalOpen(true)}
              >
                + Create New Week
              </button>
            </div>
          )}
          {/* Admin: Week Editor Modal */}
          {isAdmin && (
            <WeekEditorModal
              isOpen={weekModalOpen}
              onClose={() => setWeekModalOpen(false)}
              onCreated={() => setWeekModalOpen(false)}
            />
          )}
            <div className="text-center mb-12 space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-6 bg-accent animate-pulse"></div>
                <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  TRAINING WEEKS
                </h1>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground">
                  {weeks?.length || 0} weeks of structured training content
                </p>
                <p className="text-sm text-muted-foreground">
                  Each week contains modules, tasks, assignments, and review steps to guide your progress.
                </p>
              </div>
            </div>

            {/* Weeks Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {weeks?.map((week) => (
                <WeekCard
                  key={week.id}
                  week={week}
                  onClick={() => navigate(`/learn/${week.id}`)}
                  className="hover:border-accent/50"
                />
              ))}
            </div>

            {/* Empty State */}
            {!weeks?.length && (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Training Weeks Available</h3>
                <p className="text-muted-foreground">
                  Training content will be available once it's been created by administrators.
                </p>
              </div>
            )}
          </div>
        </div>
      </ProtectedContent>
    </AppLayout>
  );
};

export default LearnLessons;