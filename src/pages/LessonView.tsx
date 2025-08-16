import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, Clock, Flame, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson, useQuizzes } from '@/hooks/useLessons';
import { useUserProgress, useUpdateProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';

interface Progress {
  lesson_id: string;
  content_read: boolean;
  quiz_completed: boolean;
  assignment_submitted: boolean;
  ritual_completed: boolean;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface Lesson {
  id: string;
  title: string;
  body_text?: string;
  estimated_time?: number;
  assignment_text?: string;
  ritual_text?: string;
}

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: lesson, isLoading: lessonLoading } = useLesson(id || '');
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes(id || '');
  const { data: progress, isLoading: progressLoading } = useUserProgress(id || '');
  const updateProgress = useUpdateProgress();

  const [activeView, setActiveView] = useState<'reader' | 'quiz' | 'assignment' | 'ritual'>('reader');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [assignmentText, setAssignmentText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  if (lessonLoading || quizzesLoading || progressLoading) {
    return (
      <AppLayout>
        <div className="p-6 text-center">Loading lesson...</div>
      </AppLayout>
    );
  }

  if (!lesson) {
    return (
      <AppLayout>
        <div className="p-6 text-center">Lesson not found</div>
      </AppLayout>
    );
  }

  const handleBack = () => {
    navigate('/read');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapters
            </Button>
            
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-institutional uppercase tracking-wide">
                  {lesson.title}
                </h1>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {lesson.estimated_time || 45} min
                  </Badge>
                  <Badge variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Lesson
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  {lesson.body_text ? (
                    <div dangerouslySetInnerHTML={{ __html: lesson.body_text }} />
                  ) : (
                    <p className="text-muted-foreground">No content available for this lesson.</p>
                  )}
                </div>

                {/* Progress Tracking */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Complete this lesson:</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Read Content</span>
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    
                    {lesson.assignment_text && (
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span>Complete Assignment</span>
                        <div className="text-sm text-muted-foreground">Coming Soon</div>
                      </div>
                    )}
                    
                    {lesson.ritual_text && (
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span>Complete Ritual</span>
                        <div className="text-sm text-muted-foreground">Coming Soon</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LessonView;