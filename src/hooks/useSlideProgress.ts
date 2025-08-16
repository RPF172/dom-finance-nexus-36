import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SlideProgress {
  id: string;
  user_id: string;
  module_id: string;
  slide_id: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export const useSlideProgress = (moduleId: string) => {
  return useQuery({
    queryKey: ['slide-progress', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slide_progress')
        .select('*')
        .eq('module_id', moduleId);

      if (error) throw error;
      return data as SlideProgress[];
    },
    enabled: !!moduleId,
  });
};

export const useCompleteSlide = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ moduleId, slideId }: { moduleId: string; slideId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('slide_progress')
        .upsert({
          user_id: user.user.id,
          module_id: moduleId,
          slide_id: slideId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,slide_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: ['slide-progress', moduleId] });
      // Silent progress saving - no toast to avoid interrupting the experience
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });
};