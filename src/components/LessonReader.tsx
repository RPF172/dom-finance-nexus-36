import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Eye, Clock, Flame, FileText, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChapterIllustration } from '@/components/ChapterIllustration';
import { ReadingProgressRing } from '@/components/ReadingProgressRing';
import { cn } from '@/lib/utils';

interface LessonReaderProps {
  lesson: any;
  progress: any;
  onBack: () => void;
  onProgressUpdate: (progress: any) => void;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  progress,
  onBack,
  onProgressUpdate
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [hasStartedReading, setHasStartedReading] = useState(false);

  // Calculate reading time based on content length
  const estimatedReadingTime = Math.max(3, Math.ceil((lesson.body_text?.length || 0) / 200));
  
  // Calculate overall lesson progress
  const calculateOverallProgress = () => {
    let completed = 0;
    let total = 4;
    
    if (progress?.content_read || readingProgress >= 90) completed++;
    if (progress?.quiz_completed) completed++;
    if (progress?.assignment_submitted) completed++;
    if (progress?.ritual_completed) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Simulate reading progress based on scroll and time
  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      setReadingProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        
        // Mark content as read when 90% progress reached
        if (newProgress >= 90 && !progress?.content_read) {
          onProgressUpdate({
            lesson_id: lesson.id,
            content_read: true,
            quiz_completed: progress?.quiz_completed || false,
            assignment_submitted: progress?.assignment_submitted || false,
            ritual_completed: progress?.ritual_completed || false
          });
        }
        
        return newProgress;
      });
    }, estimatedReadingTime * 600 / 100); // Distribute over estimated reading time

    return () => clearInterval(interval);
  }, [isReading, estimatedReadingTime, lesson.id, progress, onProgressUpdate]);

  const handleStartReading = () => {
    setIsReading(true);
    setHasStartedReading(true);
  };

  const handlePauseReading = () => {
    setIsReading(false);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Enhanced Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Book
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-accent shrink-0" />
                <h1 className="font-institutional text-lg uppercase tracking-wide truncate">
                  {lesson.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{estimatedReadingTime} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{readingProgress}% read</span>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="shrink-0">
              <ReadingProgressRing progress={overallProgress} size="sm" />
            </div>
          </div>

          {/* Reading Progress Bar */}
          <div className="mt-3">
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson Illustration */}
            <Card className="overflow-hidden border-2 border-accent/20">
              <div className="relative h-64 md:h-80">
                <ChapterIllustration
                  chapterIndex={lesson.order || 0}
                  title={lesson.title}
                  className="h-full"
                />
                
                {/* Reading Status Overlay */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-black/50 text-white border-none backdrop-blur-sm"
                  >
                    {isReading ? '👁️ Reading' : hasStartedReading ? '⏸️ Paused' : '📖 Ready'}
                  </Badge>
                </div>

                {/* Lesson Number */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-mono font-bold">
                    Lesson {(lesson.order || 0) + 1}
                  </div>
                </div>
              </div>
            </Card>

            {/* Lesson Objective */}
            {lesson.objective && (
              <Card className="border-l-4 border-l-accent bg-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
                    <div>
                      <h3 className="font-institutional text-sm uppercase tracking-wide mb-2">
                        Learning Objective
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {lesson.objective}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reading Content */}
            <Card className="border-2 border-accent/10">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    <h2 className="font-institutional text-base uppercase tracking-wide">
                      Lesson Content
                    </h2>
                  </div>
                  
                  {!hasStartedReading ? (
                    <Button
                      onClick={handleStartReading}
                      className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Start Reading
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={isReading ? handlePauseReading : handleStartReading}
                      className="border-accent/30 text-accent hover:bg-accent/10"
                    >
                      {isReading ? '⏸️ Pause' : '▶️ Resume'}
                    </Button>
                  )}
                </div>

                {/* Lesson Text */}
                <div className={cn(
                  "prose prose-sm max-w-none transition-all duration-300",
                  !hasStartedReading && "blur-sm opacity-60 pointer-events-none"
                )}>
                  <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90 font-inter">
                    {lesson.body_text}
                  </div>
                </div>

                {/* Reading Completion */}
                {readingProgress >= 90 && (
                  <div className="mt-8 p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Flame className="h-4 w-4" />
                      <span className="font-mono text-sm">Lesson Content Mastered</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Metadata */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-institutional text-sm uppercase tracking-wide">
                  Lesson Details
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reading Time:</span>
                    <span className="font-mono">{estimatedReadingTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-mono">{readingProgress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={readingProgress >= 90 ? "default" : "secondary"}>
                      {readingProgress >= 90 ? 'Complete' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Elements */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-institutional text-sm uppercase tracking-wide">
                  Learning Elements
                </h3>
                
                <div className="space-y-3">
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    readingProgress >= 90 ? "bg-emerald-950/20 border-emerald-800/30" : "bg-muted/30 border-muted"
                  )}>
                    <FileText className={cn(
                      "h-4 w-4",
                      readingProgress >= 90 ? "text-emerald-400" : "text-muted-foreground"
                    )} />
                    <span className="text-sm">Lesson Content</span>
                    {readingProgress >= 90 && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    progress?.quiz_completed ? "bg-emerald-950/20 border-emerald-800/30" : "bg-muted/30 border-muted"
                  )}>
                    <Brain className={cn(
                      "h-4 w-4",
                      progress?.quiz_completed ? "text-emerald-400" : "text-muted-foreground"
                    )} />
                    <span className="text-sm">Knowledge Quiz</span>
                    {progress?.quiz_completed && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    progress?.assignment_submitted ? "bg-emerald-950/20 border-emerald-800/30" : "bg-muted/30 border-muted"
                  )}>
                    <Target className={cn(
                      "h-4 w-4",
                      progress?.assignment_submitted ? "text-emerald-400" : "text-muted-foreground"
                    )} />
                    <span className="text-sm">Practical Task</span>
                    {progress?.assignment_submitted && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {readingProgress >= 90 && (
              <Card className="border-accent/30">
                <CardContent className="p-6 text-center space-y-4">
                  <Flame className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-institutional text-sm uppercase tracking-wide">
                    Reading Complete
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Continue to quiz and practical exercises to master this lesson.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                    onClick={onBack}
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};