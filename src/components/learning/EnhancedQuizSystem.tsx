import React, { useState, useEffect } from 'react';
import { Brain, Check, X, Clock, Award, RotateCcw, ArrowRight, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface QuizAttempt {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

interface QuizSession {
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  startTime: Date;
  currentQuestionIndex: number;
  isCompleted: boolean;
  score: number;
  maxScore: number;
}

interface EnhancedQuizSystemProps {
  contentId: string;
  questions: QuizQuestion[];
  onComplete: (score: number, attempts: QuizAttempt[]) => void;
  onBack: () => void;
}

export const EnhancedQuizSystem: React.FC<EnhancedQuizSystemProps> = ({
  contentId,
  questions,
  onComplete,
  onBack
}) => {
  const [session, setSession] = useState<QuizSession>({
    questions,
    attempts: [],
    startTime: new Date(),
    currentQuestionIndex: 0,
    isCompleted: false,
    score: 0,
    maxScore: questions.reduce((sum, q) => sum + q.points, 0)
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  // Timer for current question
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - questionStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime]);

  // Reset timer when question changes
  useEffect(() => {
    setQuestionStartTime(new Date());
    setTimeElapsed(0);
    setSelectedAnswer('');
    setShowExplanation(false);
  }, [session.currentQuestionIndex]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const timeSpent = Math.floor((Date.now() - questionStartTime.getTime()) / 1000);

    const attempt: QuizAttempt = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setSession(prev => ({
      ...prev,
      attempts: [...prev.attempts, attempt],
      score: prev.score + (isCorrect ? currentQuestion.points : 0)
    }));

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextIndex = session.currentQuestionIndex + 1;
    
    if (nextIndex >= session.questions.length) {
      // Quiz completed
      const finalSession = {
        ...session,
        currentQuestionIndex: nextIndex,
        isCompleted: true
      };
      setSession(finalSession);
      onComplete(finalSession.score, finalSession.attempts);
    } else {
      // Move to next question
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex
      }));
    }
  };

  const handleRetakeQuiz = () => {
    setSession({
      questions,
      attempts: [],
      startTime: new Date(),
      currentQuestionIndex: 0,
      isCompleted: false,
      score: 0,
      maxScore: questions.reduce((sum, q) => sum + q.points, 0)
    });
  };

  const getScorePercentage = () => {
    return Math.round((session.score / session.maxScore) * 100);
  };

  const getPerformanceLevel = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-400', badge: 'default' };
    if (percentage >= 80) return { level: 'Great', color: 'text-blue-400', badge: 'default' };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-400', badge: 'secondary' };
    return { level: 'Needs Improvement', color: 'text-red-400', badge: 'destructive' };
  };

  const getCurrentAttempt = () => {
    return session.attempts.find(a => a.questionId === currentQuestion?.id);
  };

  const currentAttempt = getCurrentAttempt();
  const performance = getPerformanceLevel();

  // Quiz completion screen
  if (session.isCompleted) {
    const totalTime = Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60);
    const averageTimePerQuestion = Math.round(session.attempts.reduce((sum, a) => sum + a.timeSpent, 0) / session.attempts.length);
    const correctAnswers = session.attempts.filter(a => a.isCorrect).length;

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-accent/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-12 w-12 text-accent-foreground" />
                  </div>
                  {getScorePercentage() >= 90 && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-20 blur animate-pulse" />
                  )}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-institutional uppercase tracking-wide">
                Quiz Completed!
              </CardTitle>
              
              <div className="mt-4">
                <div className="text-4xl font-bold mb-2">
                  {session.score}/{session.maxScore}
                </div>
                <Badge variant={performance.badge as any} className="text-lg px-4 py-1">
                  {getScorePercentage()}% - {performance.level}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{session.questions.length - correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{totalTime}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{averageTimePerQuestion}</div>
                  <div className="text-xs text-muted-foreground">Avg/Question</div>
                </div>
              </div>

              {/* Question Review */}
              <div className="space-y-3">
                <h3 className="font-medium">Question Review</h3>
                {session.attempts.map((attempt, index) => {
                  const question = session.questions.find(q => q.id === attempt.questionId);
                  return (
                    <div 
                      key={attempt.questionId}
                      className={cn(
                        "p-3 rounded-lg border",
                        attempt.isCorrect ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {attempt.isCorrect ? 
                          <Check className="h-4 w-4 text-green-400" /> : 
                          <X className="h-4 w-4 text-red-400" />
                        }
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        <Badge variant="outline" className="ml-auto">
                          {attempt.timeSpent}s
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{question?.question}</p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleRetakeQuiz}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button 
                  onClick={onBack}
                  className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Content
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                <span>Quiz</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timeElapsed}s</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {session.currentQuestionIndex + 1} of {session.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={cn(
                  "capitalize",
                  currentQuestion.difficulty === 'easy' && "text-green-400 border-green-400/30",
                  currentQuestion.difficulty === 'medium' && "text-yellow-400 border-yellow-400/30", 
                  currentQuestion.difficulty === 'hard' && "text-red-400 border-red-400/30"
                )}
              >
                {currentQuestion.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>{currentQuestion.points} pts</span>
              </div>
            </div>
            
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Answer Options */}
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={showExplanation}
            >
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correct_answer;
                const showCorrect = showExplanation && isCorrect;
                const showIncorrect = showExplanation && isSelected && !isCorrect;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                      !showExplanation && "hover:bg-muted/50",
                      showCorrect && "bg-green-500/10 border-green-500/30",
                      showIncorrect && "bg-red-500/10 border-red-500/30",
                      isSelected && !showExplanation && "border-accent/50 bg-accent/5"
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer leading-relaxed"
                    >
                      {option}
                    </Label>
                    {showCorrect && <Check className="h-4 w-4 text-green-400" />}
                    {showIncorrect && <X className="h-4 w-4 text-red-400" />}
                  </div>
                );
              })}
            </RadioGroup>

            {/* Explanation */}
            {showExplanation && currentQuestion.explanation && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">Explanation</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              {!showExplanation ? (
                <Button 
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                >
                  {session.currentQuestionIndex + 1 < session.questions.length ? 'Next Question' : 'Complete Quiz'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};