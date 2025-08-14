import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, Clock, Trophy, Target, Brain, Calendar, 
  BarChart3, Activity, Zap, CheckCircle 
} from 'lucide-react';
import { useLearningInsights, useLearningSession } from '@/hooks/useLearningAnalytics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface LearningAnalyticsDashboardProps {
  className?: string;
}

export const LearningAnalyticsDashboard: React.FC<LearningAnalyticsDashboardProps> = ({ 
  className 
}) => {
  const [timeRange, setTimeRange] = useState('30');
  const { data: insights, isLoading: insightsLoading } = useLearningInsights(parseInt(timeRange));
  const { data: sessions, isLoading: sessionsLoading } = useLearningSession(5);

  if (insightsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Analytics</h2>
          <p className="text-muted-foreground">Track your learning progress and patterns</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.total_sessions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Learning sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(insights?.total_minutes || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total time invested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(insights?.avg_session_duration || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average session length
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getScoreColor(insights?.avg_focus_score || 0))}>
              {Math.round(insights?.avg_focus_score || 0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average focus rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{insights?.completion_rate || 0}%</span>
              </div>
              <Progress value={insights?.completion_rate || 0} className="h-3" />
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most Active Day</span>
                <Badge variant="outline">
                  {insights?.most_active_day || 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session, index) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <div>
                        <p className="text-sm font-medium">
                          {formatDuration(session.duration_minutes || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.session_start).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.focus_score && (
                        <Badge 
                          variant={getScoreBadgeVariant(session.focus_score)}
                          className="text-xs"
                        >
                          {session.focus_score}%
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {session.activities_completed} activities
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No recent sessions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      {insights?.weekly_progress && insights.weekly_progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.weekly_progress.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Week of {new Date(week.week).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground">
                      {week.sessions} sessions • {formatDuration(week.minutes)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((week.sessions / 5) * 100, 100)} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};