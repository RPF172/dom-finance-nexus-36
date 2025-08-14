import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Timer, Zap, Target } from 'lucide-react';
import { useSessionTimer } from '@/hooks/useLearningAnalytics';
import { cn } from '@/lib/utils';

interface SessionTrackerProps {
  weekId?: string;
  onActivityComplete?: () => void;
  className?: string;
}

export const SessionTracker: React.FC<SessionTrackerProps> = ({
  weekId,
  onActivityComplete,
  className
}) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [focusScore, setFocusScore] = useState([75]);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const sessionRef = useRef<{ endSession: (score?: number) => void; incrementActivity: () => void } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { startSession, isTracking } = useSessionTimer();

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!sessionRef.current) {
      sessionRef.current = startSession(weekId);
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    if (sessionRef.current && time > 0) {
      const minutes = Math.round(time / 60);
      sessionRef.current.endSession(focusScore[0]);
      sessionRef.current = null;
    }
    setTime(0);
    setActivitiesCompleted(0);
  };

  const handleActivityComplete = () => {
    if (sessionRef.current) {
      sessionRef.current.incrementActivity();
    }
    setActivitiesCompleted(prev => prev + 1);
    onActivityComplete?.();
  };

  const getTimeColor = () => {
    if (time < 600) return 'text-muted-foreground'; // Less than 10 minutes
    if (time < 1800) return 'text-primary'; // Less than 30 minutes
    return 'text-success'; // 30+ minutes
  };

  const getFocusColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className={cn("border-2", isActive && "border-primary", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Timer Display */}
          <div className="text-center">
            <div className={cn("text-3xl font-mono font-bold", getTimeColor())}>
              {formatTime(time)}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              {isActive && (
                <Badge variant="default" className="animate-pulse">
                  <div className="h-2 w-2 bg-current rounded-full mr-1" />
                  Active
                </Badge>
              )}
              <Badge variant="outline">
                <Target className="h-3 w-3 mr-1" />
                {activitiesCompleted} completed
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            {!isActive ? (
              <Button 
                onClick={handleStart}
                disabled={isTracking}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            ) : (
              <Button 
                onClick={handlePause}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            
            {time > 0 && (
              <Button 
                onClick={handleStop}
                variant="outline"
                disabled={isTracking}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                End Session
              </Button>
            )}
          </div>

          {/* Activity Tracker */}
          {isActive && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleActivityComplete}
                variant="ghost" 
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Mark Activity Complete
              </Button>
            </div>
          )}

          {/* Focus Score */}
          {(isActive || time > 0) && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Focus Score</label>
                <span className={cn("font-bold", getFocusColor(focusScore[0]))}>
                  {focusScore[0]}%
                </span>
              </div>
              <Slider
                value={focusScore}
                onValueChange={setFocusScore}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Rate your focus level during this session
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};