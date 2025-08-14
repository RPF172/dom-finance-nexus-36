import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Target, Clock, Star, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { useRealCommunityChallenges } from '@/hooks/useRealCommunityChallenges';

const CommunityChallenge: React.FC = () => {
  const { challenges, isLoading, joinChallenge, leaveChallenge, isJoiningChallenge, isLeavingChallenge } = useRealCommunityChallenges();
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'engagement': return <Users className="h-4 w-4" />;
      case 'learning': return <Calendar className="h-4 w-4" />;
      case 'social': return <Clock className="h-4 w-4" />;
      case 'submission': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleJoinLeave = (challengeId: string, isJoined: boolean) => {
    if (isJoined) {
      leaveChallenge(challengeId);
    } else {
      joinChallenge(challengeId);
    }
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {challenges.slice(0, 4).map((challenge) => (
            <TabsTrigger key={challenge.id} value={challenge.id} className="flex items-center gap-2">
              {getTypeIcon(challenge.type)}
              <span className="hidden sm:inline truncate">{challenge.title}</span>
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
                          {challenge.participant_count} joined
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
                        {challenge.user_progress} / {challenge.target_value}
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.user_progress / challenge.target_value) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ends in</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(challenge.end_date))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reward</p>
                      <p className="font-medium text-primary">
                        {challenge.reward_points} OP
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-primary/10 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Medal className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Challenge Reward</p>
                        <p className="text-sm text-muted-foreground">
                          Earn {challenge.reward_points} OP for completion
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleJoinLeave(challenge.id, challenge.is_joined)}
                    className="w-full"
                    disabled={isJoiningChallenge || isLeavingChallenge}
                  >
                    {isJoiningChallenge || isLeavingChallenge 
                      ? 'Processing...' 
                      : challenge.is_joined 
                        ? 'Leave Challenge' 
                        : 'Join Challenge'
                    }
                  </Button>

                  {challenge.is_joined && (
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
                    {challenge.leaderboard.length > 0 ? (
                      challenge.leaderboard.map((entry, index) => (
                        <div 
                          key={entry.user_id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                            {index + 1 === 1 && <span className="text-yellow-500">🥇</span>}
                            {index + 1 === 2 && <span className="text-gray-400">🥈</span>}
                            {index + 1 === 3 && <span className="text-orange-500">🥉</span>}
                            {index + 1 > 3 && (index + 1)}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={entry.avatar_url} />
                            <AvatarFallback>{entry.display_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${entry.is_premium ? 'text-yellow-500' : ''}`}>
                              {entry.display_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry.progress} points
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No participants yet. Be the first to join!</p>
                      </div>
                    )}
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