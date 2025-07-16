import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  objective: string | null;
  body_text: string | null;
  assignment_text: string | null;
  ritual_text: string | null;
  order_index: number;
  estimated_time: number;
  published: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  year_id: string;
  order_index: number;
  published: boolean;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  question: string;
  type: string;
  options: any;
  answer: any;
  explanation: string | null;
  order_index: number;
}

export const useModules = () => {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('published', true)
        .order('order_index');
      
      if (error) throw error;
      return data as Module[];
    }
  });
};

export const useLessons = (moduleId?: string) => {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async () => {
      let query = supabase
        .from('lessons')
        .select('*')
        .eq('published', true);
      
      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }
      
      const { data, error } = await query.order('order_index');
      
      if (error) throw error;
      return data as Lesson[];
    }
  });
};

export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as Lesson;
    },
    enabled: !!lessonId
  });
};

export const useQuizzes = (lessonId: string) => {
  return useQuery({
    queryKey: ['quizzes', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');
      
      if (error) throw error;
      return data as Quiz[];
    },
    enabled: !!lessonId
  });
};