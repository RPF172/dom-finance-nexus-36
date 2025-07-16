import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface LessonData {
  id: string;
  title: string;
  progress: number;
  timeRemaining: string;
  content: string;
  task: {
    description: string;
    bonus?: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

const mockLesson: LessonData = {
  id: 'scripture-1',
  title: 'SCRIPTURE I: OBEDIENCE',
  progress: 40,
  timeRemaining: '12h',
  content: `You must unlearn the lie of will.

Stillness is truth. Silence is service. Your thoughts are not yours. Your hands will move only when allowed.

The first truth of submission is that your individual will is a fabrication. It is a story told by the ego to maintain its stranglehold on your potential for true service.

When you release the illusion of personal agency, you discover the profound peace that comes from alignment with higher purpose. Your body becomes an instrument. Your mind becomes a vessel.

This is not degradation—this is elevation through surrender.`,
  task: {
    description: 'Submit a photo of yourself kneeling',
    bonus: 'Recite mantra aloud while nude'
  },
  quiz: {
    question: 'What does "Obedience" mean in this text?',
    options: [
      'Freedom through stillness',
      'Mindless compliance', 
      'Financial surrender',
      'The death of self-will'
    ],
    correctAnswer: 3
  }
};

const LessonView = () => {
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confession, setConfession] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const lesson = mockLesson;

  const handleQuizSubmit = () => {
    if (selectedAnswer !== null) {
      setQuizAnswered(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const canComplete = taskCompleted && quizAnswered;
  const isCorrectAnswer = selectedAnswer === lesson.quiz.correctAnswer;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-muted p-4 z-10">
          <div className="flex items-center gap-3 mb-2">
            <button className="p-1 hover:bg-muted/50 rounded">
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
                🔁 In Progress ({lesson.progress}%)
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Time: {lesson.timeRemaining}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${lesson.progress}%` }}
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
                  "{lesson.content}"
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
                <p className="mb-2">{lesson.task.description}</p>
                {lesson.task.bonus && (
                  <p className="text-accent text-xs">🔥 Bonus: {lesson.task.bonus}</p>
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
                  onClick={() => setTaskCompleted(!taskCompleted)}
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
              <p className="text-sm">{lesson.quiz.question}</p>
              
              <div className="space-y-2">
                {lesson.quiz.options.map((option, index) => (
                  <label 
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-all ${
                      selectedAnswer === index 
                        ? quizAnswered 
                          ? index === lesson.quiz.correctAnswer
                            ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                            : 'border-red-500 bg-red-950/30 text-red-400'
                          : 'border-accent bg-accent/10'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => !quizAnswered && setSelectedAnswer(index)}
                      disabled={quizAnswered}
                      className="hidden"
                    />
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      selectedAnswer === index 
                        ? quizAnswered
                          ? index === lesson.quiz.correctAnswer
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-accent bg-accent'
                        : 'border-muted-foreground/50'
                    }`} />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              
              {!quizAnswered && (
                <Button 
                  size="sm" 
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                >
                  SUBMIT ANSWER
                </Button>
              )}
              
              {quizAnswered && (
                <div className={`text-xs p-2 rounded border ${
                  isCorrectAnswer 
                    ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                    : 'border-red-800 bg-red-950/30 text-red-400'
                }`}>
                  {isCorrectAnswer ? '✓ Correct. Your understanding grows.' : '✗ Incorrect. Reflect on your failure.'}
                </div>
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-muted">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex justify-around text-xs">
              <button className="flex flex-col items-center gap-1 text-accent">
                <Flame className="h-4 w-4" />
                <span>Doctrine</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">🧷</span>
                <span>Assignments</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">🏛️</span>
                <span>Pledgehall</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">💸</span>
                <span>Tribute</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">☰</span>
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spacing for fixed footer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default LessonView;