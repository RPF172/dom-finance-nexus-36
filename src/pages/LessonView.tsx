import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson, useQuizzes } from '@/hooks/useLessons';
import { useUserProgress, useUpdateProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';
import SlidingBottomNav from '@/components/SlidingBottomNav';

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: lesson, isLoading: lessonLoading } = useLesson(id!);
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes(id!);
  const { data: progress } = useUserProgress(id);
  const updateProgress = useUpdateProgress();

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
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <Flame className="h-8 w-8 text-accent animate-pulse mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Lesson not found</p>
          <Button onClick={() => navigate('/doctrine')} className="mt-4" variant="outline">
            Return to Doctrine
          </Button>
        </div>
      </div>
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
      title: "Scripture Completed",
      description: "Your indoctrination deepens. Return to the Doctrine to continue."
    });
    navigate('/doctrine');
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
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-muted p-4 z-10">
          <div className="flex items-center gap-3 mb-2">
            <button 
              className="p-1 hover:bg-muted/50 rounded"
              onClick={() => navigate('/doctrine')}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-lg leading-tight">
                {lesson.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                🔁 In Progress ({progressPercentage}%)
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Est: {lesson.estimated_time}min</span>
            </div>
          </div>
          
            <div className="mt-2">
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Doctrine Text */}
          <Card className="bg-card border-muted">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent" />
                <h2 className="font-bold text-sm">DOCTRINE TEXT</h2>
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
          <Card className={`bg-card border-muted transition-all duration-200 ${
            taskCompleted ? 'border-emerald-800 bg-emerald-950/30' : 'border-accent/50'
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

          {/* Quiz Section */}
          <Card className={`bg-card border-muted transition-all duration-200 ${
            quizAnswered ? 'border-emerald-800 bg-emerald-950/30' : 'border-muted'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span>🧠</span>
                <h3 className="font-bold text-sm">SCRIPTURE QUIZ</h3>
                {quizAnswered && <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuiz ? (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Question {currentQuizIndex + 1} of {totalQuizzes}</span>
                    <span>{completedQuizzes} answered</span>
                  </div>
                  
                  <p className="text-sm">{currentQuiz.question}</p>
                  
                  {currentQuiz.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {currentQuiz.options.map((option: string, index: number) => {
                        const isSelected = selectedAnswers.get(currentQuiz.id) === option;
                        const isCorrect = option === currentQuiz.answer;
                        const showResult = quizAnswered && selectedAnswers.has(currentQuiz.id);
                        
                        return (
                          <label 
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-all ${
                              isSelected 
                                ? showResult 
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                                    : 'border-red-500 bg-red-950/30 text-red-400'
                                  : 'border-accent bg-accent/10'
                                : 'border-muted hover:border-muted-foreground/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-${currentQuiz.id}`}
                              value={option}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(currentQuiz.id, option)}
                              disabled={quizAnswered}
                              className="hidden"
                            />
                            <div className={`w-3 h-3 rounded-full border-2 ${
                              isSelected 
                                ? showResult
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : 'border-red-500 bg-red-500'
                                  : 'border-accent bg-accent'
                                : 'border-muted-foreground/50'
                            }`} />
                            <span className="text-sm">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {currentQuiz.type === 'true_false' && (
                    <div className="space-y-2">
                      {['True', 'False'].map((option) => {
                        const isSelected = selectedAnswers.get(currentQuiz.id) === (option === 'True');
                        const isCorrect = (option === 'True') === currentQuiz.answer;
                        const showResult = quizAnswered && selectedAnswers.has(currentQuiz.id);
                        
                        return (
                          <label 
                            key={option}
                            className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-all ${
                              isSelected 
                                ? showResult 
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                                    : 'border-red-500 bg-red-950/30 text-red-400'
                                  : 'border-accent bg-accent/10'
                                : 'border-muted hover:border-muted-foreground/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-${currentQuiz.id}`}
                              value={option}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(currentQuiz.id, option === 'True')}
                              disabled={quizAnswered}
                              className="hidden"
                            />
                            <div className={`w-3 h-3 rounded-full border-2 ${
                              isSelected 
                                ? showResult
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-500'
                                    : 'border-red-500 bg-red-500'
                                  : 'border-accent bg-accent'
                                : 'border-muted-foreground/50'
                            }`} />
                            <span className="text-sm">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {currentQuiz.type === 'fill_in_the_blank' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={selectedAnswers.get(currentQuiz.id) || ''}
                        onChange={(e) => handleAnswerSelect(currentQuiz.id, e.target.value)}
                        disabled={quizAnswered}
                        className="w-full px-3 py-2 text-sm bg-background border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50"
                      />
                    </div>
                  )}
                  
                  {!quizAnswered && (
                    <Button 
                      size="sm" 
                      onClick={handleQuizSubmit}
                      disabled={!selectedAnswers.has(currentQuiz.id)}
                      className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                    >
                      {currentQuizIndex < totalQuizzes - 1 ? 'NEXT QUESTION' : 'COMPLETE QUIZ'}
                    </Button>
                  )}
                  
                  {quizAnswered && currentQuiz.explanation && (
                    <div className="text-xs p-2 rounded border border-muted bg-muted/30 text-muted-foreground">
                      {currentQuiz.explanation}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No quiz available for this lesson.</p>
              )}
            </CardContent>
          </Card>

          {/* Confession Box */}
          <Card className="bg-card border-muted">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span>💬</span>
                <h3 className="font-bold text-sm">CONFESSIONAL (Optional)</h3>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your thoughts, failings, regrets..."
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                className="min-h-20 text-sm border-muted bg-background/50 resize-none"
              />
            </CardContent>
          </Card>

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
                {canComplete ? 'COMPLETE SCRIPTURE' : 'COMPLETE TASK & QUIZ TO PROCEED'}
              </Button>
              
              {!canComplete && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Scripture completion requires both task submission and quiz completion
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <SlidingBottomNav />

        {/* Spacing for fixed footer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default LessonView;