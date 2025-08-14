import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Week {
  id: string;
  week_number: number;
  title: string;
  objective?: string;
  description?: string;
  total_modules: number;
  total_tasks: number;
  total_assignments: number;
  prerequisites: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration: number; // in minutes
  points_reward: number;
  created_at: string;
  updated_at: string;
}

export interface WeekModule {
  id: string;
  week_id: string;
  title: string;
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  week_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStep {
  id: string;
  week_id: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WeekData extends Week {
  modules: WeekModule[];
  tasks: Task[];
  assignments: any[];
  review_steps: ReviewStep[];
}

// Hook to fetch all weeks
export const useWeeks = () => {
  return useQuery({
    queryKey: ['weeks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weeks')
        .select('*')
        .order('week_number');
      
      if (error) throw error;
      return data as Week[];
    }
  });
};

// Hook to fetch a specific week with all its content
export const useWeekData = (weekId: string) => {
  return useQuery({
    queryKey: ['week-data', weekId],
    queryFn: async () => {
      // Fetch week info
      const { data: week, error: weekError } = await supabase
        .from('weeks')
        .select('*')
        .eq('id', weekId)
        .single();
      
      if (weekError) throw weekError;

      // Fetch modules
      const { data: modules, error: modulesError } = await supabase
        .from('week_modules')
        .select('*')
        .eq('week_id', weekId)
        .order('order_index');
      
      if (modulesError) throw modulesError;

      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('week_id', weekId)
        .order('order_index');
      
      if (tasksError) throw tasksError;

      // Fetch assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('week_id', weekId);
      
      if (assignmentsError) throw assignmentsError;

      // Fetch review steps
      const { data: reviewSteps, error: reviewError } = await supabase
        .from('review_steps')
        .select('*')
        .eq('week_id', weekId)
        .order('order_index');
      
      if (reviewError) throw reviewError;

      return {
        ...week,
        modules: modules || [],
        tasks: tasks || [],
        assignments: assignments || [],
        review_steps: reviewSteps || []
      } as WeekData;
    },
    enabled: !!weekId
  });
};

// Hook to create a new week
export const useCreateWeek = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (weekData: Omit<Week, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('weeks')
        .insert(weekData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeks'] });
    }
  });
};