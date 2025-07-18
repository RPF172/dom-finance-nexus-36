import React from 'react';
import { Lock, Play, CheckCircle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLessons, useModules } from '@/hooks/useLessons';
import { useAllUserProgress } from '@/hooks/useProgress';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const DoctrineReader = () => {
  const { data: lessons, isLoading } = useLessons();
  const { data: progressData } = useAllUserProgress();

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
    <AppLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="page-header animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 bg-accent animate-pulse"></div>
              <h1 className="text-3xl font-institutional uppercase tracking-wide">MAGAT UNIVERSITY: INITIATION WEEK</h1>
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              RANK: FRESHMAN PLEDGE
            </div>
            <div className="text-sm text-muted-foreground">
              Progress: <span className="text-accent font-medium">{completedLessons}</span> / {totalLessons} Chapters Read
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-500 animate-pulse"
                style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Chapter Cards */}
          <div className="grid-cards">
            {lessons?.map((lesson, index) => {
              const status = getLessonStatus(lesson.id, index);
              const progress = getLessonProgress(lesson.id);
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`institutional-card hover:scale-105 transition-all duration-300 hover:shadow-xl ${
                    status === 'locked' 
                      ? 'opacity-60 hover:scale-100' 
                      : status === 'complete'
                      ? 'border-green-500/30 bg-green-50/10 border-l-4 border-l-green-500'
                      : status === 'in_progress'
                      ? 'border-l-4 border-l-accent bg-gradient-to-r from-card to-accent/5'
                      : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-accent flex-shrink-0"></div>
                        <h3 className="font-institutional text-base leading-tight uppercase tracking-wide">
                          {lesson.title}
                        </h3>
                      </div>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {lesson.objective || 'Learn the institutional principles'}
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

          {/* Progress Summary */}
          <div className="text-center space-y-4 pt-8 border-t border-border">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="institutional-card p-4 text-center">
                <div className="text-2xl font-mono text-accent mb-1">{completedLessons}</div>
                <div className="text-xs font-institutional uppercase tracking-wide">Completed</div>
              </div>
              <div className="institutional-card p-4 text-center">
                <div className="text-2xl font-mono text-muted-foreground mb-1">{totalLessons - completedLessons}</div>
                <div className="text-xs font-institutional uppercase tracking-wide">Remaining</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              Continue your institutional education
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DoctrineReader;