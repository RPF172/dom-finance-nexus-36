import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Eye, Clock, Flame, FileText, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChapterIllustration } from '@/components/ChapterIllustration';
import { ReadingProgressRing } from '@/components/ReadingProgressRing';
import { cn } from '@/lib/utils';

// Simple HTML sanitization function
const sanitizeHtml = (html: string): string => {
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
};

interface Lesson {
  id: string;
  title: string;
  body_text?: string;
  module_id?: string;
  order?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Progress {
  lesson_id: string;
  content_read: boolean;
  quiz_completed: boolean;
  assignment_submitted: boolean;
  ritual_completed: boolean;
}

interface LessonReaderProps {
  lesson: Lesson;
  progress: Progress | null;
  onBack: () => void;
  onProgressUpdate: (progress: Progress) => void;
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate reading time based on content length
  const estimatedReadingTime = Math.max(3, Math.ceil((lesson.body_text?.length || 0) / 200));
  
  // Calculate overall lesson progress
  const calculateOverallProgress = () => {
    let completed = 0;
    const total = 4;
    
    if (progress?.content_read || readingProgress >= 90) completed++;
    if (progress?.quiz_completed) completed++;
    if (progress?.assignment_submitted) completed++;
    if (progress?.ritual_completed) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Update reading progress based on scroll depth
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const percent = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
      setReadingProgress(percent);
      
      if (percent >= 90 && !progress?.content_read) {
        onProgressUpdate({
          lesson_id: lesson.id,
          content_read: true,
          quiz_completed: progress?.quiz_completed || false,
          assignment_submitted: progress?.assignment_submitted || false,
          ritual_completed: progress?.ritual_completed || false
        });
      }
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }
    
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [progress, lesson.id, onProgressUpdate]);

  // Simulate reading progress based on scroll and time
  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      setReadingProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        
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
  }, [isReading, progress, lesson.id, onProgressUpdate, estimatedReadingTime]);

  const handleStartReading = () => {
    setIsReading(true);
    setHasStartedReading(true);
  };

  const overallProgress = calculateOverallProgress();
  const sanitizedContent = lesson.body_text ? sanitizeHtml(lesson.body_text) : '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
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
            
            <ReadingProgressRing progress={overallProgress} size="sm" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className={cn(
              "transition-colors",
              (progress?.content_read || readingProgress >= 90) && "bg-green-50 border-green-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Content Read</span>
                </div>
                <Badge variant={progress?.content_read || readingProgress >= 90 ? "default" : "secondary"} className="mt-2">
                  {progress?.content_read || readingProgress >= 90 ? "Complete" : "In Progress"}
                </Badge>
              </CardContent>
            </Card>

            <Card className={cn(
              "transition-colors",
              progress?.quiz_completed && "bg-green-50 border-green-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Quiz</span>
                </div>
                <Badge variant={progress?.quiz_completed ? "default" : "secondary"} className="mt-2">
                  {progress?.quiz_completed ? "Complete" : "Pending"}
                </Badge>
              </CardContent>
            </Card>

            <Card className={cn(
              "transition-colors",
              progress?.assignment_submitted && "bg-green-50 border-green-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Assignment</span>
                </div>
                <Badge variant={progress?.assignment_submitted ? "default" : "secondary"} className="mt-2">
                  {progress?.assignment_submitted ? "Complete" : "Pending"}
                </Badge>
              </CardContent>
            </Card>

            <Card className={cn(
              "transition-colors",
              progress?.ritual_completed && "bg-green-50 border-green-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ritual</span>
                </div>
                <Badge variant={progress?.ritual_completed ? "default" : "secondary"} className="mt-2">
                  {progress?.ritual_completed ? "Complete" : "Pending"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <Card className="mb-8">
            <CardContent className="p-6">
              {!hasStartedReading ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <ChapterIllustration chapterIndex={0} title={lesson.title} className="w-32 h-32 mx-auto rounded-lg" />
                  </div>
                  <h2 className="text-2xl font-institutional uppercase tracking-wide mb-4">
                    Begin Your Study
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Prepare yourself for the knowledge that awaits. This lesson will take approximately {estimatedReadingTime} minutes to complete.
                  </p>
                  <Button onClick={handleStartReading} size="lg">
                    <Target className="h-4 w-4 mr-2" />
                    Begin Reading
                  </Button>
                </div>
              ) : (
                <div 
                  ref={contentRef}
                  className="prose prose-slate max-w-none prose-headings:font-institutional prose-headings:uppercase prose-headings:tracking-wide"
                  style={{ maxHeight: '70vh', overflowY: 'auto' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {hasStartedReading && (
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg">
                <Brain className="h-4 w-4 mr-2" />
                Take Quiz
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
              <Button variant="outline" size="lg">
                <Flame className="h-4 w-4 mr-2" />
                Complete Ritual
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};