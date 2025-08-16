import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeekSlides } from '@/hooks/useWeekSlides';
import { useAllWeekProgress } from '@/hooks/useWeekProgress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AdminWeekSlideFAB } from '@/components/admin/AdminWeekSlideFAB';

export const WeekBasedLearning: React.FC = () => {
  const navigate = useNavigate();
  const { data: weeks, isLoading } = useWeekSlides();
  const { data: weekProgressData } = useAllWeekProgress();

  const handleStartWeek = (weekId: string) => {
    navigate(`/week/${weekId}/experience`);
  };

  const getWeekProgress = (weekId: string) => {
    return weekProgressData?.find(p => p.week_id === weekId);
  };

  const isWeekUnlocked = (weekNumber: number) => {
    if (weekNumber === 1) return true;
    
    const previousWeek = weeks?.find(w => w.week_number === weekNumber - 1);
    if (!previousWeek) return true;
    
    const progress = getWeekProgress(previousWeek.id);
    return progress?.progress_percentage === 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-institutional font-bold tracking-wider mb-4">
            LEARNING PATH
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Progress through your indoctrination journey. Complete each week to unlock the next.
          </p>
        </motion.div>

        {/* Simplified Week List */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {weeks?.map((week, index) => {
            const isUnlocked = isWeekUnlocked(week.week_number);
            const progress = getWeekProgress(week.id);
            const isCompleted = progress?.progress_percentage === 100;

            return (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    !isUnlocked 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-lg hover:scale-[1.02]'
                  } ${isCompleted ? 'border-primary bg-primary/5' : ''}`}
                  onClick={isUnlocked ? () => handleStartWeek(week.id) : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant={isCompleted ? 'default' : isUnlocked ? 'secondary' : 'outline'}
                        >
                          Week {week.week_number}
                        </Badge>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-primary" />}
                        {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <h3 className="text-xl font-institutional font-bold mb-1">
                        {week.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {week.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button
                        disabled={!isUnlocked}
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? "Review" : progress ? "Continue" : "Start"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {(!weeks || weeks.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto p-8">
              <h3 className="text-xl font-semibold mb-4">No Content Available</h3>
              <p className="text-muted-foreground">
                Learning content is being prepared. Check back soon.
              </p>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Admin FAB */}
      <AdminWeekSlideFAB onWeekCreated={() => window.location.reload()} />
    </div>
  );
};