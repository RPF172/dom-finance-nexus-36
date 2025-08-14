import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileOptimizedTabs, MobileTabsList, MobileTabsTrigger, MobileTabsContent } from '@/components/ui/mobile-optimized-tabs';
import { SessionTracker } from '@/components/learning/SessionTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckSquare, FileText, RotateCcw, Upload, CheckCircle } from 'lucide-react';
import { WeekData, useWeeks } from '@/hooks/useWeeks';
import { WeekProgress, useUpdateWeekProgress } from '@/hooks/useWeekProgress';
import { useUserSubmissions, useUserStepProgress, useCreateSubmission, useUpdateStepProgress } from '@/hooks/useSubmissions';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useModuleProgress, useToggleModuleProgress } from '@/hooks/useModuleProgress';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface WeekContentTabsProps {
  weekData: WeekData;
  weekProgress?: WeekProgress | null;
}

export const WeekContentTabs: React.FC<WeekContentTabsProps> = ({ weekData, weekProgress }) => {
  const [activeTab, setActiveTab] = useState('content');
  const { data: submissions = [] } = useUserSubmissions(weekData.id);
  const { data: stepProgress = [] } = useUserStepProgress(weekData.id);
  const createSubmission = useCreateSubmission();
  const updateStepProgress = useUpdateStepProgress();
  const updateWeekProgress = useUpdateWeekProgress();
  const { uploadImage, uploading } = useImageUpload();

  const [taskResponses, setTaskResponses] = useState<Record<string, string>>({});
  const [assignmentResponses, setAssignmentResponses] = useState<Record<string, string>>({});
  const [taskFiles, setTaskFiles] = useState<Record<string, File | null>>({});
  const [assignmentFiles, setAssignmentFiles] = useState<Record<string, File | null>>({});

  const moduleIds = weekData.modules.map((m) => m.id);
  const { data: moduleProgress = [] } = useModuleProgress(moduleIds);
  const toggleModuleProgress = useToggleModuleProgress();
  const { data: weeks = [] } = useWeeks();
  const navigate = useNavigate();

  const isModuleCompleted = (moduleId: string) =>
    moduleProgress.some((p) => p.week_module_id === moduleId && p.completed);


  const handleTaskSubmission = async (taskId: string) => {
    const textResponse = taskResponses[taskId];
    const file = taskFiles[taskId] || null;
    if (!textResponse?.trim() && !file) {
      toast.error('Add a response or attach a file before submitting');
      return;
    }

    try {
      let mediaUrl: string | undefined;
      if (file) {
        mediaUrl = await uploadImage(file, 'avatars') || undefined;
      }

      await createSubmission.mutateAsync({
        week_id: weekData.id,
        task_id: taskId,
        text_response: textResponse?.trim() ? textResponse : undefined,
        media_url: mediaUrl
      });
      
      // Update week progress after task submission
      updateWeekProgress.mutate({ weekId: weekData.id });
      
      setTaskResponses(prev => ({ ...prev, [taskId]: '' }));
      setTaskFiles(prev => ({ ...prev, [taskId]: null }));
      toast.success('Task submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit task');
    }
  };

  const handleAssignmentSubmission = async (assignmentId: string) => {
    const textResponse = assignmentResponses[assignmentId];
    const file = assignmentFiles[assignmentId] || null;
    if (!textResponse?.trim() && !file) {
      toast.error('Add a response or attach a file before submitting');
      return;
    }

    try {
      let mediaUrl: string | undefined;
      if (file) {
        mediaUrl = await uploadImage(file, 'avatars') || undefined;
      }

      await createSubmission.mutateAsync({
        week_id: weekData.id,
        assignment_id: assignmentId,
        text_response: textResponse?.trim() ? textResponse : undefined,
        media_url: mediaUrl
      });
      
      // Update week progress after assignment submission
      updateWeekProgress.mutate({ weekId: weekData.id });
      
      setAssignmentResponses(prev => ({ ...prev, [assignmentId]: '' }));
      setAssignmentFiles(prev => ({ ...prev, [assignmentId]: null }));
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit assignment');
    }
  };

  const handleStepToggle = async (stepId: string, completed: boolean) => {
    try {
      await updateStepProgress.mutateAsync({
        reviewStepId: stepId,
        completed,
        weekId: weekData.id
      });
      
      // Update week progress after step completion
      updateWeekProgress.mutate({ weekId: weekData.id });
      
      toast.success(completed ? 'Step marked as complete!' : 'Step marked as incomplete');
    } catch (error) {
      toast.error('Failed to update step progress');
    }
  };

  const isTaskSubmitted = (taskId: string) => 
    submissions.some(s => s.task_id === taskId);
  
  const isAssignmentSubmitted = (assignmentId: string) => 
    submissions.some(s => s.assignment_id === assignmentId);

  const isStepCompleted = (stepId: string) => 
    stepProgress.some(p => p.review_step_id === stepId && p.completed);

  const allModulesCompleted = weekData.modules.every(m => isModuleCompleted(m.id));
  const allTasksSubmitted = weekData.tasks.every(t => isTaskSubmitted(t.id));
  const allAssignmentsSubmitted = weekData.assignments.every(a => isAssignmentSubmitted(a.id));
  const allReviewStepsCompleted = weekData.review_steps.every(s => isStepCompleted(s.id));
  const allComplete = allModulesCompleted && allTasksSubmitted && allAssignmentsSubmitted && allReviewStepsCompleted;
  const nextWeek = weeks.find(w => w.week_number === weekData.week_number + 1);
  const nextWeekId = nextWeek?.id;

  return (
    <div className="space-y-6">
      {/* Session Tracker */}
      <SessionTracker 
        weekId={weekData.id}
        onActivityComplete={() => {
          // Will be called when user completes activities
        }}
      />

      {/* Mobile-optimized tabs */}
      <MobileOptimizedTabs value={activeTab} onValueChange={setActiveTab}>
        <MobileTabsList>
          <MobileTabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Content Read</span>
            <span className="sm:hidden">Content</span>
          </MobileTabsTrigger>
          <MobileTabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </MobileTabsTrigger>
          <MobileTabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Assignments</span>
            <span className="sm:hidden">Assign</span>
          </MobileTabsTrigger>
          <MobileTabsTrigger value="review" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Review</span>
          </MobileTabsTrigger>
        </MobileTabsList>

        <MobileTabsContent value="content" className="space-y-4">
          <div className="space-y-4">
            {weekData.modules.map((module, index) => {
              const completed = isModuleCompleted(module.id);
              return (
                <Card key={module.id} className={`relative ${completed ? 'border-success ring-1 ring-success/40' : ''}`}>
                  {completed && (
                    <div className="absolute -top-2 -left-2 bg-background rounded-full p-1 border border-success">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Module {index + 1}</Badge>
                        {module.title}
                      </div>
                      <div>
                        <Button
                          variant={completed ? 'secondary' : 'default'}
                          disabled={completed || toggleModuleProgress.isPending}
                          onClick={async () => {
                            await toggleModuleProgress.mutateAsync({ weekModuleId: module.id, completed: true });
                            // Update week progress after module completion
                            updateWeekProgress.mutate({ weekId: weekData.id });
                          }}
                        >
                          {completed ? 'Completed' : 'Mark as complete'}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-foreground">
                      {module.content.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </MobileTabsContent>

        <MobileTabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {weekData.tasks.map((task, index) => {
              const submitted = isTaskSubmitted(task.id);
              return (
                <Card key={task.id} className={`relative ${submitted ? 'border-success ring-1 ring-success/40' : ''}`}>
                  {submitted && (
                    <div className="absolute -top-2 -left-2 bg-background rounded-full p-1 border border-success">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Task {index + 1}</Badge>
                        {task.title}
                      </div>
                      {submitted && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Submitted
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {task.description && (
                      <p className="text-muted-foreground">{task.description}</p>
                    )}
                    {!submitted && (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Your response..."
                          value={taskResponses[task.id] || ''}
                          onChange={(e) => setTaskResponses(prev => ({
                            ...prev,
                            [task.id]: e.target.value
                          }))}
                          className="min-h-[100px]"
                        />
                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setTaskFiles(prev => ({ ...prev, [task.id]: file }));
                            }}
                          />
                          {taskFiles[task.id] && (
                            <span className="text-sm text-muted-foreground truncate">
                              {taskFiles[task.id]?.name}
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleTaskSubmission(task.id)}
                          disabled={createSubmission.isPending || uploading || (!taskResponses[task.id]?.trim() && !taskFiles[task.id])}
                          className="w-full"
                        >
                          Submit Task
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </MobileTabsContent>

        <MobileTabsContent value="assignments" className="space-y-4">
          <div className="space-y-4">
            {weekData.assignments.map((assignment, index) => {
              const submitted = isAssignmentSubmitted(assignment.id);
              return (
                <Card key={assignment.id} className={`relative ${submitted ? 'border-success ring-1 ring-success/40' : ''}`}>
                  {submitted && (
                    <div className="absolute -top-2 -left-2 bg-background rounded-full p-1 border border-success">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Assignment {index + 1}</Badge>
                        {assignment.title}
                      </div>
                      {submitted && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Submitted
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {assignment.description && (
                      <p className="text-muted-foreground">{assignment.description}</p>
                    )}
                    {!submitted && (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Your assignment response..."
                          value={assignmentResponses[assignment.id] || ''}
                          onChange={(e) => setAssignmentResponses(prev => ({
                            ...prev,
                            [assignment.id]: e.target.value
                          }))}
                          className="min-h-[150px]"
                        />
                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setAssignmentFiles(prev => ({ ...prev, [assignment.id]: file }));
                            }}
                          />
                          {assignmentFiles[assignment.id] && (
                            <span className="text-sm text-muted-foreground truncate">
                              {assignmentFiles[assignment.id]?.name}
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleAssignmentSubmission(assignment.id)}
                          disabled={createSubmission.isPending || uploading || (!assignmentResponses[assignment.id]?.trim() && !assignmentFiles[assignment.id])}
                          className="w-full"
                        >
                          Submit Assignment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </MobileTabsContent>

        <MobileTabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Week {weekData.week_number} Review Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekData.review_steps.map((step) => {
                  const completed = isStepCompleted(step.id);
                  return (
                    <div
                      key={step.id}
                      className={`relative flex items-center gap-3 rounded-md border p-3 ${completed ? 'border-success' : 'border-border'}`}
                    >
                      {completed && (
                        <div className="absolute -top-2 -left-2 bg-background rounded-full p-0.5 border border-success">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                      )}
                      <Checkbox
                        checked={completed}
                        onCheckedChange={(checked) => 
                          handleStepToggle(step.id, checked as boolean)
                        }
                        disabled={updateStepProgress.isPending}
                      />
                      <span className={`flex-1 ${completed ? 'line-through text-muted-foreground' : ''}`}>
                        {step.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>
      </MobileOptimizedTabs>

      {allComplete && nextWeekId && (
        <div className="mt-8 p-6 bg-success/10 border border-success/20 rounded-lg">
          <div className="text-center space-y-3">
            <CheckCircle className="h-8 w-8 text-success mx-auto" />
            <h3 className="text-lg font-semibold text-success">Week Completed!</h3>
            <p className="text-muted-foreground">
              Congratulations! You've completed all activities for Week {weekData.week_number}.
            </p>
            <Button 
              className="w-full max-w-sm" 
              onClick={() => navigate(`/weeks/${nextWeekId}`)}
            >
              Proceed to Week {weekData.week_number + 1}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};