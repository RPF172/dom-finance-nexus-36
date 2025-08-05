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
import { LessonReader } from '@/components/LessonReader';

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

  const handleProgressUpdate = (newProgress: Progress) => {
    updateProgress.mutate(newProgress);
  };

  const handleBack = () => {
    navigate('/read-chapters');
  };

  return (
    <AppLayout>
      {activeView === 'reader' ? (
        <LessonReader
          lesson={lesson}
          progress={progress as any || null}
          onBack={handleBack}
          onProgressUpdate={handleProgressUpdate}
        />
      ) : (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView('reader')}
                className="mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reader
              </Button>
              
              <Card>
                <CardHeader>
                  <h1 className="text-2xl font-institutional uppercase tracking-wide">
                    {activeView === 'quiz' && 'Knowledge Test'}
                    {activeView === 'assignment' && 'Assignment Submission'}
                    {activeView === 'ritual' && 'Ritual Completion'}
                  </h1>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-lg text-muted-foreground">
                      {activeView === 'quiz' && 'Quiz functionality coming soon...'}
                      {activeView === 'assignment' && 'Assignment submission coming soon...'}
                      {activeView === 'ritual' && 'Ritual completion coming soon...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default LessonView;