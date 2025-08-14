import React from 'react';
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
import { useRealActivityFeed } from '@/hooks/useRealActivityFeed';

const ActivityFeed: React.FC = () => {
  const { activities, isLoading, filter, setFilter, toggleLike, refetch } = useRealActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'obedience_points':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'post':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'learning_session':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'connection':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityTitle = (activity: any) => {
    if (activity.content?.title) {
      return activity.content.title;
    }
    
    switch (activity.type) {
      case 'obedience_points':
        return 'Earned Obedience Points';
      case 'post':
        return 'Created a Post';
      case 'learning_session':
        return 'Completed Learning Session';
      case 'connection':
        return 'Made a Connection';
      default:
        return 'Activity';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted rounded" />
                    <div className="h-3 w-32 bg-muted rounded" />
                    <div className="h-8 w-full bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Community Activity
          </h2>
          <p className="text-muted-foreground">
            See what the community has been up to recently
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="achievements">Achievements</SelectItem>
              <SelectItem value="connections">Connections</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
            <p className="text-muted-foreground text-center">
              {filter === 'all' 
                ? 'Be the first to create some activity in the community!'
                : `No recent ${filter} activity. Try changing the filter.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className={`font-medium ${activity.user.is_premium ? 'text-yellow-500' : ''}`}
                        >
                          {activity.user.name}
                        </span>
                        {activity.user.is_premium && (
                          <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-700">
                            Premium
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-sm">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {getActivityIcon(activity.type)}
                        <span className="font-medium text-sm">
                          {getActivityTitle(activity)}
                        </span>
                        {activity.content?.points && (
                          <Badge variant="outline" className="text-xs">
                            +{activity.content.points} OP
                          </Badge>
                        )}
                      </div>
                      
                      {activity.content?.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {activity.content.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(activity.id)}
                          className="h-8 px-2 hover:text-red-500"
                        >
                          <Heart 
                            className={`h-4 w-4 mr-1 ${activity.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                          {activity.likeCount}
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {activity.commentCount}
                        </Button>
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
  );
};

export default ActivityFeed;