import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { useWeeks } from '@/hooks/useWeeks';

export const LearningProgressWidget: React.FC = () => {
  const navigate = useNavigate();
  const { data: sequencedContent } = useContentSequence();
  const { data: fallbackContent } = useFallbackMixedContent();
  const { data: progressData } = useAllUserProgress();
  const { data: weeks } = useWeeks();

  // Process content
  const mixedContent = sequencedContent?.length ? sequencedContent : fallbackContent;
  const chaptersOnly = mixedContent?.filter(item => item.type === 'chapter') || [];
  const lessonsOnly = mixedContent?.filter(item => item.type === 'lesson') || [];

  // Calculate progress statistics
  const completedChapters = progressData?.filter(p => p.completed && chaptersOnly.some(c => c.content.id === p.lesson_id)).length || 0;
  const totalChapters = chaptersOnly.length;
  const chapterProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const completedLessons = progressData?.filter(p => p.completed && lessonsOnly.some(l => l.content.id === p.lesson_id)).length || 0;
  const totalLessons = lessonsOnly.length;
  const lessonProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const overallProgress = Math.round(((completedChapters + completedLessons) / (totalChapters + totalLessons)) * 100) || 0;

  // Find next content
  const nextChapter = chaptersOnly.find(item => !progressData?.some(p => p.lesson_id === item.content.id && p.completed));
  const nextWeek = weeks?.[0]; // Simplified - get first available week

  // Get recently completed content
  const recentlyCompleted = progressData
    ?.filter(p => p.completed && p.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Main Progress Overview */}
      <Card className="institutional-card bg-gradient-to-r from-card to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Learning Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Overall Completion</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {overallProgress}%
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {completedChapters + completedLessons} of {totalChapters + totalLessons} items completed
            </p>
          </div>

          {/* Individual Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Training</span>
                <span className="text-sm text-muted-foreground ml-auto">{completedLessons}/{totalLessons}</span>
              </div>
              <Progress value={lessonProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Story</span>
                <span className="text-sm text-muted-foreground ml-auto">{completedChapters}/{totalChapters}</span>
              </div>
              <Progress value={chapterProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nextWeek && (
          <Card className="institutional-card border-primary bg-gradient-to-br from-card to-primary/5 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Continue Training</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{nextWeek.title}</p>
                  <p className="text-xs text-muted-foreground">{nextWeek.objective || 'Continue your structured learning'}</p>
                </div>
                <Button 
                  size="sm" 
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => navigate(`/learn/${nextWeek.id}`)}
                >
                  Week {nextWeek.week_number}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {nextChapter && (
          <Card className="institutional-card border-accent bg-gradient-to-br from-card to-accent/5 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent animate-pulse" />
                  <span className="text-sm font-medium text-accent">Continue Reading</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{nextChapter.content.title}</p>
                  <p className="text-xs text-muted-foreground">Next in the story sequence</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent/10 group-hover:scale-105 transition-transform"
                  onClick={() => navigate(`/chapter/${nextChapter.content.id}`)}
                >
                  Read Chapter
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      {recentlyCompleted.length > 0 && (
        <Card className="institutional-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentlyCompleted.map((item, index) => {
                const content = [...chaptersOnly, ...lessonsOnly].find(c => c.content.id === item.lesson_id);
                if (!content) return null;
                
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{content.content.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.completed_at!).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">Complete</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};