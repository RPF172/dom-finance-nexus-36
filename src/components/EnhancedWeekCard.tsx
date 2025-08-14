import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, Lock, CheckCircle, PlayCircle, BookOpen, FileText, ClipboardList } from 'lucide-react';
import { Week } from '@/hooks/useWeeks';
import { WeekProgress } from '@/hooks/useWeekProgress';
import { cn } from '@/lib/utils';

interface EnhancedWeekCardProps {
  week: Week;
  progress?: WeekProgress | null;
  isUnlocked: boolean;
  onClick?: () => void;
  className?: string;
}

const difficultyColors = {
  beginner: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  intermediate: 'bg-amber-500/10 text-amber-600 border-amber-200',
  advanced: 'bg-orange-500/10 text-orange-600 border-orange-200',
  expert: 'bg-red-500/10 text-red-600 border-red-200'
};

const getDifficultyIcon = (level: string) => {
  switch (level) {
    case 'beginner': return '⭐';
    case 'intermediate': return '⭐⭐';
    case 'advanced': return '⭐⭐⭐';
    case 'expert': return '⭐⭐⭐⭐';
    default: return '⭐';
  }
};

export const EnhancedWeekCard: React.FC<EnhancedWeekCardProps> = ({
  week,
  progress,
  isUnlocked,
  onClick,
  className
}) => {
  const progressPercentage = progress?.progress_percentage || 0;
  const isCompleted = progressPercentage === 100;
  const isInProgress = progressPercentage > 0 && progressPercentage < 100;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg group",
        !isUnlocked && "opacity-60 cursor-not-allowed",
        isCompleted && "border-emerald-200 bg-emerald-50/50",
        isInProgress && "border-primary/30 bg-primary/5",
        className
      )}
      onClick={isUnlocked ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Week {week.week_number}
              {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              {isCompleted && <CheckCircle className="h-4 w-4 text-emerald-600" />}
              {isInProgress && <PlayCircle className="h-4 w-4 text-primary" />}
            </CardTitle>
            <h3 className="font-medium text-foreground/90 mt-1 line-clamp-1">
              {week.title}
            </h3>
          </div>
          <Badge variant="outline" className={cn("text-xs font-medium", difficultyColors[week.difficulty_level])}>
            {getDifficultyIcon(week.difficulty_level)} {week.difficulty_level}
          </Badge>
        </div>

        {week.objective && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {week.objective}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className={cn(
                "font-medium",
                isCompleted && "text-emerald-600",
                isInProgress && "text-primary"
              )}>
                {progressPercentage}%
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </div>
        )}

        {/* Content Overview */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{week.total_modules} modules</span>
            {progress && progress.modules_completed > 0 && (
              <span className="text-emerald-600 text-xs">
                ({progress.modules_completed}/{week.total_modules})
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
            <span>{week.total_tasks} tasks</span>
            {progress && progress.tasks_completed > 0 && (
              <span className="text-emerald-600 text-xs">
                ({progress.tasks_completed}/{week.total_tasks})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{week.total_assignments} assignments</span>
            {progress && progress.assignments_completed > 0 && (
              <span className="text-emerald-600 text-xs">
                ({progress.assignments_completed}/{week.total_assignments})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(week.estimated_duration)}</span>
          </div>
        </div>

        {/* Footer with points and status */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{week.points_reward} points</span>
          </div>
          
          {progress?.completed_at && (
            <span className="text-xs text-emerald-600 font-medium">
              Completed {new Date(progress.completed_at).toLocaleDateString()}
            </span>
          )}
          
          {progress?.last_activity_at && !isCompleted && (
            <span className="text-xs text-muted-foreground">
              Last active {new Date(progress.last_activity_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Locked overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center space-y-2">
              <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground font-medium">
                Complete prerequisites to unlock
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};