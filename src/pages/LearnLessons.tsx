import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWeeks, useWeekData } from '@/hooks/useWeeks';
import { WeekCard } from '@/components/WeekCard';
import { WeekContentTabs } from '@/components/WeekContentTabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedContent from '@/components/ProtectedContent';

const LearnLessons = () => {
  const navigate = useNavigate();
  const { weekId } = useParams();
  const { data: weeks, isLoading: weeksLoading } = useWeeks();
  const { data: weekData, isLoading: weekDataLoading } = useWeekData(weekId || '');

  if (weeksLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
          <div className="text-center space-y-4">
            <GraduationCap className="w-12 h-12 text-primary animate-pulse mx-auto" />
            <p className="text-muted-foreground">Loading training weeks...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // If we have a weekId but no weekData yet, show loading
  if (weekId && weekDataLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner />
            <p className="text-muted-foreground">Loading week content...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // If we have weekId and weekData, show week content
  if (weekId && weekData) {
    return (
      <AppLayout>
        <ProtectedContent>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header with back button */}
              <div className="mb-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/learn')}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Training Weeks
                </Button>
                
                <div className="text-center space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Week {weekData.week_number}: {weekData.title}
                  </h1>
                  {weekData.objective && (
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      {weekData.objective}
                    </p>
                  )}
                </div>
              </div>

              {/* Week Content Tabs */}
              <WeekContentTabs weekData={weekData} />
            </div>
          </div>
        </ProtectedContent>
      </AppLayout>
    );
  }

  // Default view: show all weeks
  return (
    <AppLayout>
      <ProtectedContent>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Enhanced Header */}
            <div className="text-center mb-12 space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-6 bg-accent animate-pulse"></div>
                <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  TRAINING WEEKS
                </h1>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground">
                  {weeks?.length || 0} weeks of structured training content
                </p>
                <p className="text-sm text-muted-foreground">
                  Each week contains modules, tasks, assignments, and review steps to guide your progress.
                </p>
              </div>
            </div>

            {/* Weeks Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {weeks?.map((week) => (
                <WeekCard
                  key={week.id}
                  week={week}
                  onClick={() => navigate(`/learn/${week.id}`)}
                  className="hover:border-accent/50"
                />
              ))}
            </div>

            {/* Empty State */}
            {!weeks?.length && (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Training Weeks Available</h3>
                <p className="text-muted-foreground">
                  Training content will be available once it's been created by administrators.
                </p>
              </div>
            )}
          </div>
        </div>
      </ProtectedContent>
    </AppLayout>
  );
};

export default LearnLessons;