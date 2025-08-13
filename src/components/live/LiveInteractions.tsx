import React, { useState, useEffect } from 'react';
import { Users, Eye, MessageSquare, ThumbsUp, Share2, Zap, Crown, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'learning' | 'idle' | 'away';
  currentActivity?: string;
  streak: number;
  level: number;
}

interface LiveEvent {
  id: string;
  type: 'lesson_completed' | 'achievement' | 'milestone' | 'streak';
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  reactions: Record<string, number>;
}

const LiveInteractions: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<LiveUser[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);

  useEffect(() => {
    // Mock real-time data
    const mockUsers: LiveUser[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '/placeholder-avatar.jpg',
        status: 'learning',
        currentActivity: 'React Fundamentals',
        streak: 7,
        level: 15
      },
      {
        id: '2',
        name: 'Mike Chen',
        status: 'learning',
        currentActivity: 'JavaScript ES6',
        streak: 12,
        level: 22
      },
      {
        id: '3',
        name: 'Emma Wilson',
        status: 'idle',
        currentActivity: 'CSS Grid Layout',
        streak: 3,
        level: 8
      },
      {
        id: '4',
        name: 'Alex Turner',
        status: 'learning',
        currentActivity: 'Node.js Basics',
        streak: 25,
        level: 31
      }
    ];

    const mockEvents: LiveEvent[] = [
      {
        id: '1',
        type: 'lesson_completed',
        userId: '1',
        userName: 'Sarah Johnson',
        userAvatar: '/placeholder-avatar.jpg',
        content: 'completed "React Components"',
        timestamp: new Date(Date.now() - 1000 * 30),
        reactions: { '👏': 3, '🔥': 2, '💪': 1 }
      },
      {
        id: '2',
        type: 'achievement',
        userId: '2',
        userName: 'Mike Chen',
        content: 'unlocked "Speed Learner" badge',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        reactions: { '🎉': 5, '👏': 2, '🏆': 3 }
      },
      {
        id: '3',
        type: 'streak',
        userId: '4',
        userName: 'Alex Turner',
        content: 'reached a 25-day learning streak!',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        reactions: { '🔥': 8, '💪': 4, '👑': 2 }
      }
    ];

    setOnlineUsers(mockUsers);
    setLiveEvents(mockEvents);
    setTotalOnline(mockUsers.length + Math.floor(Math.random() * 100) + 50);
    setCurrentStreak(Math.floor(Math.random() * 15) + 1);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add new random event
      if (Math.random() > 0.7) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const eventTypes = ['lesson_completed', 'achievement', 'milestone'] as const;
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const newEvent: LiveEvent = {
          id: Date.now().toString(),
          type: randomType,
          userId: randomUser.id,
          userName: randomUser.name,
          userAvatar: randomUser.avatar,
          content: getRandomEventContent(randomType),
          timestamp: new Date(),
          reactions: {}
        };

        setLiveEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      }

      // Update online count
      setTotalOnline(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRandomEventContent = (type: LiveEvent['type']) => {
    const contents = {
      lesson_completed: [
        'completed "Advanced React Hooks"',
        'finished "JavaScript Promises"',
        'mastered "CSS Flexbox"',
        'completed "Node.js Express"'
      ],
      achievement: [
        'unlocked "Perfectionist" badge',
        'earned "Streak Master" title',
        'achieved "Quiz Champion" rank',
        'unlocked "Speed Learner" badge'
      ],
      milestone: [
        'reached Level 20!',
        'completed 50 lessons!',
        'earned 1000 OP!',
        'achieved 100% course completion!'
      ]
    };

    const options = contents[type];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getStatusColor = (status: LiveUser['status']) => {
    switch (status) {
      case 'learning': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: LiveEvent['type']) => {
    switch (type) {
      case 'lesson_completed': return '📚';
      case 'achievement': return '🏆';
      case 'milestone': return '🎯';
      case 'streak': return '🔥';
      default: return '⭐';
    }
  };

  const addReaction = (eventId: string, emoji: string) => {
    setLiveEvents(prev => prev.map(event => 
      event.id === eventId 
        ? {
            ...event,
            reactions: {
              ...event.reactions,
              [emoji]: (event.reactions[emoji] || 0) + 1
            }
          }
        : event
    ));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Live Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            Live Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalOnline}</div>
              <p className="text-sm text-muted-foreground">Learning Now</p>
            </div>
            <div className="text-center p-3 bg-gradient-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <p className="text-sm text-muted-foreground">Your Streak</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Currently Active ({onlineUsers.length})
            </h4>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 ${getStatusColor(user.status)} rounded-full border-2 border-background`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          L{user.level}
                        </Badge>
                      </div>
                      {user.currentActivity && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.currentActivity}
                        </p>
                      )}
                    </div>
                    {user.streak > 10 && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-orange-500" />
                        <span className="text-xs font-medium">{user.streak}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {liveEvents.map((event) => (
                <div key={event.id} className="p-3 bg-muted/30 rounded-lg animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{event.userName}</span> {event.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {Math.floor((Date.now() - event.timestamp.getTime()) / 1000)}s ago
                        </p>
                        <div className="flex items-center gap-1">
                          {Object.entries(event.reactions).map(([emoji, count]) => (
                            <Badge key={emoji} variant="secondary" className="text-xs h-6 px-2">
                              {emoji} {count}
                            </Badge>
                          ))}
                          <div className="flex gap-1 ml-2">
                            {['👏', '🔥', '💪'].map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-xs"
                                onClick={() => addReaction(event.id, emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveInteractions;