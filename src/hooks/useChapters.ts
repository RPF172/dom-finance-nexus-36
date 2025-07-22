import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Chapter {
  id: string;
  module_id: string;
  title: string;
  body_text: string | null;
  order_index: number;
  published: boolean;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useChapters = (moduleId?: string) => {
  return useQuery({
    queryKey: ['chapters', moduleId],
    queryFn: async () => {
      let query = supabase
        .from('chapters')
        .select('*')
        .eq('published', true);
      
      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }
      
      const { data, error } = await query.order('order_index');
      
      if (error) throw error;
      return data as Chapter[];
    }
  });
};

export const useChapter = (chapterId: string) => {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as Chapter;
    },
    enabled: !!chapterId
  });
};