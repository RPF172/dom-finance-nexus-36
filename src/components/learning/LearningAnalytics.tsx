import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Target, Award, Calendar, BarChart3, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface StudySession {
  date: string;
  duration: number; // minutes
  contentType: 'chapter' | 'lesson';
  completed: boolean;
  focusScore: number;
}

interface LearningStats {
  totalStudyTime: number; // minutes
  averageSessionLength: number; // minutes
  streakDays: number;
  completedContent: number;
  averageFocusScore: number;
  weeklyGoal: number; // minutes
  achievements: string[];
  recentSessions: StudySession[];
}

interface LearningAnalyticsProps {
  stats: LearningStats;
  onSetWeeklyGoal: (minutes: number) => void;
}

export const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({
  stats,
  onSetWeeklyGoal
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');
  
  const weekProgress = (stats.totalStudyTime / stats.weeklyGoal) * 100;
  const avgSessionQuality = stats.averageFocusScore;
  
  // Calculate weekly study distribution
  const getWeeklyDistribution = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const distribution = days.map(day => ({
      day,
      minutes: Math.floor(Math.random() * 60) + 10 // Mock data
    }));
    return distribution;
  };

  const getProductivityInsights = () => {
    const insights = [];
    
    if (stats.averageFocusScore >= 85) {
      insights.push({
        type: 'positive',
        title: 'Excellent Focus',
        description: 'Your focus score is exceptional! Keep up the great work.'
      });
    } else if (stats.averageFocusScore < 70) {
      insights.push({
        type: 'improvement',
        title: 'Focus Opportunity',
        description: 'Try breaking study sessions into smaller chunks for better focus.'
      });
    }

    if (stats.streakDays >= 7) {
      insights.push({
        type: 'positive',
        title: 'Consistency Master',
        description: `${stats.streakDays} days streak! Consistency is key to mastery.`
      });
    }

    if (stats.averageSessionLength > 45) {
      insights.push({
        type: 'suggestion',
        title: 'Session Length',
        description: 'Consider shorter sessions with breaks for optimal retention.'
      });
    }

    return insights;
  };

  const weeklyDistribution = getWeeklyDistribution();
  const insights = getProductivityInsights();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Total Study Time</span>
            </div>
            <div className="text-2xl font-bold">{Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Weekly Goal</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(weekProgress)}%</div>
            <Progress value={weekProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Focus Score</span>
            </div>
            <div className="text-2xl font-bold">{avgSessionQuality}%</div>
            <Badge 
              variant={avgSessionQuality >= 85 ? "default" : avgSessionQuality >= 70 ? "secondary" : "destructive"}
              className="mt-1"
            >
              {avgSessionQuality >= 85 ? 'Excellent' : avgSessionQuality >= 70 ? 'Good' : 'Needs Work'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Study Streak</span>
            </div>
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          {/* Weekly Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Weekly Study Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyDistribution.map((day, index) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-muted-foreground">{day.day}</div>
                    <div className="flex-1">
                      <Progress 
                        value={(day.minutes / 120) * 100} 
                        className="h-3" 
                      />
                    </div>
                    <div className="w-16 text-sm font-mono text-right">{day.minutes}m</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Study Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentSessions.slice(0, 5).map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.completed ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium capitalize">{session.contentType} Study</p>
                        <p className="text-xs text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-mono">{session.duration}m</p>
                      <Badge variant="outline" className="text-xs">
                        {session.focusScore}% focus
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Monthly Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Detailed monthly analytics coming soon. Track your long-term progress and identify patterns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All-Time Stats</h3>
              <p className="text-muted-foreground mb-4">
                Your complete learning journey. View achievements, milestones, and overall progress.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Productivity Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Productivity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === 'positive' 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : insight.type === 'improvement'
                    ? 'bg-yellow-500/10 border-yellow-500/20'
                    : 'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <h4 className="font-medium mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Weekly Goal Setting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current weekly goal: {Math.floor(stats.weeklyGoal / 60)}h {stats.weeklyGoal % 60}m
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSetWeeklyGoal(300)} // 5 hours
              >
                5 hours/week
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSetWeeklyGoal(600)} // 10 hours
              >
                10 hours/week
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSetWeeklyGoal(900)} // 15 hours
              >
                15 hours/week
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};