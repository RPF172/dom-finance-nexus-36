import React, { useEffect, useState } from 'react';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { ContentCard } from '@/components/ContentCard';
import { ContentEditorModal } from '@/components/admin/ContentEditorModal';
import { ChapterSkeleton } from '@/components/ChapterSkeleton';
import { Flame, GraduationCap, Settings, Play, BookOpen, Zap } from 'lucide-react';
import { useInfiniteChapters } from '@/hooks/useInfiniteChapters';
import { ContentManagerFAB } from '@/components/admin/ContentManagerFAB';
import { supabase } from '@/integrations/supabase/client';
import WeekEditorModal from '@/components/admin/WeekEditorModal';
import { useWeeks } from '@/hooks/useWeeks';
import { WeekCard } from '@/components/WeekCard';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedContent from '@/components/ProtectedContent';
import { SlideBuilder } from '@/components/admin/SlideBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const LearnLessons = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [slideBuilderOpen, setSlideBuilderOpen] = useState(false);
  const [selectedModuleForSlides, setSelectedModuleForSlides] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch weeks
  const { data: weeks, isLoading: weeksLoading } = useWeeks();

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

  if (isLoading || weeksLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
            <p className="text-muted-foreground">Loading modules...</p>
          </div>
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
    // Check if module has slide experience
    const isLesson = item.type === 'lesson';
    const hasSlideExperience = isLesson && (item.content as any).has_slide_experience;
    
    if (hasSlideExperience) {
      navigate(`/modules/${item.content.id}/experience`);
    } else {
      navigate(`/lesson/${item.content.id}`);
    }
  };

  // Admin: handle edit click
  const handleEditClick = (item: any) => {
    setEditingModule(item);
    setEditorOpen(true);
  };

  // Admin: handle slide builder
  const handleSlideBuilder = (moduleId: string) => {
    setSelectedModuleForSlides(moduleId);
    setSlideBuilderOpen(true);
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
            <div className="text-center mb-12 space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-6 bg-accent animate-pulse"></div>
                <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  INDOCTRINATION MODULES
                </h1>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground">
                  {modulesOnly.length} interactive training modules • {weeks?.length || 0} structured weeks
                </p>
                <p className="text-sm text-muted-foreground">
                  Experience immersive slide-based indoctrination or traditional reading modules.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    <span>Slide Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Traditional Reading</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modules Grid - Enhanced for Slide Experience */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {modulesOnly.map((item, index) => {
                const status = getLessonStatus(item, index);
                const progress = getLessonProgress(item);
                const isCompleted = status === 'complete';
                const isLocked = false; // All lessons accessible now
                
                // Type guard for lesson properties
                const isLesson = item.type === 'lesson';
                const hasSlideExperience = isLesson && (item.content as any).has_slide_experience;
                const objective = isLesson ? (item.content as any).objective : null;
                const estimatedTime = isLesson ? (item.content as any).estimated_time : 45;

                return (
                  <Card key={item.content.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {hasSlideExperience ? (
                            <Zap className="h-5 w-5 text-destructive" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-primary" />
                          )}
                          <CardTitle className="text-lg font-institutional uppercase tracking-wide">
                            {item.content.title}
                          </CardTitle>
                        </div>
                        {isAdmin && (
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(item)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSlideBuilder(item.content.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {hasSlideExperience && (
                          <Badge variant="destructive" className="text-xs">
                            SLIDE EXPERIENCE
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            COMPLETED
                          </Badge>
                        )}
                        {progress > 0 && progress < 100 && (
                          <Badge variant="outline" className="text-xs">
                            {progress}% Progress
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {objective && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {objective}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>Est. {estimatedTime || 45} min</span>
                        <span>{hasSlideExperience ? 'Interactive Experience' : 'Traditional Reading'}</span>
                      </div>
                      
                      <Button
                        onClick={() => handleContentClick(item)}
                        className={`w-full ${hasSlideExperience 
                          ? 'bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70' 
                          : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                        }`}
                        disabled={isLocked}
                      >
                        {hasSlideExperience ? (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Start Indoctrination
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4 mr-2" />
                            {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
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
            {!weeks?.length && !modulesOnly?.length && (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Training Content Available</h3>
                <p className="text-muted-foreground">
                  Training modules and weeks will be available once they've been created by administrators.
                </p>
              </div>
            )}

            {/* Admin Modals */}
            {isAdmin && (
              <>
                <WeekEditorModal
                  isOpen={weekModalOpen}
                  onClose={() => setWeekModalOpen(false)}
                  onCreated={() => setWeekModalOpen(false)}
                />
                
                <Dialog open={slideBuilderOpen} onOpenChange={setSlideBuilderOpen}>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-institutional uppercase tracking-wider">
                        Slide Experience Builder
                      </DialogTitle>
                    </DialogHeader>
                    {selectedModuleForSlides && (
                      <SlideBuilder
                        moduleId={selectedModuleForSlides}
                        onSave={() => {
                          setSlideBuilderOpen(false);
                          // Refresh data
                          window.location.reload();
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </ProtectedContent>
    </AppLayout>
  );
};

export default LearnLessons;