import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModuleSlide } from './useModuleSlides';

export interface WeekSlideData {
  week_id: string;
  week_number: number;
  week_title: string;
  week_description: string;
  module_id: string;
  module_title: string;
  module_slug: string;
  slide_id: string;
  slide_order: number;
  slide_type: string;
  slide_title: string;
  slide_body: string;
  slide_media_url: string;
  slide_interactive_config: Record<string, any>;
  slide_required: boolean;
  module_order: number;
}

export interface WeekWithSlides {
  id: string;
  week_number: number;
  title: string;
  description: string;
  modules: {
    id: string;
    title: string;
    slug: string;
    order: number;
    slides: ModuleSlide[];
  }[];
  totalSlides: number;
}

export const useWeekSlides = () => {
  return useQuery({
    queryKey: ['week-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('week_slides_view')
        .select('*')
        .order('week_number', { ascending: true })
        .order('module_order', { ascending: true })
        .order('slide_order', { ascending: true });

      if (error) throw error;

      // Group data by weeks
      const weeksMap = new Map<string, WeekWithSlides>();
      
      (data as WeekSlideData[]).forEach((row) => {
        if (!weeksMap.has(row.week_id)) {
          weeksMap.set(row.week_id, {
            id: row.week_id,
            week_number: row.week_number,
            title: row.week_title,
            description: row.week_description,
            modules: [],
            totalSlides: 0,
          });
        }

        const week = weeksMap.get(row.week_id)!;
        let module = week.modules.find(m => m.id === row.module_id);
        
        if (!module) {
          module = {
            id: row.module_id,
            title: row.module_title,
            slug: row.module_slug,
            order: row.module_order,
            slides: [],
          };
          week.modules.push(module);
        }

        module.slides.push({
          id: row.slide_id,
          module_id: row.module_id,
          order_index: row.slide_order,
          type: row.slide_type as any,
          title: row.slide_title,
          body: row.slide_body,
          media_url: row.slide_media_url,
          interactive_config: row.slide_interactive_config,
          required: row.slide_required,
          created_at: '',
          updated_at: '',
        });

        week.totalSlides++;
      });

      // Sort modules by order and convert to array
      const weeks = Array.from(weeksMap.values());
      weeks.forEach(week => {
        week.modules.sort((a, b) => a.order - b.order);
      });

      return weeks;
    },
  });
};

export const useWeekSlideProgress = (weekId: string) => {
  return useQuery({
    queryKey: ['week-slide-progress', weekId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slide_progress')
        .select('*')
        .eq('module_id', weekId);

      if (error) throw error;
      return data;
    },
    enabled: !!weekId,
  });
};