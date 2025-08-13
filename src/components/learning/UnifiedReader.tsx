import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Eye, Clock, Flame, FileText, Brain, Target, CheckCircle, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChapterIllustration } from '@/components/ChapterIllustration';
import { ReadingProgressRing } from '@/components/ReadingProgressRing';
import { AchievementToast } from './AchievementToast';
import { StudySessionManager } from './StudySessionManager';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  body_text?: string;
  type: 'chapter' | 'lesson';
  order_index?: number;
  module_id?: string;
}

interface ReadingProgress {
  content_read: boolean;
  quiz_completed: boolean;
  assignment_submitted: boolean;
  ritual_completed: boolean;
  reading_time: number;
  achievements: string[];
}

interface UnifiedReaderProps {
  content: ContentItem;
  progress: ReadingProgress | null;
  onBack: () => void;
  onProgressUpdate: (progress: Partial<ReadingProgress>) => void;
  onContinue?: () => void;
}

export const UnifiedReader: React.FC<UnifiedReaderProps> = ({
  content,
  progress,
  onBack,
  onProgressUpdate,
  onContinue
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [hasStartedReading, setHasStartedReading] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalReadingTime, setTotalReadingTime] = useState(progress?.reading_time || 0);
  const [achievements, setAchievements] = useState<string[]>(progress?.achievements || []);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Calculate reading time based on content length
  const estimatedReadingTime = Math.max(3, Math.ceil((content.body_text?.length || 0) / 200));
  
  // Calculate overall completion percentage
  const calculateOverallProgress = () => {
    let completed = 0;
    const total = 4;
    
    if (progress?.content_read || readingProgress >= 90) completed++;
    if (progress?.quiz_completed) completed++;
    if (progress?.assignment_submitted) completed++;
    if (progress?.ritual_completed) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Track reading time
  useEffect(() => {
    if (!isReading || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const sessionTime = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60);
      setTotalReadingTime(prev => prev + 1);
      
      // Check for time-based achievements
      if (sessionTime >= 25 && !achievements.includes('focused_reader')) {
        const newAchievements = [...achievements, 'focused_reader'];
        setAchievements(newAchievements);
        onProgressUpdate({ achievements: newAchievements });
        toast({
          title: "🎯 Achievement Unlocked!",
          description: "Focused Reader - 25+ minutes of continuous reading"
        });
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isReading, startTime, achievements, onProgressUpdate, toast]);

  // Update reading progress based on scroll depth
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const percent = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
      setReadingProgress(percent);
      
      // Achievement: First time reading 90%
      if (percent >= 90 && !progress?.content_read && !achievements.includes('content_master')) {
        const newAchievements = [...achievements, 'content_master'];
        setAchievements(newAchievements);
        onProgressUpdate({ 
          content_read: true, 
          reading_time: totalReadingTime,
          achievements: newAchievements 
        });
      }
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [progress, content.id, onProgressUpdate, totalReadingTime, achievements]);

  const handleStartReading = () => {
    setIsReading(true);
    setHasStartedReading(true);
    setStartTime(new Date());
  };

  const handlePauseReading = () => {
    setIsReading(false);
    setStartTime(null);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Study Session Manager */}
      <StudySessionManager 
        isActive={isReading}
        startTime={startTime}
        onBreakSuggestion={() => {
          toast({
            title: "💡 Study Break Suggestion",
            description: "Consider taking a 5-minute break to maintain focus"
          });
        }}
      />

      {/* Enhanced Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-accent shrink-0" />
                <h1 className="font-institutional text-lg uppercase tracking-wide truncate">
                  {content.title}
                </h1>
                <Badge variant="outline" className="ml-2">
                  {content.type}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{estimatedReadingTime} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{readingProgress}% read</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{totalReadingTime} min studied</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>{achievements.length} achievements</span>
                </div>
              </div>
            </div>

            <ReadingProgressRing progress={overallProgress} size="md" />
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Reading Progress</span>
              <span>{readingProgress}%</span>
            </div>
            <Progress 
              value={readingProgress} 
              className="h-2 bg-muted"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Content Illustration */}
            <Card className="overflow-hidden border-2 border-accent/20">
              <div className="relative h-64 md:h-80">
                <ChapterIllustration
                  chapterIndex={content.order_index || 0}
                  title={content.title}
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

                {/* Content Type Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-mono font-bold capitalize">
                    {content.type} {content.order_index !== undefined && `${content.order_index + 1}`}
                  </div>
                </div>
              </div>
            </Card>

            {/* Reading Content */}
            <Card className="border-2 border-accent/10">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    <h2 className="font-institutional text-base uppercase tracking-wide">
                      {content.type} Content
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

                {/* Content Text */}
                <div className={cn(
                  "transition-all duration-300",
                  !hasStartedReading && "blur-sm opacity-60 pointer-events-none"
                )}>
                  <div 
                    ref={contentRef}
                    className="prose prose-sm max-w-none leading-relaxed text-foreground/90 font-inter"
                    style={{ maxHeight: '60vh', overflowY: 'auto' }}
                  >
                    <div className="whitespace-pre-line">
                      {content.body_text}
                    </div>
                  </div>
                </div>

                {/* Reading Completion */}
                {readingProgress >= 90 && (
                  <div className="mt-8 p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-mono text-sm">Content Mastered</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-institutional text-sm uppercase tracking-wide">
                  Learning Progress
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      Content
                    </span>
                    <Badge variant={progress?.content_read || readingProgress >= 90 ? "default" : "secondary"}>
                      {progress?.content_read || readingProgress >= 90 ? 'Complete' : `${readingProgress}%`}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Brain className="h-3 w-3" />
                      Quiz
                    </span>
                    <Badge variant={progress?.quiz_completed ? "default" : "secondary"}>
                      {progress?.quiz_completed ? 'Complete' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Assignment
                    </span>
                    <Badge variant={progress?.assignment_submitted ? "default" : "secondary"}>
                      {progress?.assignment_submitted ? 'Complete' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Flame className="h-3 w-3" />
                      Ritual
                    </span>
                    <Badge variant={progress?.ritual_completed ? "default" : "secondary"}>
                      {progress?.ritual_completed ? 'Complete' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Overall Progress</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Study Statistics */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-institutional text-sm uppercase tracking-wide">
                  Study Statistics
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Time:</span>
                    <span className="font-mono">{totalReadingTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session:</span>
                    <span className="font-mono">{isReading && startTime ? Math.floor((Date.now() - startTime.getTime()) / 60000) : 0} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Achievements:</span>
                    <span className="font-mono">{achievements.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {readingProgress >= 90 && (
              <Card className="border-accent/30">
                <CardContent className="p-6 text-center space-y-4">
                  <CheckCircle className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-institutional text-sm uppercase tracking-wide">
                    Ready for Next Steps
                  </h3>
                
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                      size="sm"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Take Quiz
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-accent/30 text-accent hover:bg-accent/10"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Assignment
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-accent/30 text-accent hover:bg-accent/10"
                      size="sm"
                    >
                      <Flame className="h-4 w-4 mr-2" />
                      Ritual
                    </Button>
                  </div>

                  {onContinue && (
                    <Button 
                      variant="ghost"
                      className="w-full mt-4"
                      onClick={onContinue}
                    >
                      Continue Learning
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Toasts */}
      <AchievementToast achievements={achievements} />
    </div>
  );
};