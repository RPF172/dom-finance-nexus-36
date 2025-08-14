import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WeekProgress {
  id: string;
  user_id: string;
  week_id: string;
  progress_percentage: number;
  current_step?: string;
  started_at: string;
  completed_at?: string;
  last_activity_at: string;
  modules_completed: number;
  tasks_completed: number;
  assignments_completed: number;
  review_steps_completed: number;
  created_at: string;
  updated_at: string;
}

// Hook to get progress for a specific week
export const useWeekProgress = (weekId: string) => {
  return useQuery({
    queryKey: ['week-progress', weekId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('week_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_id', weekId)
        .maybeSingle();

      if (error) throw error;
      return data as WeekProgress | null;
    },
    enabled: !!weekId
  });
};

// Hook to get progress for all weeks for current user
export const useAllWeekProgress = () => {
  return useQuery({
    queryKey: ['all-week-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('week_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity_at', { ascending: false });

      if (error) throw error;
      return data as WeekProgress[];
    }
  });
};

// Hook to update week progress (triggers automatic calculation)
export const useUpdateWeekProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weekId, currentStep }: { weekId: string; currentStep?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Call the database function to update progress
      const { error } = await supabase.rpc('update_week_progress', {
        _user_id: user.id,
        _week_id: weekId
      });

      if (error) throw error;

      // Update current step if provided
      if (currentStep) {
        const { error: updateError } = await supabase
          .from('week_progress')
          .upsert({
            user_id: user.id,
            week_id: weekId,
            current_step: currentStep,
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (updateError) throw updateError;
      }

      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['week-progress', variables.weekId] });
      queryClient.invalidateQueries({ queryKey: ['all-week-progress'] });
    }
  });
};

// Hook to check if week prerequisites are met
export const useWeekPrerequisites = (weekId: string) => {
  return useQuery({
    queryKey: ['week-prerequisites', weekId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('check_week_prerequisites', {
        _user_id: user.id,
        _week_id: weekId
      });

      if (error) throw error;
      return data as boolean;
    },
    enabled: !!weekId
  });
};

// Hook to get week progress statistics for dashboard
export const useWeekProgressStats = () => {
  return useQuery({
    queryKey: ['week-progress-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: progress, error } = await supabase
        .from('week_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const stats = {
        totalWeeks: progress.length,
        completedWeeks: progress.filter(p => p.progress_percentage === 100).length,
        inProgressWeeks: progress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length,
        averageProgress: progress.length > 0 
          ? Math.round(progress.reduce((sum, p) => sum + p.progress_percentage, 0) / progress.length)
          : 0,
        totalModulesCompleted: progress.reduce((sum, p) => sum + p.modules_completed, 0),
        totalTasksCompleted: progress.reduce((sum, p) => sum + p.tasks_completed, 0),
        totalAssignmentsCompleted: progress.reduce((sum, p) => sum + p.assignments_completed, 0),
        recentActivity: progress
          .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
          .slice(0, 5)
      };

      return stats;
    }
  });
};