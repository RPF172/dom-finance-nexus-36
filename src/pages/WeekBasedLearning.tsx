import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWeekSlides } from '@/hooks/useWeekSlides';
import { useAllWeekProgress } from '@/hooks/useWeekProgress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

        {/* Week Cards */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {weeks?.map((week, index) => {
            const isUnlocked = isWeekUnlocked(week.week_number);
            const progress = getWeekProgress(week.id);
            const isCompleted = progress?.progress_percentage === 100;
            const progressPercentage = progress?.progress_percentage || 0;

            return (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${
                  !isUnlocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg transition-all duration-300 cursor-pointer'
                } ${isCompleted ? 'border-primary bg-primary/5' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant={isCompleted ? 'default' : isUnlocked ? 'secondary' : 'outline'}
                            className="text-sm font-medium"
                          >
                            Week {week.week_number}
                          </Badge>
                          {isCompleted && <CheckCircle className="w-5 h-5 text-primary" />}
                          {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <CardTitle className="text-2xl font-institutional">
                          {week.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {week.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    {progressPercentage > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}

                    {/* Week Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          <span>{week.totalSlides} slides</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>~{Math.ceil(week.totalSlides * 2)} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Modules Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Modules</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {week.modules.slice(0, 4).map((module) => (
                          <div
                            key={module.id}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                          >
                            <span className="truncate">{module.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {module.slides.length} slides
                            </span>
                          </div>
                        ))}
                        {week.modules.length > 4 && (
                          <div className="p-2 bg-muted/30 rounded text-sm text-center text-muted-foreground">
                            +{week.modules.length - 4} more modules
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <Button
                        onClick={() => handleStartWeek(week.id)}
                        disabled={!isUnlocked}
                        className="w-full"
                        size="lg"
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review Week
                          </>
                        ) : progressPercentage > 0 ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue Week
                          </>
                        ) : isUnlocked ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Week
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>

                  {/* Completion Overlay */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>
                  )}
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
    </div>
  );
};