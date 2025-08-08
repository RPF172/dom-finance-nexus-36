import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleProgressRow {
  id: string;
  user_id: string;
  week_module_id: string;
  completed: boolean;
  completed_at?: string | null;
}

// Fetch completion state for a list of week module IDs for the current user
export const useModuleProgress = (moduleIds: string[]) => {
  return useQuery({
    queryKey: ['module-progress', moduleIds.sort().join(',')],
    enabled: Array.isArray(moduleIds) && moduleIds.length > 0,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || moduleIds.length === 0) return [] as ModuleProgressRow[];

      const { data, error } = await supabase
        .from('module_progress')
        .select('*')
        .in('week_module_id', moduleIds);

      if (error) throw error;
      return (data || []) as ModuleProgressRow[];
    }
  });
};

// Upsert completion for a specific week module for the current user
export const useToggleModuleProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weekModuleId, completed }: { weekModuleId: string; completed?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('module_progress')
        .upsert({
          user_id: user.id,
          week_module_id: weekModuleId,
          completed: completed ?? true,
          completed_at: (completed ?? true) ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,week_module_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data as ModuleProgressRow;
    },
    onSuccess: (_data, variables) => {
      // Invalidate any module-progress queries regardless of list composition
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      // Also refresh submissions in case UI depends on them
      // No specific weekId here; WeekContentTabs will have its own keys
    }
  });
};
