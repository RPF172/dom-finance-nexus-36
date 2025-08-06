import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveModule = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('modules').insert({
      week_id: weekId,
      title: moduleTitle,
      content: moduleContent,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setModuleTitle('');
      setModuleContent('');
      onSaved && onSaved();
    }
  };

  const handleSaveTask = async () => {
    setLoading(true);
    setError(null);
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
      onSaved && onSaved();
    }
  };

  const handleSaveAssignment = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('assignments').insert({
      week_id: weekId,
      title: assignmentTitle,
      description: assignmentDescription,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setAssignmentTitle('');
      setAssignmentDescription('');
      onSaved && onSaved();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold mb-2">Add Module (Content Read)</h3>
        <input
          className="input mb-2 w-full"
          placeholder="Module Title"
          value={moduleTitle}
          onChange={e => setModuleTitle(e.target.value)}
        />
        <textarea
          className="input mb-2 w-full"
          placeholder="Module Content"
          value={moduleContent}
          onChange={e => setModuleContent(e.target.value)}
        />
        <Button onClick={handleSaveModule} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Module'}
        </Button>
      </div>
      <div>
        <h3 className="font-bold mb-2">Add Task</h3>
        <input
          className="input mb-2 w-full"
          placeholder="Task Title"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
        />
        <textarea
          className="input mb-2 w-full"
          placeholder="Task Description"
          value={taskDescription}
          onChange={e => setTaskDescription(e.target.value)}
        />
        <Button onClick={handleSaveTask} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Task'}
        </Button>
      </div>
      <div>
        <h3 className="font-bold mb-2">Add Assignment</h3>
        <input
          className="input mb-2 w-full"
          placeholder="Assignment Title"
          value={assignmentTitle}
          onChange={e => setAssignmentTitle(e.target.value)}
        />
        <textarea
          className="input mb-2 w-full"
          placeholder="Assignment Description"
          value={assignmentDescription}
          onChange={e => setAssignmentDescription(e.target.value)}
        />
        <Button onClick={handleSaveAssignment} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Assignment'}
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default WeekContentEditor;
