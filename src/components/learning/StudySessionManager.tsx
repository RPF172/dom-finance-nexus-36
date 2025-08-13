import React, { useEffect, useState } from 'react';
import { Clock, Coffee, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StudySessionManagerProps {
  isActive: boolean;
  startTime: Date | null;
  onBreakSuggestion: () => void;
}

interface StudySession {
  startTime: Date;
  totalTime: number; // in minutes
  focusScore: number; // 0-100
  breaks: number;
}

const POMODORO_TIME = 25; // minutes
const BREAK_TIME = 5; // minutes
const LONG_BREAK_TIME = 15; // minutes

export const StudySessionManager: React.FC<StudySessionManagerProps> = ({
  isActive,
  startTime,
  onBreakSuggestion
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [focusScore, setFocusScore] = useState(100);
  const [lastBreakSuggestion, setLastBreakSuggestion] = useState(0);

  // Update session time
  useEffect(() => {
    if (!isActive || !startTime) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const minutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);
      setSessionTime(minutes);
      setTotalStudyTime(prev => prev + 1/60); // Add 1 second converted to minutes

      // Check for break suggestions
      if (minutes > 0 && minutes % POMODORO_TIME === 0 && minutes !== lastBreakSuggestion) {
        setLastBreakSuggestion(minutes);
        onBreakSuggestion();
        
        // Update focus score based on session length
        if (minutes <= POMODORO_TIME) {
          setFocusScore(prev => Math.min(100, prev + 5));
        } else if (minutes > POMODORO_TIME * 2) {
          setFocusScore(prev => Math.max(0, prev - 10));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime, onBreakSuggestion, lastBreakSuggestion]);

  // Reset when session ends
  useEffect(() => {
    if (!isActive) {
      if (sessionTime >= POMODORO_TIME) {
        setPomodoroCount(prev => prev + 1);
      }
      setSessionTime(0);
      setLastBreakSuggestion(0);
    }
  }, [isActive, sessionTime]);

  const getSessionPhase = () => {
    if (sessionTime < POMODORO_TIME) return 'focus';
    if (sessionTime < POMODORO_TIME + BREAK_TIME) return 'break';
    return 'extended';
  };

  const getProgressValue = () => {
    const phase = getSessionPhase();
    if (phase === 'focus') {
      return (sessionTime / POMODORO_TIME) * 100;
    }
    return 100;
  };

  const getPhaseColor = () => {
    const phase = getSessionPhase();
    switch (phase) {
      case 'focus': return 'text-green-400';
      case 'break': return 'text-blue-400';
      case 'extended': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRecommendation = () => {
    const phase = getSessionPhase();
    switch (phase) {
      case 'focus':
        return 'Stay focused! You\'re in the zone.';
      case 'break':
        return 'Time for a short break. Rest your mind.';
      case 'extended':
        return 'Consider taking a longer break to maintain quality.';
      default:
        return 'Ready to start your study session?';
    }
  };

  if (!isActive && sessionTime === 0) {
    return null; // Don't show when not studying
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <Card className="border-accent/30 bg-background/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="font-medium text-sm">Study Session</span>
            </div>
            <Badge variant="outline" className={getPhaseColor()}>
              {getSessionPhase()}
            </Badge>
          </div>

          {/* Session Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Session Progress</span>
              <span>{sessionTime} min</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-sm font-mono font-bold">{sessionTime}</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-mono font-bold">{Math.floor(totalStudyTime)}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-mono font-bold">{pomodoroCount}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </div>

          {/* Focus Score */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-accent" />
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span>Focus Score</span>
                <span className={focusScore >= 80 ? 'text-green-400' : focusScore >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                  {focusScore}%
                </span>
              </div>
              <Progress value={focusScore} className="h-1 mt-1" />
            </div>
          </div>

          {/* Recommendation */}
          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
            <Target className="h-3 w-3 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {getRecommendation()}
            </p>
          </div>

          {/* Break Suggestion */}
          {sessionTime >= POMODORO_TIME && isActive && (
            <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Coffee className="h-3 w-3 text-blue-400" />
              <p className="text-xs text-blue-400 flex-1">
                Time for a break! Your brain needs rest.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};