import React, { useEffect, useState } from 'react';
import { Award, Star, Target, Flame, Book, Brain, Clock, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
}

const achievementsList: Record<string, Achievement> = {
  content_master: {
    id: 'content_master',
    title: 'Content Master',
    description: 'Completed reading a chapter or lesson',
    icon: Book,
    rarity: 'common',
    xp: 10
  },
  focused_reader: {
    id: 'focused_reader',
    title: 'Focused Reader',
    description: '25+ minutes of continuous reading',
    icon: Target,
    rarity: 'rare',
    xp: 25
  },
  speed_reader: {
    id: 'speed_reader',
    title: 'Speed Reader',
    description: 'Completed reading in under estimated time',
    icon: Clock,
    rarity: 'rare',
    xp: 20
  },
  knowledge_seeker: {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Completed 5 lessons in a day',
    icon: Brain,
    rarity: 'epic',
    xp: 50
  },
  dedication: {
    id: 'dedication',
    title: 'Dedication',
    description: 'Studied for 7 consecutive days',
    icon: Flame,
    rarity: 'epic',
    xp: 75
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Scored 100% on 5 quizzes',
    icon: Star,
    rarity: 'legendary',
    xp: 100
  },
  scholar: {
    id: 'scholar',
    title: 'Scholar',
    description: 'Completed 50 lessons',
    icon: Trophy,
    rarity: 'legendary',
    xp: 200
  }
};

const rarityColors = {
  common: 'bg-slate-500/20 border-slate-500/30 text-slate-400',
  rare: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  epic: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  legendary: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
};

interface AchievementToastProps {
  achievements: string[];
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievements
}) => {
  const [showingAchievement, setShowingAchievement] = useState<Achievement | null>(null);
  const [previousAchievements, setPreviousAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Check for new achievements
    const newAchievements = achievements.filter(id => !previousAchievements.includes(id));
    
    if (newAchievements.length > 0) {
      // Show the first new achievement
      const achievementId = newAchievements[0];
      const achievement = achievementsList[achievementId];
      
      if (achievement) {
        setShowingAchievement(achievement);
        
        // Hide after 4 seconds
        setTimeout(() => {
          setShowingAchievement(null);
        }, 4000);
      }
    }
    
    setPreviousAchievements(achievements);
  }, [achievements, previousAchievements]);

  if (!showingAchievement) return null;

  const IconComponent = showingAchievement.icon;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <Card className={cn(
        "border-2 shadow-lg backdrop-blur-sm",
        rarityColors[showingAchievement.rarity]
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn(
                "p-2 rounded-full",
                showingAchievement.rarity === 'legendary' && "animate-pulse"
              )}>
                <IconComponent className="h-6 w-6" />
              </div>
              {showingAchievement.rarity === 'legendary' && (
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-75 blur animate-pulse" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-sm">🎉 Achievement Unlocked!</h3>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs capitalize", rarityColors[showingAchievement.rarity])}
                >
                  {showingAchievement.rarity}
                </Badge>
              </div>
              
              <p className="font-medium text-sm">{showingAchievement.title}</p>
              <p className="text-xs opacity-90">{showingAchievement.description}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs">
                  <Award className="h-3 w-3" />
                  <span>+{showingAchievement.xp} XP</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};