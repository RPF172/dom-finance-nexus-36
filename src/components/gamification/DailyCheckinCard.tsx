import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Zap, Trophy, CheckCircle2 } from 'lucide-react';
import { useDailyCheckin } from '@/hooks/useDailyCheckin';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DailyCheckinCard: React.FC = () => {
  const { 
    hasCheckedInToday, 
    currentStreak, 
    todayPoints, 
    streakData, 
    checkin, 
    isCheckingIn,
    isLoading 
  } = useDailyCheckin();
  const { toast } = useToast();

  const handleCheckin = () => {
    checkin(undefined, {
      onSuccess: (data) => {
        toast({
          title: data.is_new_checkin ? "Daily tribute accepted!" : "Already submitted today",
          description: data.is_new_checkin 
            ? `+${data.points_awarded} OP awarded (Day ${data.streak_day} streak)`
            : `You earned ${data.points_awarded} OP today (Day ${data.streak_day})`,
          variant: data.is_new_checkin ? "default" : "destructive",
        });
      },
      onError: (error) => {
        toast({
          title: "Submission failed",
          description: "Unable to record your daily tribute.",
          variant: "destructive",
        });
      }
    });
  };

  const getNextDayReward = () => {
    const nextDay = currentStreak + 1;
    if (nextDay > 7) return 5; // Reset to day 1
    const rewards = [0, 5, 10, 20, 40, 80, 160, 320];
    return rewards[nextDay] || 5;
  };

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-accent">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-accent hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-lg font-institutional tracking-wide uppercase">Daily Tribute</span>
          </div>
          {hasCheckedInToday && (
            <Badge variant="outline" className="border-accent text-accent">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Check-in Button */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Button
              onClick={handleCheckin}
              disabled={isCheckingIn}
              className={cn(
                "w-full font-institutional tracking-wider uppercase transition-all duration-300",
                hasCheckedInToday 
                  ? "bg-muted text-muted-foreground cursor-default hover:bg-muted" 
                  : "hover:scale-105 hover:shadow-lg"
              )}
              variant={hasCheckedInToday ? "outline" : "default"}
            >
              {isCheckingIn ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Processing...
                </div>
              ) : hasCheckedInToday ? (
                `Today's Tribute Received (+${todayPoints} OP)`
              ) : (
                "Submit Daily Tribute!"
              )}
            </Button>
          </div>
        </div>

        {/* Streak Info */}
        {currentStreak > 0 && (
          <div className="flex items-center justify-between text-sm bg-accent/5 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Current Streak: {currentStreak} days</span>
            </div>
            {!hasCheckedInToday && (
              <div className="flex items-center gap-1 text-accent">
                <Zap className="w-3 h-3" />
                <span>Next: +{getNextDayReward()} OP</span>
              </div>
            )}
          </div>
        )}

        {/* 7-Day Streak Visual */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
            7-Day Streak Tracker
          </div>
          <div className="grid grid-cols-7 gap-1">
            {streakData.map((day, index) => (
              <div
                key={day.date}
                className={cn(
                  "aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-mono transition-all duration-200",
                  day.isCheckedIn
                    ? "border-accent bg-accent/20 text-accent"
                    : day.isToday
                    ? "border-accent/50 bg-accent/5 text-accent/70"
                    : "border-muted bg-muted/20 text-muted-foreground"
                )}
              >
                <div className="text-[10px] leading-none">{day.day}</div>
                {day.isCheckedIn && (
                  <CheckCircle2 className="w-3 h-3 mt-0.5" />
                )}
              </div>
            ))}
          </div>
          
          {/* Reward Scale */}
          <div className="text-xs text-muted-foreground space-y-1 bg-muted/10 p-2 rounded">
            <div className="font-mono uppercase tracking-wider">Reward Scale:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
              <span>Day 1: +5 OP</span>
              <span>Day 2: +10 OP</span>
              <span>Day 3: +20 OP</span>
              <span>Day 4: +40 OP</span>
              <span>Day 5: +80 OP</span>
              <span>Day 6: +160 OP</span>
              <span className="col-span-2 text-accent">Day 7: +320 OP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCheckinCard;