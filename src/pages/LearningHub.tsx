import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Users, Calendar, TrendingUp, Award, ChevronRight, Play, Target, GraduationCap, Trophy, Zap } from 'lucide-react';
import { useContentSequence, useFallbackMixedContent } from '@/hooks/useContentSequence';
import { useAllUserProgress } from '@/hooks/useProgress';
import { useWeeks } from '@/hooks/useWeeks';
import { ContentCard } from '@/components/ContentCard';
import { WeekCard } from '@/components/WeekCard';
import { ChapterSkeleton } from '@/components/ChapterSkeleton';
import { useInfiniteChapters } from '@/hooks/useInfiniteChapters';
import { ContentManagerFAB } from '@/components/admin/ContentManagerFAB';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedContent from '@/components/ProtectedContent';

const LearningHub = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Data fetching
  const { data: sequencedContent, isLoading: isSequenceLoading } = useContentSequence();
  const { data: fallbackContent, isLoading: isFallbackLoading } = useFallbackMixedContent();
  const { data: progressData } = useAllUserProgress();
  const { data: weeks, isLoading: weeksLoading } = useWeeks();

  // Process content
  const mixedContent = sequencedContent?.length ? sequencedContent : fallbackContent;
  const chaptersOnly = mixedContent?.filter(item => item.type === 'chapter') || [];
  const lessonsOnly = mixedContent?.filter(item => item.type === 'lesson') || [];
  const isLoading = isSequenceLoading || isFallbackLoading || weeksLoading;

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();
          
          setIsAdmin(!!userRoles);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const {
    visibleChapters: visibleChapterItems,
    loadMoreRef: chaptersLoadMoreRef,
    isLoadingMore: isChaptersLoadingMore,
    hasMore: hasMoreChapters
  } = useInfiniteChapters({
    chapters: chaptersOnly,
    batchSize: 6
  });

  // Calculate progress statistics
  const completedChapters = progressData?.filter(p => p.completed && chaptersOnly.some(c => c.content.id === p.lesson_id)).length || 0;
  const totalChapters = chaptersOnly.length;
  const chapterProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const completedLessons = progressData?.filter(p => p.completed && lessonsOnly.some(l => l.content.id === p.lesson_id)).length || 0;
  const totalLessons = lessonsOnly.length;
  const lessonProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find current/next content
  const nextChapter = chaptersOnly.find(item => !progressData?.some(p => p.lesson_id === item.content.id && p.completed));
  const nextWeek = weeks?.find(week => {
    // Find first week that's not fully completed
    // For now, just return the first week since we don't have modules data directly
    return true;
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
          <div className="text-center space-y-4">
            <GraduationCap className="w-12 h-12 text-primary animate-pulse mx-auto" />
            <p className="text-muted-foreground">Loading learning content...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ProtectedContent>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 bg-accent animate-pulse"></div>
                <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Learning Hub
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose your training path: Interactive slide experiences or structured weekly learning
              </p>
              
              {/* Quick Navigation Cards */}
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
                <Card 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-destructive/50"
                  onClick={() => navigate('/modules')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-destructive to-destructive/80 rounded-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-institutional uppercase">
                      Interactive Modules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Experience immersive slide-based indoctrination with TikTok-style vertical scrolling, interactive tasks, and progress tracking.
                    </p>
                    <Badge variant="destructive" className="font-institutional uppercase">
                      NEW SLIDE EXPERIENCE
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                  onClick={() => navigate('/learn')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-institutional uppercase">
                      Training Weeks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Follow structured weekly programs with modules, tasks, assignments, and review steps for comprehensive learning.
                    </p>
                    <Badge variant="secondary" className="font-institutional uppercase">
                      STRUCTURED LEARNING
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Learning Progress Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="institutional-card hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Training Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Weeks Completed</span>
                      <span className="text-primary font-medium">{weeks?.length || 0} available</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">Structured learning path</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="institutional-card hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Story Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Chapters Read</span>
                      <span className="text-accent font-medium">{completedChapters}/{totalChapters}</span>
                    </div>
                    <Progress value={chapterProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">Narrative experience</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="institutional-card hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="w-5 h-5 text-secondary" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Completion</span>
                      <span className="text-secondary font-medium">{Math.round(((completedChapters + completedLessons) / (totalChapters + totalLessons)) * 100) || 0}%</span>
                    </div>
                    <Progress value={Math.round(((completedChapters + completedLessons) / (totalChapters + totalLessons)) * 100) || 0} className="h-2" />
                    <p className="text-xs text-muted-foreground">All content combined</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {nextWeek && (
                <Card className="institutional-card border-primary bg-gradient-to-r from-card to-primary/5 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary animate-pulse" />
                      Continue Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="font-medium">{nextWeek.title}</p>
                      <p className="text-sm text-muted-foreground">{nextWeek.objective || 'Continue your training'}</p>
                      <button
                        onClick={() => navigate(`/learn/${nextWeek.id}`)}
                        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
                      >
                        Continue Week {nextWeek.week_number}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {nextChapter && (
                <Card className="institutional-card border-accent bg-gradient-to-r from-card to-accent/5 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent animate-pulse" />
                      Continue Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="font-medium">{nextChapter.content.title}</p>
                      <p className="text-sm text-muted-foreground">Next chapter in the story</p>
                      <button
                        onClick={() => navigate(`/chapter/${nextChapter.content.id}`)}
                        className="w-full bg-accent text-accent-foreground py-2 rounded-md hover:bg-accent/90 transition-colors font-medium"
                      >
                        Read Chapter
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Training Weeks
                </TabsTrigger>
                <TabsTrigger value="story" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Story Chapters
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Training Weeks */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Training</h3>
                    {weeks?.slice(0, 3).map((week) => (
                      <WeekCard
                        key={week.id}
                        week={week}
                        onClick={() => navigate(`/learn/${week.id}`)}
                        className="hover:border-primary/50"
                      />
                    ))}
                  </div>

                  {/* Recent Story Chapters */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Chapters</h3>
                    {visibleChapterItems.slice(0, 3).map((item, index) => (
                      <ContentCard
                        key={`${item.type}-${item.content.id}`}
                        item={item}
                        index={index}
                        isLocked={false}
                        isCompleted={progressData?.some(p => p.lesson_id === item.content.id && p.completed) || false}
                        progress={0}
                        onClick={() => navigate(`/chapter/${item.content.id}`)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="training" className="space-y-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {weeks?.map((week) => (
                    <WeekCard
                      key={week.id}
                      week={week}
                      onClick={() => navigate(`/learn/${week.id}`)}
                      className="hover:border-primary/50"
                    />
                  ))}
                </div>

                {!weeks?.length && (
                  <div className="text-center py-12">
                    <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Training Weeks Available</h3>
                    <p className="text-muted-foreground">
                      Training content will be available once it's been created by administrators.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="story" className="space-y-6 mt-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  {visibleChapterItems.map((item, index) => (
                    <ContentCard
                      key={`${item.type}-${item.content.id}`}
                      item={item}
                      index={index}
                      isLocked={false}
                      isCompleted={progressData?.some(p => p.lesson_id === item.content.id && p.completed) || false}
                      progress={0}
                      onClick={() => navigate(`/chapter/${item.content.id}`)}
                    />
                  ))}
                  
                  {isChaptersLoadingMore && (
        <div className="space-y-8">
          {/* Hero Section with Navigation */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-5xl font-institutional uppercase tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Learning Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your training path: Interactive slide experiences or structured weekly learning
            </p>
            
            {/* Quick Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-destructive/50"
                onClick={() => navigate('/modules')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-destructive to-destructive/80 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-institutional uppercase">
                    Interactive Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Experience immersive slide-based indoctrination with TikTok-style vertical scrolling, interactive tasks, and progress tracking.
                  </p>
                  <Badge variant="destructive" className="font-institutional uppercase">
                    NEW SLIDE EXPERIENCE
                  </Badge>
                </CardContent>
              </Card>
              
              <Card 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                onClick={() => navigate('/learn')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-institutional uppercase">
                    Training Weeks
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Follow structured weekly programs with modules, tasks, assignments, and review steps for comprehensive learning.
                  </p>
                  <Badge variant="secondary" className="font-institutional uppercase">
                    STRUCTURED LEARNING
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <ChapterSkeleton key={`skeleton-${index}`} />
                      ))}
                    </div>
                  )}
                </div>

                {hasMoreChapters && (
                  <div ref={chaptersLoadMoreRef} className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4 animate-pulse" />
                      <span className="text-sm font-mono">Loading more chapters...</span>
                    </div>
                  </div>
                )}

                {!hasMoreChapters && chaptersOnly.length > 0 && (
                  <div className="text-center py-12 border-t border-border">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="text-2xl font-institutional uppercase tracking-wide text-accent">
                        All Chapters Available
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        You have access to all narrative chapters in the collection.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Admin Content Manager FAB */}
          {isAdmin && <ContentManagerFAB />}
        </div>
      </ProtectedContent>
    </AppLayout>
  );
};

export default LearningHub;