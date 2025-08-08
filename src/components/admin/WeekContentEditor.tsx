import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface WeekContentEditorProps {
  weekId: string;
  onSaved?: () => void;
}

const WeekContentEditor: React.FC<WeekContentEditorProps> = ({ weekId, onSaved }) => {
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleContent, setModuleContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentObjective, setAssignmentObjective] = useState('');
  const [assignmentInstructions, setAssignmentInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveModule = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await supabase.from('week_modules').insert({
      week_id: weekId,
      title: moduleTitle,
      content: moduleContent,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setModuleTitle('');
      setModuleContent('');
      setSuccess('Module added successfully!');
      onSaved && onSaved();
    }
  };

  const handleSaveTask = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await supabase.from('tasks').insert({
      week_id: weekId,
      title: taskTitle,
      description: taskDescription,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setTaskTitle('');
      setTaskDescription('');
      setSuccess('Task added successfully!');
      onSaved && onSaved();
    }
  };

  const handleSaveAssignment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // Get week info to determine week_number
      const { data: weekData, error: weekError } = await supabase
        .from('weeks')
        .select('week_number')
        .eq('id', weekId)
        .single();
      
      if (weekError) {
        setError('Failed to get week information: ' + weekError.message);
        setLoading(false);
        return;
      }

      // Insert assignment
      const { error } = await supabase.from('assignments').insert({
        title: assignmentTitle,
        description: assignmentDescription,
        objective: assignmentObjective,
        instructions: assignmentInstructions,
        week_id: weekId,
        week_number: weekData.week_number,
        module_number: 1, // Default module number
        user_id: user.id, // Current user as creator
        status: 'pending',
      });
      
      if (error) {
        setError(error.message);
      } else {
        setAssignmentTitle('');
        setAssignmentDescription('');
        setAssignmentObjective('');
        setAssignmentInstructions('');
        setSuccess('Assignment created successfully!');
        onSaved && onSaved();
      }
    } catch (err) {
      setError('Unexpected error occurred');
    }
    
    setLoading(false);
  };


  return (
    <div className="bg-muted/30 p-6 rounded-lg border space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-2">Admin Content Editor</h2>
        <p className="text-sm text-muted-foreground">Add content to this week</p>
      </div>
      
      {/* Module Section */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📖 Add Training Module
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Module Title"
            value={moduleTitle}
            onChange={e => setModuleTitle(e.target.value)}
          />
          <Textarea
            placeholder="Module Content"
            value={moduleContent}
            onChange={e => setModuleContent(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={handleSaveModule} 
            disabled={loading || !moduleTitle || !moduleContent} 
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save Module'}
          </Button>
        </div>
      </div>

      {/* Task Section */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          ✅ Add Task
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Task Title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
          />
          <Textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={e => setTaskDescription(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={handleSaveTask} 
            disabled={loading || !taskTitle} 
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </div>

      {/* Assignment Section */}
      <div className="bg-card p-4 rounded-lg border border-accent">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📋 Add Assignment
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Assignment Title"
            value={assignmentTitle}
            onChange={e => setAssignmentTitle(e.target.value)}
          />
          <Textarea
            placeholder="Brief Description"
            value={assignmentDescription}
            onChange={e => setAssignmentDescription(e.target.value)}
            rows={2}
          />
          <Textarea
            placeholder="Learning Objective"
            value={assignmentObjective}
            onChange={e => setAssignmentObjective(e.target.value)}
            rows={2}
          />
          <Textarea
            placeholder="Detailed Instructions for Students"
            value={assignmentInstructions}
            onChange={e => setAssignmentInstructions(e.target.value)}
            rows={4}
          />
          <Button 
            onClick={handleSaveAssignment} 
            disabled={loading || !assignmentTitle || !assignmentDescription || !assignmentObjective || !assignmentInstructions} 
            className="w-full"
            variant="secondary"
          >
            {loading ? 'Creating Assignment...' : 'Create Assignment'}
          </Button>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 text-sm p-3 rounded-lg">
          <strong>Success:</strong> {success}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default WeekContentEditor;
