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

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: lesson, isLoading: lessonLoading } = useLesson(id!);
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes(id!);
  const { data: progress } = useUserProgress(id);
  const updateProgress = useUpdateProgress();

  const [viewMode, setViewMode] = useState<'reader' | 'exercises'>('reader');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, any>>(new Map());
  const [confession, setConfession] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  useEffect(() => {
    if (progress && !Array.isArray(progress)) {
      setTaskCompleted(progress.assignment_submitted);
      setQuizAnswered(progress.quiz_completed);
    }
  }, [progress]);

  if (lessonLoading || quizzesLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <Flame className="h-8 w-8 text-accent animate-pulse mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading lesson...</p>
            <div className="w-32 bg-muted h-1 rounded-full mt-4 mx-auto overflow-hidden">
              <div className="bg-accent h-1 rounded-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Lesson not found</p>
          <Button onClick={() => navigate('/book')} className="mt-4" variant="outline">
            Return to Book
          </Button>
        </div>
      </div>
    );
  }

  // Show reader view by default or when explicitly selected
  if (viewMode === 'reader') {
    return (
      <LessonReader
        lesson={lesson}
        progress={progress}
        onBack={() => navigate('/book')}
        onProgressUpdate={(progressData) => {
          updateProgress.mutate(progressData);
          // Switch to exercises after reading is complete
          if (progressData.content_read) {
            setViewMode('exercises');
          }
        }}
      />
    );
  }

  const currentQuiz = quizzes?.[currentQuizIndex];
  const totalQuizzes = quizzes?.length || 0;
  const completedQuizzes = selectedAnswers.size;

  const calculateProgress = () => {
    let completed = 0;
    let total = 3; // content_read, quiz_completed, assignment_submitted
    
    // Always count content as read when viewing
    completed += 1;
    
    if (quizAnswered) completed++;
    if (taskCompleted) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const handleQuizSubmit = () => {
    if (currentQuiz && selectedAnswers.has(currentQuiz.id)) {
      if (currentQuizIndex < totalQuizzes - 1) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        setQuizAnswered(true);
        // Update progress
        updateProgress.mutate({
          lesson_id: lesson.id,
          content_read: true,
          quiz_completed: true,
          quiz_score: Math.round((completedQuizzes / totalQuizzes) * 100),
          assignment_submitted: taskCompleted,
          ritual_completed: false
        });
        toast({
          title: "Quiz Completed",
          description: "Your understanding has been recorded."
        });
      }
    }
  };

  const handleTaskToggle = () => {
    const newTaskCompleted = !taskCompleted;
    setTaskCompleted(newTaskCompleted);
    
    // Update progress
    updateProgress.mutate({
      lesson_id: lesson.id,
      content_read: true,
      quiz_completed: quizAnswered,
      assignment_submitted: newTaskCompleted,
      ritual_completed: false
    });
    
    toast({
      title: newTaskCompleted ? "Task Completed" : "Task Marked Incomplete",
      description: newTaskCompleted ? "Your submission has been recorded." : "Task status updated."
    });
  };

  const handleAnswerSelect = (quizId: string, answer: any) => {
    if (!quizAnswered) {
      const newAnswers = new Map(selectedAnswers);
      newAnswers.set(quizId, answer);
      setSelectedAnswers(newAnswers);
    }
  };

  const handleCompleteLesson = () => {
    updateProgress.mutate({
      lesson_id: lesson.id,
      content_read: true,
      quiz_completed: true,
      assignment_submitted: true,
      ritual_completed: true
    });
        toast({
          title: "Chapter Completed",
          description: "Your indoctrination deepens. Return to the Book to continue."
        });
        navigate('/book');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const canComplete = taskCompleted && quizAnswered;
  const progressPercentage = calculateProgress();

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-muted p-4 z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <button 
              className="p-1 hover:bg-muted/50 rounded transition-all duration-200 hover:scale-110"
              onClick={() => navigate('/book')}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('reader')}
                className="text-accent hover:bg-accent/10"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Reader
              </Button>
              <div className="flex-1">
                <h1 className="font-bold text-lg leading-tight animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
                  {lesson.title}
                </h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-accent/50 text-accent animate-pulse">
                🔁 In Progress ({progressPercentage}%)
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3 animate-pulse" />
              <span>Est: {lesson.estimated_time}min</span>
            </div>
          </div>
          
          <div className="mt-2 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500 animate-pulse"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
          {/* Chapter Text */}
          <Card className="bg-card border-muted hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent animate-pulse" />
                <h2 className="font-bold text-sm">CHAPTER TEXT</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed italic text-foreground/90">
                  {lesson.body_text}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Block */}
          <Card className={`bg-card border-muted transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            taskCompleted ? 'border-emerald-800 bg-emerald-950/30 border-l-4 border-l-emerald-500' : 'border-accent/50 border-l-4 border-l-accent'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-accent">📸</span>
                <h3 className="font-bold text-sm">ASSIGNED TASK</h3>
                {taskCompleted && <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="mb-2">{lesson.assignment_text}</p>
                {lesson.ritual_text && (
                  <p className="text-accent text-xs">🔥 Ritual: {lesson.ritual_text}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={taskCompleted}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-muted-foreground/30 text-muted-foreground hover:bg-muted/20"
                    disabled={taskCompleted}
                    asChild
                  >
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Upload className="h-3 w-3" />
                      {uploadedFile ? uploadedFile.name : 'UPLOAD FILE'}
                    </div>
                  </Button>
                </label>
                
                <Button 
                  size="sm" 
                  variant={taskCompleted ? "outline" : "default"}
                  className={taskCompleted ? 
                    "bg-emerald-950/30 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50" :
                    "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                  }
                  onClick={handleTaskToggle}
                >
                  {taskCompleted ? '✓ COMPLETE' : 'MARK COMPLETE'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ... keep existing code (quiz section and remaining content) */}
          
          {/* Actions */}
          <Card className="bg-card border-muted">
            <CardContent className="pt-6">
              <Button 
                size="lg"
                disabled={!canComplete}
                onClick={handleCompleteLesson}
                className={`w-full font-mono ${
                  canComplete 
                    ? 'bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {canComplete ? 'COMPLETE CHAPTER' : 'COMPLETE TASK & QUIZ TO PROCEED'}
              </Button>
              
              {!canComplete && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Chapter completion requires both task submission and quiz completion
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default LessonView;