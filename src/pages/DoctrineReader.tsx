import React from 'react';
import { Lock, Play, CheckCircle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLessons, useModules } from '@/hooks/useLessons';
import { useAllUserProgress } from '@/hooks/useProgress';
import { Link } from 'react-router-dom';
import SlidingBottomNav from '@/components/SlidingBottomNav';

const DoctrineReader = () => {
  const { data: lessons, isLoading } = useLessons();
  const { data: progressData } = useAllUserProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <Flame className="h-8 w-8 text-accent animate-pulse mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading scriptures...</p>
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
    if (index === 0) return 'in_progress'; // First lesson is always available
    
    // Check if previous lesson is completed
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
    let total = 4; // content_read, quiz_completed, assignment_submitted, ritual_completed
    
    if (progress.content_read) completed++;
    if (progress.quiz_completed) completed++;
    if (progress.assignment_submitted) completed++;
    if (progress.ritual_completed) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-amber-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string, progress?: number) => {
    switch (status) {
      case 'complete':
        return '✓ Complete';
      case 'in_progress':
        return `🔓 In Progress (${progress || 0}%)`;
      case 'locked':
        return '🔒 Locked';
    }
  };

  const getActionButton = (lesson: any, status: string, index: number) => {
    switch (status) {
      case 'complete':
        return (
          <Button variant="outline" size="sm" className="w-full bg-emerald-950/30 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50" asChild>
            <Link to={`/lesson/${lesson.id}`}>REVIEW</Link>
          </Button>
        );
      case 'in_progress':
        return (
          <Button size="sm" className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-mono" asChild>
            <Link to={`/lesson/${lesson.id}`}>CONTINUE</Link>
          </Button>
        );
      case 'locked':
        return (
          <Button variant="outline" size="sm" className="w-full border-muted-foreground/30 text-muted-foreground hover:bg-muted/20" disabled>
            {index === 0 ? 'UNLOCK REQUIREMENT' : 'COMPLETE PREVIOUS LESSON'}
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b border-muted">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Flame className="h-6 w-6 text-accent" />
            THE DOCTRINE
          </div>
          <div className="text-sm text-muted-foreground">
            Rank: INITIATE WHELP
          </div>
          <div className="text-sm text-muted-foreground">
            Progress: {completedLessons} / {totalLessons} Scriptures Claimed
          </div>
        </div>

        {/* Scripture Cards */}
        <div className="space-y-4">
          {lessons?.map((lesson, index) => {
            const status = getLessonStatus(lesson.id, index);
            const progress = getLessonProgress(lesson.id);
            
            return (
              <Card 
                key={lesson.id} 
                className={`bg-card border-muted transition-all duration-200 ${
                  status === 'locked' 
                    ? 'opacity-75 hover:opacity-90' 
                    : 'hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-accent flex-shrink-0" />
                      <h3 className="font-bold text-sm leading-tight">
                        {lesson.title}
                      </h3>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{lesson.objective || 'Learn the ways of the Institution'}"
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Status: {getStatusText(status, progress)}
                    </span>
                    {status === 'in_progress' && progress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-accent">{progress}%</span>
                      </div>
                    )}
                  </div>

                  {status === 'locked' && index > 0 && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-muted">
                      Requires: Complete previous lesson
                    </div>
                  )}

                  {getActionButton(lesson, status, index)}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Footer */}
        <div className="text-center space-y-2 pt-6 border-t border-muted">
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-emerald-400">
              🔓 Completed: {completedLessons}
            </span>
            <span className="text-muted-foreground">
              🔒 Remaining: {totalLessons - completedLessons}
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            📖 Scroll to reveal deeper indoctrination
          </p>
        </div>

        <SlidingBottomNav />
      </div>
    </div>
  );
};

export default DoctrineReader;