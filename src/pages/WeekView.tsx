import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeekData } from '@/hooks/useWeeks';
import AppLayout from '@/components/layout/AppLayout';
import { Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WeekContentEditor from '@/components/admin/WeekContentEditor';
import { WeekContentTabs } from '@/components/WeekContentTabs';

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

        {/* Week interactive content */}
        <div className="rounded-lg border bg-card p-6">
          <WeekContentTabs weekData={week} />
        </div>
      </div>
    </AppLayout>
  );
};

export default WeekView;
