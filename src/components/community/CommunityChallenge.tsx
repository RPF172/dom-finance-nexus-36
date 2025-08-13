import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Target, Clock, Star, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  useEffect(() => {
    // Mock challenges data
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Weekly Learning Sprint',
        description: 'Complete 10 lessons this week to earn bonus OP and unlock the Speed Learner badge',
        type: 'weekly',
        difficulty: 'medium',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        participants: 847,
        maxParticipants: 1000,
        progress: 6,
        target: 10,
        unit: 'lessons',
        reward: {
          points: 250,
          badge: 'Speed Learner',
          title: 'Sprint Master'
        },
        isParticipating: true,
        leaderboard: [
          { rank: 1, userId: '1', name: 'Sarah Johnson', avatar: '/placeholder-avatar.jpg', progress: 10, points: 250 },
          { rank: 2, userId: '2', name: 'Mike Chen', progress: 9, points: 225 },
          { rank: 3, userId: '3', name: 'Emma Wilson', progress: 8, points: 200 },
          { rank: 4, userId: 'me', name: 'You', progress: 6, points: 150 },
          { rank: 5, userId: '4', name: 'John Doe', progress: 5, points: 125 }
        ]
      },
      {
        id: '2',
        title: 'Perfectionist Challenge',
        description: 'Score 100% on 5 quizzes in a row to prove your mastery',
        type: 'special',
        difficulty: 'hard',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        participants: 234,
        progress: 2,
        target: 5,
        unit: 'perfect scores',
        reward: {
          points: 500,
          badge: 'Perfectionist',
          title: 'Quiz Master'
        },
        isParticipating: false,
        leaderboard: [
          { rank: 1, userId: '5', name: 'Alex Turner', progress: 5, points: 500 },
          { rank: 2, userId: '6', name: 'Lisa Wang', progress: 4, points: 400 },
          { rank: 3, userId: '7', name: 'David Kim', progress: 3, points: 300 }
        ]
      },
      {
        id: '3',
        title: 'Monthly Dedication',
        description: 'Study for at least 30 minutes every day this month',
        type: 'monthly',
        difficulty: 'medium',
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 0, 31),
        participants: 1205,
        progress: 18,
        target: 31,
        unit: 'days',
        reward: {
          points: 750,
          badge: 'Dedicated Scholar',
          title: 'Consistency Champion'
        },
        isParticipating: true,
        leaderboard: [
          { rank: 1, userId: '8', name: 'Maria Garcia', progress: 31, points: 750 },
          { rank: 2, userId: '9', name: 'Tom Wilson', progress: 28, points: 700 },
          { rank: 3, userId: 'me', name: 'You', progress: 18, points: 450 }
        ]
      }
    ];

    setChallenges(mockChallenges);
    setSelectedChallenge(mockChallenges[0].id);
  }, []);

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
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isParticipating: true, participants: challenge.participants + 1 }
        : challenge
    ));
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
        <TabsList className="grid w-full grid-cols-3">
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