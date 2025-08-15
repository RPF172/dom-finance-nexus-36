import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, BookOpen, Target, Trophy, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComprehensiveWeekCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface Module {
  title: string;
  content: string;
}

interface Task {
  title: string;
  description: string;
}

interface Assignment {
  title: string;
  description: string;
  objective: string;
  instructions: string;
}

interface ReviewStep {
  description: string;
}

const ComprehensiveWeekCreatorModal: React.FC<ComprehensiveWeekCreatorModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreated 
}) => {
  const { toast } = useToast();
  
  // Week basic info
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(7);
  const [pointsReward, setPointsReward] = useState<number>(100);
  const [difficulty, setDifficulty] = useState('beginner');
  
  // Content arrays
  const [modules, setModules] = useState<Module[]>([{ title: '', content: '' }]);
  const [tasks, setTasks] = useState<Task[]>([{ title: '', description: '' }]);
  const [assignments, setAssignments] = useState<Assignment[]>([{ 
    title: '', 
    description: '', 
    objective: '', 
    instructions: '' 
  }]);
  const [reviewSteps, setReviewSteps] = useState<ReviewStep[]>([{ description: '' }]);
  
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');

  const resetForm = () => {
    setWeekNumber(1);
    setTitle('');
    setDescription('');
    setObjective('');
    setPrerequisites('');
    setEstimatedDuration(7);
    setPointsReward(100);
    setDifficulty('beginner');
    setModules([{ title: '', content: '' }]);
    setTasks([{ title: '', description: '' }]);
    setAssignments([{ title: '', description: '', objective: '', instructions: '' }]);
    setReviewSteps([{ description: '' }]);
    setCurrentTab('basic');
  };

  const addModule = () => setModules([...modules, { title: '', content: '' }]);
  const removeModule = (index: number) => setModules(modules.filter((_, i) => i !== index));
  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const addTask = () => setTasks([...tasks, { title: '', description: '' }]);
  const removeTask = (index: number) => setTasks(tasks.filter((_, i) => i !== index));
  const updateTask = (index: number, field: keyof Task, value: string) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  const addAssignment = () => setAssignments([...assignments, { 
    title: '', 
    description: '', 
    objective: '', 
    instructions: '' 
  }]);
  const removeAssignment = (index: number) => setAssignments(assignments.filter((_, i) => i !== index));
  const updateAssignment = (index: number, field: keyof Assignment, value: string) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const addReviewStep = () => setReviewSteps([...reviewSteps, { description: '' }]);
  const removeReviewStep = (index: number) => setReviewSteps(reviewSteps.filter((_, i) => i !== index));
  const updateReviewStep = (index: number, value: string) => {
    const updated = [...reviewSteps];
    updated[index].description = value;
    setReviewSteps(updated);
  };

  const handleCreate = async () => {
    setLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the week
      const { data: weekData, error: weekError } = await supabase
        .from('weeks')
        .insert({
          week_number: weekNumber,
          title,
          description,
          objective,
          prerequisites: prerequisites ? JSON.parse(`[${prerequisites}]`) : null,
          estimated_duration: estimatedDuration,
          points_reward: pointsReward,
          difficulty,
          total_modules: modules.filter(m => m.title && m.content).length,
          total_tasks: tasks.filter(t => t.title).length,
          total_assignments: assignments.filter(a => a.title && a.description && a.objective && a.instructions).length
        })
        .select()
        .single();

      if (weekError) throw weekError;

      // Create modules
      const validModules = modules.filter(m => m.title && m.content);
      if (validModules.length > 0) {
        const moduleInserts = validModules.map((module, index) => ({
          week_id: weekData.id,
          title: module.title,
          content: module.content,
          order_index: index
        }));
        
        const { error: moduleError } = await supabase
          .from('week_modules')
          .insert(moduleInserts);
        
        if (moduleError) throw moduleError;
      }

      // Create tasks
      const validTasks = tasks.filter(t => t.title);
      if (validTasks.length > 0) {
        const taskInserts = validTasks.map((task, index) => ({
          week_id: weekData.id,
          title: task.title,
          description: task.description || null,
          order_index: index
        }));
        
        const { error: taskError } = await supabase
          .from('tasks')
          .insert(taskInserts);
        
        if (taskError) throw taskError;
      }

      // Create assignments
      const validAssignments = assignments.filter(a => a.title && a.description && a.objective && a.instructions);
      if (validAssignments.length > 0) {
        const assignmentInserts = validAssignments.map((assignment) => ({
          title: assignment.title,
          description: assignment.description,
          objective: assignment.objective,
          instructions: assignment.instructions,
          week_id: weekData.id,
          week_number: weekNumber,
          module_number: 1,
          user_id: user.id,
          status: 'pending'
        }));
        
        const { error: assignmentError } = await supabase
          .from('assignments')
          .insert(assignmentInserts);
        
        if (assignmentError) throw assignmentError;
      }

      // Create review steps
      const validReviewSteps = reviewSteps.filter(r => r.description);
      if (validReviewSteps.length > 0) {
        const reviewInserts = validReviewSteps.map((step, index) => ({
          week_id: weekData.id,
          description: step.description,
          order_index: index
        }));
        
        const { error: reviewError } = await supabase
          .from('review_steps')
          .insert(reviewInserts);
        
        if (reviewError) throw reviewError;
      }

      toast({
        title: "Week Created Successfully",
        description: `Week ${weekNumber}: ${title} has been created with all content.`,
      });

      resetForm();
      onCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error Creating Week",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = (tabName: string) => {
    switch (tabName) {
      case 'modules':
        return title && description;
      case 'tasks': 
        return title && description;
      case 'assignments':
        return title && description;
      case 'review':
        return title && description;
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Week</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="modules" disabled={!canProceed('modules')}>
              <BookOpen className="h-4 w-4 mr-1" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="tasks" disabled={!canProceed('tasks')}>
              <Target className="h-4 w-4 mr-1" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="assignments" disabled={!canProceed('assignments')}>
              <Trophy className="h-4 w-4 mr-1" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!canProceed('review')}>
              <Clock className="h-4 w-4 mr-1" />
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Week Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Week Number</label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={weekNumber} 
                      onChange={e => setWeekNumber(Number(e.target.value))} 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Difficulty</label>
                    <select 
                      value={difficulty} 
                      onChange={e => setDifficulty(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Title</label>
                  <Input 
                    placeholder="Week title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <Textarea 
                    placeholder="Week description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Learning Objective</label>
                  <Textarea 
                    placeholder="What will students learn?" 
                    value={objective} 
                    onChange={e => setObjective(e.target.value)} 
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Duration (days)</label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={estimatedDuration} 
                      onChange={e => setEstimatedDuration(Number(e.target.value))} 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Points Reward</label>
                    <Input 
                      type="number" 
                      min={0} 
                      value={pointsReward} 
                      onChange={e => setPointsReward(Number(e.target.value))} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Prerequisites (comma-separated week IDs)</label>
                  <Input 
                    placeholder="e.g., uuid1, uuid2" 
                    value={prerequisites} 
                    onChange={e => setPrerequisites(e.target.value)} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Training Modules</h3>
              <Button onClick={addModule} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Module
              </Button>
            </div>
            
            {modules.map((module, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Module {index + 1}</CardTitle>
                  {modules.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeModule(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Module title"
                    value={module.title}
                    onChange={e => updateModule(index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Module content"
                    value={module.content}
                    onChange={e => updateModule(index, 'content', e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Button onClick={addTask} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
            
            {tasks.map((task, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Task {index + 1}</CardTitle>
                  {tasks.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeTask(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Task title"
                    value={task.title}
                    onChange={e => updateTask(index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Task description"
                    value={task.description}
                    onChange={e => updateTask(index, 'description', e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assignments</h3>
              <Button onClick={addAssignment} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Assignment
              </Button>
            </div>
            
            {assignments.map((assignment, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Assignment {index + 1}</CardTitle>
                  {assignments.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeAssignment(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Assignment title"
                    value={assignment.title}
                    onChange={e => updateAssignment(index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Brief description"
                    value={assignment.description}
                    onChange={e => updateAssignment(index, 'description', e.target.value)}
                    rows={2}
                  />
                  <Textarea
                    placeholder="Learning objective"
                    value={assignment.objective}
                    onChange={e => updateAssignment(index, 'objective', e.target.value)}
                    rows={2}
                  />
                  <Textarea
                    placeholder="Detailed instructions"
                    value={assignment.instructions}
                    onChange={e => updateAssignment(index, 'instructions', e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Review Steps</h3>
              <Button onClick={addReviewStep} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            
            {reviewSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Review Step {index + 1}</CardTitle>
                  {reviewSteps.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeReviewStep(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Review step description"
                    value={step.description}
                    onChange={e => updateReviewStep(index, e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {currentTab !== 'basic' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  const tabs = ['basic', 'modules', 'tasks', 'assignments', 'review'];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex > 0) setCurrentTab(tabs[currentIndex - 1]);
                }}
              >
                Previous
              </Button>
            )}
            {currentTab !== 'review' ? (
              <Button 
                onClick={() => {
                  const tabs = ['basic', 'modules', 'tasks', 'assignments', 'review'];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex < tabs.length - 1) setCurrentTab(tabs[currentIndex + 1]);
                }}
                disabled={!canProceed(currentTab)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={loading || !title || !description}>
                {loading ? 'Creating...' : 'Create Week'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveWeekCreatorModal;