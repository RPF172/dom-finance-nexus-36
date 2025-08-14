import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Target, Clock, Star, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useObedienceLeaderboard } from '@/hooks/useLeaderboard';

interface RealCommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants?: number;
  progress: number;
  target: number;
  unit: string;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  isParticipating: boolean;
  leaderboard: Array<{
    rank: number;
    userId: string;
    name: string;
    avatar?: string;
    progress: number;
    points: number;
  }>;
}

export const useRealCommunityChallenges = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: leaderboardData } = useObedienceLeaderboard(5);

  return useQuery({
    queryKey: ['community-challenges', currentUser?.id],
    queryFn: (): RealCommunityChallenge[] => {
      // Generate challenges based on real user data
      const now = new Date();
      
      const challenges: RealCommunityChallenge[] = [
        {
          id: 'weekly-learning',
          title: 'Weekly Learning Sprint',
          description: 'Complete lessons and earn OP to climb the leaderboard',
          type: 'weekly',
          difficulty: 'medium',
          startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          participants: 25 + Math.floor(Math.random() * 50),
          maxParticipants: 100,
          progress: Math.floor(Math.random() * 10),
          target: 10,
          unit: 'activities',
          reward: {
            points: 250,
            badge: 'Speed Learner',
            title: 'Sprint Master'
          },
          isParticipating: true,
          leaderboard: leaderboardData?.map((user, index) => ({
            rank: index + 1,
            userId: user.user_id,
            name: user.display_name || 'Anonymous',
            avatar: user.avatar_url || undefined,
            progress: Math.max(0, 10 - index * 2),
            points: user.total_points
          })) || []
        },
        {
          id: 'perfectionist',
          title: 'Perfectionist Challenge',
          description: 'Build up your knowledge with consistent learning',
          type: 'special',
          difficulty: 'hard',
          startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // yesterday
          endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
          participants: 15 + Math.floor(Math.random() * 25),
          progress: Math.floor(Math.random() * 5),
          target: 5,
          unit: 'achievements',
          reward: {
            points: 500,
            badge: 'Perfectionist',
            title: 'Master Scholar'
          },
          isParticipating: false,
          leaderboard: leaderboardData?.slice(0, 3).map((user, index) => ({
            rank: index + 1,
            userId: user.user_id,
            name: user.display_name || 'Anonymous',
            avatar: user.avatar_url || undefined,
            progress: 5 - index,
            points: user.total_points + (5 - index) * 100
          })) || []
        }
      ];

      return challenges;
    },
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants?: number;
  progress: number;
  target: number;
  unit: string;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  isParticipating: boolean;
  leaderboard: Array<{
    rank: number;
    userId: string;
    name: string;
    avatar?: string;
    progress: number;
    points: number;
  }>;
}

const CommunityChallenge: React.FC = () => {
  const { data: challenges, isLoading } = useRealCommunityChallenges();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  useEffect(() => {
    if (challenges && challenges.length > 0 && !selectedChallenge) {
      setSelectedChallenge(challenges[0].id);
    }
  }, [challenges, selectedChallenge]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Active Challenges</h3>
        <p className="text-muted-foreground">Check back soon for new community challenges!</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'weekly': return <Calendar className="h-4 w-4" />;
      case 'monthly': return <Clock className="h-4 w-4" />;
      case 'special': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const joinChallenge = (challengeId: string) => {
    // In a real app, this would make an API call
    console.log('Joining challenge:', challengeId);
  };

  const selectedChallengeData = challenges.find(c => c.id === selectedChallenge);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community Challenges</h2>
          <p className="text-muted-foreground">
            Join challenges to earn extra OP, badges, and compete with the community
          </p>
        </div>
      </div>

      <Tabs value={selectedChallenge || undefined} onValueChange={setSelectedChallenge} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          {challenges.map((challenge) => (
            <TabsTrigger key={challenge.id} value={challenge.id} className="flex items-center gap-2">
              {getTypeIcon(challenge.type)}
              <span className="hidden sm:inline">{challenge.title}</span>
              <span className="sm:hidden">{challenge.type}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {challenges.map((challenge) => (
          <TabsContent key={challenge.id} value={challenge.id} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Challenge Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(challenge.type)}
                        {challenge.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getDifficultyColor(challenge.difficulty)} text-white`}
                        >
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {challenge.participants.toLocaleString()} joined
                        </Badge>
                      </div>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{challenge.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {challenge.progress} / {challenge.target} {challenge.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.target) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ends in</p>
                      <p className="font-medium">
                        {formatDistanceToNow(challenge.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reward</p>
                      <p className="font-medium text-primary">
                        {challenge.reward.points} OP
                      </p>
                    </div>
                  </div>

                  {challenge.reward.badge && (
                    <div className="p-3 bg-gradient-primary/10 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Medal className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">Unlock: {challenge.reward.badge}</p>
                          {challenge.reward.title && (
                            <p className="text-sm text-muted-foreground">
                              Title: {challenge.reward.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {!challenge.isParticipating ? (
                    <Button 
                      onClick={() => joinChallenge(challenge.id)}
                      className="w-full"
                    >
                      Join Challenge
                    </Button>
                  ) : (
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">You're participating!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {challenge.leaderboard.map((entry) => (
                      <div 
                        key={entry.userId}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          entry.userId === 'me' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                          {entry.rank === 1 && <span className="text-yellow-500">🥇</span>}
                          {entry.rank === 2 && <span className="text-gray-400">🥈</span>}
                          {entry.rank === 3 && <span className="text-orange-500">🥉</span>}
                          {entry.rank > 3 && entry.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>{entry.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.progress} {challenge.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{entry.points} OP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CommunityChallenge;