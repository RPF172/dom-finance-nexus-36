import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  content_read: boolean;
  quiz_completed: boolean;
  quiz_score: number;
  assignment_submitted: boolean;
  ritual_completed: boolean;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProgress = (lessonId?: string) => {
  return useQuery({
    queryKey: ['user-progress', lessonId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      let query = supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return data as UserLessonProgress | null;
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as UserLessonProgress[];
    }
  });
};

export const useAllUserProgress = () => {
  return useQuery({
    queryKey: ['all-user-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserLessonProgress[];
    }
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progress: Partial<UserLessonProgress> & { lesson_id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: progress.lesson_id,
          content_read: progress.content_read ?? false,
          quiz_completed: progress.quiz_completed ?? false,
          quiz_score: progress.quiz_score ?? 0,
          assignment_submitted: progress.assignment_submitted ?? false,
          ritual_completed: progress.ritual_completed ?? false,
        }, {
          onConflict: 'user_id,lesson_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress', data.lesson_id] });
    }
  });
};