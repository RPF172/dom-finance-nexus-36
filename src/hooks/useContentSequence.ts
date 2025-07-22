import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from './useChapters';
import { Lesson } from './useLessons';

export interface ContentSequenceItem {
  id: string;
  module_id: string;
  content_type: 'chapter' | 'lesson';
  content_id: string;
  sequence_order: number;
  created_at: string;
}

export interface MixedContentItem {
  id: string;
  type: 'chapter' | 'lesson';
  sequence_order: number;
  content: Chapter | Lesson;
}

export const useContentSequence = (moduleId?: string) => {
  return useQuery({
    queryKey: ['content-sequence', moduleId],
    queryFn: async () => {
      // First, get the content sequence
      let sequenceQuery = supabase
        .from('content_sequence')
        .select('*');
      
      if (moduleId) {
        sequenceQuery = sequenceQuery.eq('module_id', moduleId);
      }
      
      const { data: sequenceData, error: sequenceError } = await sequenceQuery
        .order('sequence_order');
      
      if (sequenceError) throw sequenceError;
      
      if (!sequenceData || sequenceData.length === 0) {
        return [];
      }
      
      // Get all chapter and lesson IDs
      const chapterIds = sequenceData
        .filter(item => item.content_type === 'chapter')
        .map(item => item.content_id);
      
      const lessonIds = sequenceData
        .filter(item => item.content_type === 'lesson')
        .map(item => item.content_id);
      
      // Fetch chapters and lessons in parallel
      const [chaptersResponse, lessonsResponse] = await Promise.all([
        chapterIds.length > 0 
          ? supabase
              .from('chapters')
              .select('*')
              .in('id', chapterIds)
              .eq('published', true)
          : { data: [], error: null },
        lessonIds.length > 0
          ? supabase
              .from('lessons')
              .select('*')
              .in('id', lessonIds)
              .eq('published', true)
          : { data: [], error: null }
      ]);
      
      if (chaptersResponse.error) throw chaptersResponse.error;
      if (lessonsResponse.error) throw lessonsResponse.error;
      
      // Create maps for quick lookup
      const chaptersMap = new Map(
        (chaptersResponse.data || []).map(chapter => [chapter.id, chapter])
      );
      const lessonsMap = new Map(
        (lessonsResponse.data || []).map(lesson => [lesson.id, lesson])
      );
      
      // Build the mixed content array
      const mixedContent: MixedContentItem[] = sequenceData
        .map(sequenceItem => {
          const content = sequenceItem.content_type === 'chapter' 
            ? chaptersMap.get(sequenceItem.content_id)
            : lessonsMap.get(sequenceItem.content_id);
          
          if (!content) return null;
          
          return {
            id: sequenceItem.id,
            type: sequenceItem.content_type,
            sequence_order: sequenceItem.sequence_order,
            content
          };
        })
        .filter((item): item is MixedContentItem => item !== null)
        .sort((a, b) => a.sequence_order - b.sequence_order);
      
      return mixedContent;
    }
  });
};

// Fallback hook for when content_sequence is not set up yet
export const useFallbackMixedContent = (moduleId?: string) => {
  return useQuery({
    queryKey: ['fallback-mixed-content', moduleId],
    queryFn: async () => {
      const [chaptersResponse, lessonsResponse] = await Promise.all([
        supabase
          .from('chapters')
          .select('*')
          .eq('published', true)
          .then(response => moduleId ? 
            supabase.from('chapters').select('*').eq('module_id', moduleId).eq('published', true) : 
            response
          ),
        supabase
          .from('lessons')
          .select('*')
          .eq('published', true)
          .then(response => moduleId ? 
            supabase.from('lessons').select('*').eq('module_id', moduleId).eq('published', true) : 
            response
          )
      ]);
      
      if (chaptersResponse.error) throw chaptersResponse.error;
      if (lessonsResponse.error) throw lessonsResponse.error;
      
      const chapters = (chaptersResponse.data || []).map((chapter, index) => ({
        id: `chapter-${chapter.id}`,
        type: 'chapter' as const,
        sequence_order: index * 2,
        content: chapter
      }));
      
      const lessons = (lessonsResponse.data || []).map((lesson, index) => ({
        id: `lesson-${lesson.id}`,
        type: 'lesson' as const,
        sequence_order: index * 2 + 1,
        content: lesson
      }));
      
      return [...chapters, ...lessons].sort((a, b) => a.sequence_order - b.sequence_order);
    }
  });
};