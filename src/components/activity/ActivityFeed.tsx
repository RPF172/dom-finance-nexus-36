import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Trophy, MessageCircle, Heart, UserPlus, Star, 
  Clock, Filter, RefreshCw, TrendingUp, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'lesson_completed' | 'achievement_unlocked' | 'post_created' | 'comment_added' | 'user_followed' | 'quiz_completed' | 'challenge_joined';
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  content: {
    title?: string;
    description?: string;
    points?: number;
    badge?: string;
    lessonTitle?: string;
    postTitle?: string;
    challengeTitle?: string;
    score?: number;
  };
  interactions: {
    likes: number;
    comments: number;
    isLiked: boolean;
  };
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [filter]);

  const loadActivities = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'achievement_unlocked',
        userId: '1',
        userName: 'Sarah Johnson',
        userAvatar: '/placeholder-avatar.jpg',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        content: {
          title: 'Speed Learner',
          description: 'Completed 10 lessons in one week',
          points: 250,
          badge: 'Speed Learner'
        },
        interactions: { likes: 12, comments: 3, isLiked: false }
      },
      {
        id: '2',
        type: 'lesson_completed',
        userId: '2',
        userName: 'Mike Chen',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        content: {
          lessonTitle: 'Advanced React Patterns',
          points: 50
        },
        interactions: { likes: 8, comments: 1, isLiked: true }
      },
      {
        id: '3',
        type: 'post_created',
        userId: '3',
        userName: 'Emma Wilson',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        content: {
          postTitle: 'Just finished my first full-stack project!',
          description: 'Built a complete e-commerce app with React and Node.js. Feeling accomplished! 🎉'
        },
        interactions: { likes: 24, comments: 7, isLiked: false }
      },
      {
        id: '4',
        type: 'quiz_completed',
        userId: '4',
        userName: 'Alex Turner',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        content: {
          lessonTitle: 'JavaScript Fundamentals Quiz',
          score: 95,
          points: 75
        },
        interactions: { likes: 6, comments: 2, isLiked: false }
      },
      {
        id: '5',
        type: 'challenge_joined',
        userId: '5',
        userName: 'Lisa Wang',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        content: {
          challengeTitle: 'Weekly Learning Sprint',
          description: 'Joined the community challenge to complete 10 lessons this week'
        },
        interactions: { likes: 4, comments: 0, isLiked: false }
      },
      {
        id: '6',
        type: 'user_followed',
        userId: '6',
        userName: 'David Kim',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        content: {
          description: 'Started following 3 new learners in the community'
        },
        interactions: { likes: 2, comments: 0, isLiked: false }
      }
    ];

    setActivities(mockActivities);
    setIsLoading(false);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lesson_completed':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'achievement_unlocked':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'post_created':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'quiz_completed':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'challenge_joined':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'user_followed':
        return <UserPlus className="h-4 w-4 text-pink-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityTitle = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'lesson_completed':
        return `completed "${activity.content.lessonTitle}"`;
      case 'achievement_unlocked':
        return `unlocked the "${activity.content.badge}" achievement`;
      case 'post_created':
        return `shared a new post`;
      case 'quiz_completed':
        return `scored ${activity.content.score}% on "${activity.content.lessonTitle}"`;
      case 'challenge_joined':
        return `joined "${activity.content.challengeTitle}"`;
      case 'user_followed':
        return `followed new community members`;
      default:
        return 'had some activity';
    }
  };

  const toggleLike = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? {
            ...activity,
            interactions: {
              ...activity.interactions,
              isLiked: !activity.interactions.isLiked,
              likes: activity.interactions.isLiked 
                ? activity.interactions.likes - 1 
                : activity.interactions.likes + 1
            }
          }
        : activity
    ));
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community Activity</h2>
          <p className="text-muted-foreground">
            See what your learning community is up to
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="lesson_completed">Lessons</SelectItem>
              <SelectItem value="achievement_unlocked">Achievements</SelectItem>
              <SelectItem value="post_created">Posts</SelectItem>
              <SelectItem value="quiz_completed">Quizzes</SelectItem>
              <SelectItem value="challenge_joined">Challenges</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadActivities}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.userAvatar} />
                        <AvatarFallback>{activity.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <p className="text-sm">
                            <span className="font-medium">{activity.userName}</span>{' '}
                            {getActivityTitle(activity)}
                          </p>
                        </div>

                        {activity.content.description && (
                          <p className="text-sm text-muted-foreground pl-6">
                            {activity.content.description}
                          </p>
                        )}

                        {activity.content.points && (
                          <div className="pl-6">
                            <Badge variant="secondary" className="text-xs">
                              +{activity.content.points} OP
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center justify-between pl-6">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </p>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLike(activity.id)}
                              className={`h-8 px-2 ${activity.interactions.isLiked ? 'text-red-500' : ''}`}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${activity.interactions.isLiked ? 'fill-current' : ''}`} />
                              {activity.interactions.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {activity.interactions.comments}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;