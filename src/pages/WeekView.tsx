import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeekData } from '@/hooks/useWeeks';
import { useWeekProgress, useWeekPrerequisites, useUpdateWeekProgress } from '@/hooks/useWeekProgress';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Flame, ArrowLeft, ArrowRight, Lock, Trophy, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WeekContentEditor from '@/components/admin/WeekContentEditor';
import { WeekContentTabs } from '@/components/WeekContentTabs';
import { cn } from '@/lib/utils';

const WeekView: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  
  const { data: week, isLoading } = useWeekData(weekId!);
  const { data: progress } = useWeekProgress(weekId!);
  const { data: isUnlocked = true } = useWeekPrerequisites(weekId!);
  const updateProgress = useUpdateWeekProgress();
  
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        setIsAdmin(!!userRole);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground mt-4">Loading week...</p>
        </div>
      </AppLayout>
    );
  }

  if (!week) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Week not found.</p>
        </div>
      </AppLayout>
    );
  }

  if (!isUnlocked) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-semibold">Week Locked</h2>
                <p className="text-muted-foreground">
                  Complete previous weeks to unlock Week {week.week_number}
                </p>
                <Button onClick={() => navigate('/learn')} variant="outline">
                  Back to Overview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const progressPercentage = progress?.progress_percentage || 0;
  const isCompleted = progressPercentage === 100;
  const isInProgress = progressPercentage > 0 && progressPercentage < 100;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleStartWeek = () => {
    updateProgress.mutate({ weekId: week.id });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant={isCompleted ? "default" : isInProgress ? "secondary" : "outline"}>
              Week {week.week_number}
            </Badge>
            {isCompleted && <CheckCircle className="h-4 w-4 text-success" />}
          </div>
        </div>

        {/* Week Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{week.title}</CardTitle>
                {week.objective && (
                  <p className="text-muted-foreground mb-4">{week.objective}</p>
                )}
                
                {/* Week Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(week.estimated_duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{week.points_reward} points</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {week.difficulty_level}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          {/* Progress Section */}
          <CardContent>
            {progress ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className={cn(
                    "font-medium",
                    isCompleted && "text-success",
                    isInProgress && "text-primary"
                  )}>
                    {progressPercentage}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Modules: </span>
                    <span className="font-medium">
                      {progress.modules_completed}/{week.total_modules}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tasks: </span>
                    <span className="font-medium">
                      {progress.tasks_completed}/{week.total_tasks}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assignments: </span>
                    <span className="font-medium">
                      {progress.assignments_completed}/{week.total_assignments}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reviews: </span>
                    <span className="font-medium">
                      {progress.review_steps_completed}/{week.review_steps?.length || 0}
                    </span>
                  </div>
                </div>
                
                {progress.completed_at && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Completed on {new Date(progress.completed_at).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Button onClick={handleStartWeek} disabled={updateProgress.isPending}>
                  {updateProgress.isPending ? 'Starting...' : 'Start Week'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Content Editor */}
        {isAdmin && (
          <div className="mb-8">
            <WeekContentEditor weekId={week.id} onSaved={() => window.location.reload()} />
          </div>
        )}

        {/* Week Content */}
        <Card>
          <CardContent className="p-6">
            <WeekContentTabs weekData={week} weekProgress={progress} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default WeekView;
