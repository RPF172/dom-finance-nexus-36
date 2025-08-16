import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WeekModuleLink {
  id: string;
  week_id: string;
  module_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useWeekModuleLinks = (weekId?: string) => {
  return useQuery({
    queryKey: ['week-module-links', weekId],
    queryFn: async () => {
      let query = supabase.from('week_module_links').select('*');
      
      if (weekId) {
        query = query.eq('week_id', weekId);
      }
      
      const { data, error } = await query.order('order_index');

      if (error) throw error;
      return data as WeekModuleLink[];
    },
  });
};

export const useCreateWeekModuleLink = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ weekId, moduleId, orderIndex = 0 }: { 
      weekId: string; 
      moduleId: string; 
      orderIndex?: number; 
    }) => {
      const { data, error } = await supabase
        .from('week_module_links')
        .insert({
          week_id: weekId,
          module_id: moduleId,
          order_index: orderIndex,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['week-module-links'] });
      queryClient.invalidateQueries({ queryKey: ['week-slides'] });
      toast({
        title: "Link Created",
        description: "Module has been linked to week successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to link module to week. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteWeekModuleLink = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('week_module_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['week-module-links'] });
      queryClient.invalidateQueries({ queryKey: ['week-slides'] });
      toast({
        title: "Link Removed",
        description: "Module has been unlinked from week.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove link. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateWeekModuleLinkOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ linkId, orderIndex }: { linkId: string; orderIndex: number }) => {
      const { data, error } = await supabase
        .from('week_module_links')
        .update({ order_index: orderIndex })
        .eq('id', linkId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['week-module-links'] });
      queryClient.invalidateQueries({ queryKey: ['week-slides'] });
      toast({
        title: "Order Updated",
        description: "Module order has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    },
  });
};