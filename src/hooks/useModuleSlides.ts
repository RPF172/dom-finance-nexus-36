import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleSlide {
  id: string;
  module_id: string;
  order_index: number;
  type: 'command' | 'visual' | 'instruction' | 'interactive' | 'checkpoint' | 'final';
  title: string;
  body?: string;
  media_url?: string;
  interactive_config: Record<string, any>;
  required: boolean;
  created_at: string;
  updated_at: string;
}

export const useModuleSlides = (moduleId: string) => {
  return useQuery({
    queryKey: ['module-slides', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_slides')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index');

      if (error) throw error;
      return data as ModuleSlide[];
    },
    enabled: !!moduleId,
  });
};