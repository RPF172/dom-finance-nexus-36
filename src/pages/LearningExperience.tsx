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

// Mock data for demonstration
const mockContent = {
  id: '1',
  title: 'Introduction to Advanced Learning',
  body_text: `Welcome to the enhanced learning experience. This is a comprehensive approach to knowledge acquisition that combines traditional reading with modern learning analytics and interactive assessments.

In this enhanced system, you'll experience:

1. **Unified Reading Experience**: A seamless reading interface that works for both chapters and lessons, with integrated progress tracking and focus management.

2. **Achievement System**: Earn achievements and badges as you progress through your learning journey. These milestones help maintain motivation and recognize your dedication.

3. **Study Session Management**: Smart session tracking with break suggestions, focus scoring, and productivity insights to optimize your learning efficiency.

4. **Learning Analytics**: Detailed insights into your study patterns, progress trends, and areas for improvement. Data-driven learning helps you understand your strengths and optimize your study approach.

5. **Enhanced Quiz System**: Interactive assessments with immediate feedback, detailed explanations, and performance analytics to reinforce learning and identify knowledge gaps.

This integrated approach ensures that your learning experience is not just educational, but also engaging, measurable, and continuously improving. The system adapts to your learning style and provides personalized recommendations to maximize your educational outcomes.

Take your time to explore each component. The reading progress is automatically tracked, and you'll see achievements unlock as you engage with the content. Your focus score and study analytics will help you understand your optimal learning patterns.

Remember: consistent, focused study sessions with appropriate breaks lead to better retention and understanding. The system will guide you through this optimal learning rhythm.`,
  type: 'lesson' as const,
  order_index: 0,
  module_id: 'demo'
};

const mockProgress = {
  content_read: false,
  quiz_completed: false,
  assignment_submitted: false,
  ritual_completed: false,
  reading_time: 0,
  achievements: [] as string[]
};

const mockQuestions = [
  {
    id: '1',
    question: 'What is the primary benefit of the unified reading experience?',
    options: [
      'It looks better than traditional readers',
      'It combines reading with progress tracking and focus management',
      'It loads faster than other systems',
      'It uses less memory'
    ],
    correct_answer: 'It combines reading with progress tracking and focus management',
    explanation: 'The unified reading experience integrates multiple learning tools into a seamless interface, helping learners track progress while maintaining focus.',
    difficulty: 'easy' as const,
    points: 10
  },
  {
    id: '2',
    question: 'Which component provides insights into study patterns and productivity?',
    options: [
      'Achievement System',
      'Quiz System',
      'Learning Analytics',
      'Study Session Manager'
    ],
    correct_answer: 'Learning Analytics',
    explanation: 'Learning Analytics provides detailed insights into study patterns, progress trends, and productivity metrics to help optimize learning strategies.',
    difficulty: 'medium' as const,
    points: 15
  },
  {
    id: '3',
    question: 'What is the recommended approach for optimal learning according to the enhanced system?',
    options: [
      'Study for as long as possible without breaks',
      'Only use quizzes for assessment',
      'Consistent, focused study sessions with appropriate breaks',
      'Avoid tracking progress to reduce pressure'
    ],
    correct_answer: 'Consistent, focused study sessions with appropriate breaks',
    explanation: 'Research shows that consistent study sessions with strategic breaks lead to better retention and understanding, which is why the system promotes this approach.',
    difficulty: 'hard' as const,
    points: 20
  }
];

const mockLearningStats = {
  totalStudyTime: 180, // 3 hours in minutes
  averageSessionLength: 25,
  streakDays: 7,
  completedContent: 12,
  averageFocusScore: 85,
  weeklyGoal: 600, // 10 hours in minutes
  achievements: ['content_master', 'focused_reader'],
  recentSessions: [
    {
      date: '2024-01-15',
      duration: 30,
      contentType: 'lesson' as const,
      completed: true,
      focusScore: 88
    },
    {
      date: '2024-01-14', 
      duration: 25,
      contentType: 'chapter' as const,
      completed: true,
      focusScore: 92
    },
    {
      date: '2024-01-13',
      duration: 20,
      contentType: 'lesson' as const,
      completed: false,
      focusScore: 75
    }
  ]
};

export const LearningExperience = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reader');
  const [progress, setProgress] = useState(mockProgress);
  const [learningStats, setLearningStats] = useState(mockLearningStats);

  const handleBack = () => {
    navigate('/learning-hub');
  };

  const handleProgressUpdate = (newProgress: Partial<typeof mockProgress>) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  const handleQuizComplete = (score: number, attempts: any[]) => {
    const newProgress = {
      ...progress,
      quiz_completed: true,
      achievements: [...progress.achievements, 'quiz_master']
    };
    setProgress(newProgress);
    setActiveTab('reader');
  };

  const handleSetWeeklyGoal = (minutes: number) => {
    setLearningStats(prev => ({ ...prev, weeklyGoal: minutes }));
  };

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
                content={mockContent}
                progress={progress}
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
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz">
              <EnhancedQuizSystem
                contentId={mockContent.id}
                questions={mockQuestions}
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