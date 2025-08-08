import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeekData } from '@/hooks/useWeeks';
import AppLayout from '@/components/layout/AppLayout';
import { Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WeekContentEditor from '@/components/admin/WeekContentEditor';


const WeekView: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  
  const { data: week, isLoading } = useWeekData(weekId!);
  
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        setIsAdmin(!!userRole);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground mt-4">Loading week...</p>
        </div>
      </AppLayout>
    );
  }

  if (!week) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Week not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-xs text-muted-foreground mb-2">WEEK {week.week_number}</div>
          <h1 className="text-3xl font-bold mb-2">{week.title}</h1>
          <p className="text-muted-foreground mb-4">{week.objective}</p>
        </div>

        {/* Admin Content Editor */}
        {isAdmin && (
          <div className="mb-8">
            <WeekContentEditor weekId={week.id} onSaved={() => window.location.reload()} />
          </div>
        )}

        {/* Combined Ordered Content */}
        <div className="rounded-lg border bg-card p-6">
          {(() => {
            const tasks = [...(week.tasks || [])].sort((a,b) => (a.order_index ?? 0) - (b.order_index ?? 0));
            const modules = [...(week.modules || [])].sort((a,b) => (a.order_index ?? 0) - (b.order_index ?? 0));
            const assignment = (week.assignments || [])[0];
            const seqTypes = ['task','module','task','module','task','assignment','task'] as const;
            let ti = 0, mi = 0;
            const out: Array<{ type: 'task' | 'module' | 'assignment'; item: any }> = [];
            for (const type of seqTypes) {
              if (type === 'task' && ti < tasks.length) out.push({ type, item: tasks[ti++] });
              else if (type === 'module' && mi < modules.length) out.push({ type, item: modules[mi++] });
              else if (type === 'assignment' && assignment) out.push({ type, item: assignment });
            }
            while (ti < tasks.length || mi < modules.length) {
              if (ti < tasks.length) out.push({ type: 'task', item: tasks[ti++] });
              if (mi < modules.length) out.push({ type: 'module', item: modules[mi++] });
            }
            let taskCount = 0, moduleCount = 0, assignmentCount = 0;
            return (
              <div className="space-y-4">
                <div className="text-xs uppercase text-muted-foreground">Week {week.week_number}</div>
                {out.map((entry, idx) => {
                  if (entry.type === 'task') {
                    taskCount += 1;
                    return (
                      <div key={`task-${entry.item.id}`} className="rounded-md border border-border/60 bg-background p-4">
                        <div className="text-sm font-semibold mb-1">Task {taskCount}: {entry.item.title}</div>
                        {entry.item.description && (
                          <p className="text-sm text-muted-foreground">{entry.item.description}</p>
                        )}
                      </div>
                    );
                  }
                  if (entry.type === 'module') {
                    moduleCount += 1;
                    return (
                      <div key={`module-${entry.item.id}`} className="rounded-md border border-border/60 bg-background p-4">
                        <div className="text-sm font-semibold mb-1">Training Module {moduleCount}: {entry.item.title}</div>
                        {entry.item.content && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.item.content}</p>
                        )}
                      </div>
                    );
                  }
                  assignmentCount += 1;
                  return (
                    <div key={`assignment-${entry.item.id || idx}`} className="rounded-md border border-accent/60 bg-accent/10 p-4">
                      <div className="text-sm font-semibold mb-1">Assignment {assignmentCount}: {entry.item.title || 'Assignment'}</div>
                      {entry.item.description && (
                        <p className="text-sm text-muted-foreground">{entry.item.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </AppLayout>
  );
};

export default WeekView;
