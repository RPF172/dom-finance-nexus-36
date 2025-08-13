import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Star, Zap, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { useWeeks } from '@/hooks/useWeeks';
import { useObedience } from '@/hooks/useObedience';

interface Recommendation {
  id: string;
  type: 'week' | 'chapter' | 'practice';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

export const PersonalizedRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { data: sequencedContent } = useContentSequence();
  const { data: fallbackContent } = useFallbackMixedContent();
  const { data: progressData } = useAllUserProgress();
  const { data: weeks } = useWeeks();
  const { data: obedience } = useObedience();

  // Process content
  const mixedContent = sequencedContent?.length ? sequencedContent : fallbackContent;
  const chaptersOnly = mixedContent?.filter(item => item.type === 'chapter') || [];

  // Calculate user metrics
  const completedCount = progressData?.filter(p => p.completed).length || 0;
  const totalCount = mixedContent?.length || 0;
  const completionRate = totalCount > 0 ? completedCount / totalCount : 0;
  const opPoints = obedience?.summary?.total_points || 0;

  // Generate personalized recommendations
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // New user recommendations
    if (completedCount === 0) {
      if (weeks && weeks.length > 0) {
        recommendations.push({
          id: 'first-week',
          type: 'week',
          title: 'Start Your Training Journey',
          description: weeks[0].title,
          reason: 'Perfect for beginners',
          priority: 'high',
          action: () => navigate(`/learn/${weeks[0].id}`),
          icon: GraduationCap
        });
      }

      if (chaptersOnly.length > 0) {
        recommendations.push({
          id: 'first-chapter',
          type: 'chapter',
          title: 'Begin the Story',
          description: chaptersOnly[0].content.title,
          reason: 'Start from the beginning',
          priority: 'high',
          action: () => navigate(`/chapter/${chaptersOnly[0].content.id}`),
          icon: BookOpen
        });
      }

      recommendations.push({
        id: 'try-game',
        type: 'practice',
        title: 'Try Typing Trial',
        description: 'Test your skills in our speed game',
        reason: 'Great way to get started',
        priority: 'medium',
        action: () => navigate('/games/typing-trial'),
        icon: Zap
      });
    }

    // Returning user recommendations
    else if (completionRate < 0.3) {
      // Find next unstarted week
      const nextWeek = weeks?.find(week => 
        !progressData?.some(p => p.lesson_id && week.id === p.lesson_id)
      );
      
      if (nextWeek) {
        recommendations.push({
          id: 'continue-training',
          type: 'week',
          title: 'Continue Your Training',
          description: nextWeek.title,
          reason: 'Keep up the momentum',
          priority: 'high',
          action: () => navigate(`/learn/${nextWeek.id}`),
          icon: GraduationCap
        });
      }

      // Find next chapter
      const nextChapter = chaptersOnly.find(item => 
        !progressData?.some(p => p.lesson_id === item.content.id && p.completed)
      );
      
      if (nextChapter) {
        recommendations.push({
          id: 'next-chapter',
          type: 'chapter',
          title: 'Continue Reading',
          description: nextChapter.content.title,
          reason: 'Next in the story',
          priority: 'medium',
          action: () => navigate(`/chapter/${nextChapter.content.id}`),
          icon: BookOpen
        });
      }
    }

    // Advanced user recommendations
    else if (completionRate >= 0.3) {
      recommendations.push({
        id: 'games-challenge',
        type: 'practice',
        title: 'Challenge Yourself',
        description: 'Compete in games to earn more OP',
        reason: `You have ${opPoints} OP - time to earn more!`,
        priority: 'medium',
        action: () => navigate('/compete'),
        icon: Zap
      });

      // Find incomplete advanced content
      const incompleteContent = mixedContent?.filter(item => 
        !progressData?.some(p => p.lesson_id === item.content.id && p.completed)
      ) || [];

      if (incompleteContent.length > 0) {
        const randomContent = incompleteContent[Math.floor(Math.random() * incompleteContent.length)];
        recommendations.push({
          id: 'explore-content',
          type: randomContent.type as 'week' | 'chapter',
          title: 'Explore New Content',
          description: randomContent.content.title,
          reason: 'Based on your progress',
          priority: 'low',
          action: () => {
            if (randomContent.type === 'chapter') {
              navigate(`/chapter/${randomContent.content.id}`);
            } else {
              navigate(`/lesson/${randomContent.content.id}`);
            }
          },
          icon: randomContent.type === 'chapter' ? BookOpen : GraduationCap
        });
      }
    }

    // Always recommend community engagement
    if (recommendations.length < 3) {
      recommendations.push({
        id: 'community',
        type: 'practice',
        title: 'Join the Community',
        description: 'Connect with other learners',
        reason: 'Share your progress',
        priority: 'low',
        action: () => navigate('/social'),
        icon: Star
      });
    }

    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const recommendations = generateRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-200 bg-red-50';
      case 'medium': return 'text-yellow-500 border-yellow-200 bg-yellow-50';
      case 'low': return 'text-blue-500 border-blue-200 bg-blue-50';
      default: return 'text-muted-foreground';
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="institutional-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={rec.action}
          >
            <div className="flex-shrink-0">
              <rec.icon className="w-5 h-5 text-primary mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
              >
                Start now
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};