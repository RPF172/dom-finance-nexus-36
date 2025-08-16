import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFinalizeModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('finalize_module_completion', {
        _user_id: user.user.id,
        _module_id: moduleId,
      });

      if (error) throw error;
      return data as number; // Points awarded
    },
    onSuccess: (pointsAwarded, moduleId) => {
      queryClient.invalidateQueries({ queryKey: ['obedience-summary'] });
      queryClient.invalidateQueries({ queryKey: ['slide-progress', moduleId] });
      
      if (pointsAwarded > 0) {
        toast({
          title: "Module Completed!",
          description: `You earned ${pointsAwarded} Obedience Points for completing this indoctrination.`,
        });
      } else {
        toast({
          title: "Module Already Completed",
          description: "You have already completed this module.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Completion Failed",
        description: "Failed to finalize module completion. Please try again.",
        variant: "destructive",
      });
    },
  });
};