import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Eye, Clock, Flame, FileText, Brain, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChapterIllustration } from '@/components/ChapterIllustration';
import { ReadingProgressRing } from '@/components/ReadingProgressRing';
import { useChapterQuizzes } from '@/hooks/useChapters';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChapterReaderProps {
  chapter: any;
  onBack: () => void;
  onContinue: () => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapter,
  onBack,
  onContinue
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [hasStartedReading, setHasStartedReading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { toast } = useToast();
  const { data: quizzes } = useChapterQuizzes(chapter.id);

  // Calculate reading time based on content length
  const estimatedReadingTime = Math.max(3, Math.ceil((chapter.body_text?.length || 0) / 200));
  
  // Simulate reading progress based on scroll and time
  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      setReadingProgress(prev => Math.min(prev + 1, 100));
    }, estimatedReadingTime * 600 / 100); // Distribute over estimated reading time

    return () => clearInterval(interval);
  }, [isReading, estimatedReadingTime]);

  const handleStartReading = () => {
    setIsReading(true);
    setHasStartedReading(true);
  };

  const handlePauseReading = () => {
    setIsReading(false);
  };

  const handleMarkCompleted = () => {
    setIsCompleted(true);
    toast({
      title: "Chapter Completed",
      description: "Your understanding has been recorded. Continue to the next chapter."
    });
  };

  const hasQuizzes = quizzes && quizzes.length > 0;
  const canComplete = readingProgress >= 90;

  

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
                  {chapter.title}
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
            {/* Chapter Illustration */}
            <Card className="overflow-hidden border-2 border-accent/20">
              <div className="relative h-64 md:h-80">
                <ChapterIllustration
                  chapterIndex={chapter.order_index || 0}
                  title={chapter.title}
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

                {/* Chapter Number */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-mono font-bold">
                    Chapter {(chapter.order_index || 0) + 1}
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
                      Chapter Content
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

                {/* Chapter Text */}
                <div className={cn(
                  "prose prose-sm max-w-none transition-all duration-300",
                  !hasStartedReading && "blur-sm opacity-60 pointer-events-none"
                )}>
                  <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90 font-inter">
                    {chapter.body_text}
                  </div>
                </div>

                {/* Reading Completion */}
                {readingProgress >= 90 && (
                  <div className="mt-8 p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Flame className="h-4 w-4" />
                      <span className="font-mono text-sm">Chapter Content Mastered</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chapter Metadata */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-institutional text-sm uppercase tracking-wide">
                  Chapter Details
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


            {/* Completion Actions */}
            {readingProgress >= 90 && !isCompleted && (
              <Card className="border-accent/30">
                <CardContent className="p-6 text-center space-y-4">
                  <Flame className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-institutional text-sm uppercase tracking-wide">
                    Ready to Complete
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {hasQuizzes 
                      ? "This chapter has associated quizzes. Complete reading to continue to exercises."
                      : "Mark this chapter as complete to continue your journey."
                    }
                  </p>
                  
                  {hasQuizzes ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                      onClick={onContinue}
                    >
                      Continue to Exercises
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                      onClick={handleMarkCompleted}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Completed
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Completion Confirmation */}
            {isCompleted && (
              <Card className="border-emerald-500/30 bg-emerald-950/20">
                <CardContent className="p-6 text-center space-y-4">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h3 className="font-institutional text-sm uppercase tracking-wide text-emerald-400">
                    Chapter Completed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Well done! You've mastered this chapter.
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30"
                    onClick={onContinue}
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