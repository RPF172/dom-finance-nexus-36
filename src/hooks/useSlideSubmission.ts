import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SlideSubmissionData {
  moduleId: string;
  slideId: string;
  textResponse?: string;
  mediaFile?: File;
  metadata?: Record<string, any>;
}

export const useSlideSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ moduleId, slideId, textResponse, mediaFile, metadata }: SlideSubmissionData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      let mediaUrl: string | undefined;

      // Upload media file if provided
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `slide-submissions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('magat')
          .upload(filePath, mediaFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('magat')
          .getPublicUrl(filePath);

        mediaUrl = publicUrl;
      }

      // Save submission
      const { data, error } = await supabase
        .from('slide_submissions')
        .insert({
          user_id: user.user.id,
          module_id: moduleId,
          slide_id: slideId,
          text_response: textResponse,
          media_url: mediaUrl,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Submission Recorded",
        description: "Your submission has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Failed to save your submission. Please try again.",
        variant: "destructive",
      });
    },
  });
};