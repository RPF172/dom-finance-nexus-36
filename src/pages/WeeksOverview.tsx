import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { EnhancedWeekCard } from '@/components/EnhancedWeekCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWeeks } from '@/hooks/useWeeks';
import { useAllWeekProgress, useWeekPrerequisites, useWeekProgressStats } from '@/hooks/useWeekProgress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Clock, Trophy, BookOpen, Target, BarChart3 } from 'lucide-react';

export default function WeeksOverview() {
  const navigate = useNavigate();
  const { data: weeks, isLoading: weeksLoading, error: weeksError } = useWeeks();
  const { data: allProgress } = useAllWeekProgress();
  const { data: stats } = useWeekProgressStats();

  if (weeksLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (weeksError) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load weeks. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  const getWeekProgress = (weekId: string) => {
    return allProgress?.find(p => p.week_id === weekId) || null;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground">
                Your Learning Journey
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track your progress through structured weekly content designed to advance your skills and knowledge.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                <div className="space-y-2 mt-2">
                  <Progress value={stats.averageProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {stats.completedWeeks} of {stats.totalWeeks} weeks completed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalModulesCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  Reading materials finished
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTasksCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  Practical exercises done
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments Done</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssignmentsCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  Major projects submitted
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Weeks Section */}
        {stats && stats.inProgressWeeks > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Continue Learning</h2>
              <Badge variant="secondary">
                {stats.inProgressWeeks} in progress
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeks
                ?.filter(week => {
                  const progress = getWeekProgress(week.id);
                  return progress && progress.progress_percentage > 0 && progress.progress_percentage < 100;
                })
                .map(week => (
                  <WeekCardWithPrerequisites
                    key={week.id}
                    week={week}
                    progress={getWeekProgress(week.id)}
                    onClick={() => navigate(`/learn/${week.id}`)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* All Weeks Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">All Weeks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeks?.map(week => (
              <WeekCardWithPrerequisites
                key={week.id}
                week={week}
                progress={getWeekProgress(week.id)}
                onClick={() => navigate(`/learn/${week.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper component to handle prerequisites check
const WeekCardWithPrerequisites: React.FC<{
  week: any;
  progress: any;
  onClick: () => void;
}> = ({ week, progress, onClick }) => {
  const { data: isUnlocked = true } = useWeekPrerequisites(week.id);

  return (
    <EnhancedWeekCard
      week={week}
      progress={progress}
      isUnlocked={isUnlocked}
      onClick={onClick}
    />
  );
};