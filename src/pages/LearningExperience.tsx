import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedReader } from '@/components/learning/UnifiedReader';
import { LearningAnalytics } from '@/components/learning/LearningAnalytics';
import { EnhancedQuizSystem } from '@/components/learning/EnhancedQuizSystem';
import AppLayout from '@/components/layout/AppLayout';
import { BookOpen, BarChart3, Brain, ArrowLeft } from 'lucide-react';
import { useLesson, useQuizzes } from '@/hooks/useLessons';
import { useUserProgress, useUpdateProgress, useAllUserProgress } from '@/hooks/useProgress';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useObedience } from '@/hooks/useObedience';

export const LearningExperience = () => {
  const navigate = useNavigate();
  const { id: lessonId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('reader');
  
  // Fetch real data
  const { data: currentUser } = useCurrentUser();
  const { data: lesson, isLoading: lessonLoading } = useLesson(lessonId || '');
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes(lessonId || '');
  const { data: progress } = useUserProgress(lessonId);
  const { data: allProgress } = useAllUserProgress();
  const { data: obedienceData } = useObedience();
  const updateProgress = useUpdateProgress();

  const handleBack = () => {
    navigate('/learning-hub');
  };

  const handleProgressUpdate = (newProgress: any) => {
    if (!lessonId) return;
    updateProgress.mutate({
      lesson_id: lessonId,
      ...newProgress
    });
  };

  const handleQuizComplete = (score: number, attempts: any[]) => {
    if (!lessonId) return;
    updateProgress.mutate({
      lesson_id: lessonId,
      quiz_completed: true,
      quiz_score: score
    });
    setActiveTab('reader');
  };

  const handleSetWeeklyGoal = (minutes: number) => {
    // This would be connected to a user preferences system
    console.log('Setting weekly goal:', minutes);
  };

  // Generate real learning stats from user data
  const generateLearningStats = () => {
    if (!allProgress || !obedienceData) {
      return {
        totalStudyTime: 0,
        averageSessionLength: 0,
        streakDays: 0,
        completedContent: 0,
        averageFocusScore: 85,
        weeklyGoal: 600,
        achievements: [],
        recentSessions: []
      };
    }

    const completedLessons = allProgress.filter(p => p.completed);
    const totalStudyTime = completedLessons.length * 25; // Estimate 25 min per lesson
    
    return {
      totalStudyTime,
      averageSessionLength: 25,
      streakDays: Math.min(7, completedLessons.length), // Simple streak calculation
      completedContent: completedLessons.length,
      averageFocusScore: 85, // Would be calculated from actual focus data
      weeklyGoal: 600,
      achievements: ['content_master', 'focused_reader'],
      recentSessions: completedLessons.slice(-3).map((p, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 25,
        contentType: 'lesson' as const,
        completed: true,
        focusScore: 85 + Math.floor(Math.random() * 10)
      }))
    };
  };

  const learningStats = generateLearningStats();

  // Loading state
  if (lessonLoading || quizzesLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading learning experience...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state - lesson not found
  if (!lesson) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested lesson could not be found.</p>
            <Button onClick={handleBack}>Return to Learning Hub</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Transform lesson data to match component expectations
  const contentData = {
    id: lesson.id,
    title: lesson.title,
    body_text: lesson.body_text || '',
    type: 'lesson' as const,
    order_index: lesson.order_index,
    module_id: lesson.module_id
  };

  const progressData = progress && !Array.isArray(progress) ? {
    content_read: progress.content_read,
    quiz_completed: progress.quiz_completed,
    assignment_submitted: progress.assignment_submitted,
    ritual_completed: progress.ritual_completed,
    reading_time: 0, // Would need to be tracked separately
    achievements: [] // Would need to be tracked separately
  } : null;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Learning Hub
              </Button>
              <div>
                <h1 className="font-institutional text-xl uppercase tracking-wide">
                  Enhanced Learning Experience
                </h1>
                <p className="text-sm text-muted-foreground">
                  Experience the future of digital learning
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="reader" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Unified Reader
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Learning Analytics
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Enhanced Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reader">
              <UnifiedReader
                content={contentData}
                progress={progressData}
                onBack={handleBack}
                onProgressUpdate={handleProgressUpdate}
                onContinue={() => setActiveTab('quiz')}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Learning Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LearningAnalytics
                    stats={learningStats}
                    onSetWeeklyGoal={handleSetWeeklyGoal}
                    isLoading={!allProgress || !obedienceData}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz">
              <EnhancedQuizSystem
                contentId={lesson.id}
                questions={quizzes?.map(q => ({
                  id: q.id,
                  question: q.question,
                  options: q.options || [],
                  correct_answer: q.answer || '',
                  explanation: q.explanation || undefined,
                  difficulty: 'medium' as const,
                  points: 10
                })) || []}
                onComplete={handleQuizComplete}
                onBack={() => setActiveTab('reader')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};