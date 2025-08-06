import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Submission {
  id: string;
  user_id: string;
  week_id: string;
  task_id?: string;
  assignment_id?: string;
  text_response?: string;
  media_url?: string;
  metadata?: any;
  submitted_at: string;
}

export interface StepProgress {
  id: string;
  user_id: string;
  review_step_id: string;
  completed: boolean;
  completed_at?: string;
}

// Hook to fetch user submissions for a week
export const useUserSubmissions = (weekId: string) => {
  return useQuery({
    queryKey: ['user-submissions', weekId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_id', weekId);
      
      if (error) throw error;
      return data as Submission[];
    }
  });
};

// Hook to fetch user step progress for a week
export const useUserStepProgress = (weekId: string) => {
  return useQuery({
    queryKey: ['user-step-progress', weekId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('step_progress')
        .select(`
          *,
          review_steps!inner(week_id)
        `)
        .eq('user_id', user.id)
        .eq('review_steps.week_id', weekId);
      
      if (error) throw error;
      return data as (StepProgress & { review_steps: { week_id: string } })[];
    }
  });
};

// Hook to create a submission
export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (submission: Omit<Submission, 'id' | 'submitted_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('submissions')
        .insert({
          ...submission,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-submissions', data.week_id] });
    }
  });
};

// Hook to update step progress
export const useUpdateStepProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reviewStepId, 
      completed, 
      weekId 
    }: { 
      reviewStepId: string; 
      completed: boolean; 
      weekId: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('step_progress')
        .upsert({
          user_id: user.id,
          review_step_id: reviewStepId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,review_step_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-step-progress', variables.weekId] });
    }
  });
};