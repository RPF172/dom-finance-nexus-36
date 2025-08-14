import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, CheckCircle, Clock, Target, 
  Users, MessageSquare, Trophy, Activity 
} from 'lucide-react';
import { SessionTracker } from '@/components/learning/SessionTracker';
import { StudyGroup } from '@/components/social/StudyGroup';
import { PeerDiscussion } from '@/components/social/PeerDiscussion';
import { OptimizedImage, useDebounce } from '@/components/learning/PerformanceOptimizer';
import { AccessibleHeading, useAccessibility } from '@/components/ui/enhanced-accessibility';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { WeekData } from '@/hooks/useWeeks';
import { WeekProgress } from '@/hooks/useWeekProgress';

// Updated interface to match existing structure
interface WeekContentTabsProps {
  weekData: WeekData;
  weekProgress?: WeekProgress | null;
}

interface WeekModule {
  id: string;
  title: string;
  content: string;
  order_index: number;
  completed?: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  completed?: boolean;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  requires_proof: boolean;
  deadline?: string;
  completed?: boolean;
}

interface ReviewStep {
  id: string;
  description: string;
  order_index: number;
  completed?: boolean;
}

export const WeekContentTabs: React.FC<WeekContentTabsProps> = ({ 
  weekData, 
  weekProgress
}) => {
  const [activeTab, setActiveTab] = useState('modules');
  const [modules, setModules] = useState<WeekModule[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reviewSteps, setReviewSteps] = useState<ReviewStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { announceToScreenReader } = useAccessibility();

  // Debounce tab changes for performance
  const debouncedActiveTab = useDebounce(activeTab, 100);

  // Keyboard navigation
  useKeyboardNavigation({
    onArrowLeft: () => {
      const tabs = ['modules', 'tasks', 'assignments', 'review', 'social', 'discussion'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    },
    onArrowRight: () => {
      const tabs = ['modules', 'tasks', 'assignments', 'review', 'social', 'discussion'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  });

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (weekData) {
      fetchWeekContent();
    }
  }, [weekData]);

  useEffect(() => {
    if (debouncedActiveTab !== activeTab) {
      announceToScreenReader(`Switched to ${activeTab} tab`);
    }
  }, [debouncedActiveTab, activeTab]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchWeekContent = async () => {
    try {
      setLoading(true);
      
      // Use the existing weekData structure
      setModules(weekData.modules || []);
      setTasks(weekData.tasks || []);
      setAssignments(weekData.assignments || []);
      setReviewSteps(weekData.review_steps || []);
      
    } catch (error) {
      console.error('Error fetching week content:', error);
      toast({
        title: "Error",
        description: "Failed to load week content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getCompletionStats = () => {
    const totalItems = modules.length + tasks.length + assignments.length + reviewSteps.length;
    const completedItems = weekProgress?.progress_percentage || 0;
    
    return { total: totalItems, completed: Math.round((completedItems / 100) * totalItems) };
  };

  const stats = getCompletionStats();
  const completionPercentage = weekProgress?.progress_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Session Tracker */}
      <SessionTracker weekId={weekData.id} />
      
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <AccessibleHeading level={3} className="text-lg">
                Week Progress
              </AccessibleHeading>
              <p className="text-sm text-muted-foreground">
                {stats.completed} of {stats.total} items completed
              </p>
            </div>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completionPercentage}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Modules</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Review</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="discussion" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussion</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4 mt-6">
          {modules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No modules available for this week.</p>
              </CardContent>
            </Card>
          ) : (
            modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: module.content }}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-6">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks available for this week.</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                {task.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{task.description}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-6">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assignments available for this week.</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{assignment.description}</p>
                  {assignment.deadline && (
                    <div className="flex items-center gap-2 text-sm text-warning">
                      <Clock className="h-4 w-4" />
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-4 mt-6">
          {reviewSteps.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No review steps available for this week.</p>
              </CardContent>
            </Card>
          ) : (
            reviewSteps.map((step) => (
              <Card key={step.id}>
                <CardContent className="pt-6">
                  <p className="text-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <StudyGroup weekId={weekData.id} currentUserId={currentUserId || undefined} />
        </TabsContent>

        <TabsContent value="discussion" className="mt-6">
          <PeerDiscussion
            contentType="week"
            contentId={weekData.id}
            contentTitle={weekData.title}
            currentUserId={currentUserId || undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};