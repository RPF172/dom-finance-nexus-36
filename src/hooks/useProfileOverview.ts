import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProfileOverview {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  is_premium: boolean | null;
  premium_color: string | null;
  joined_at: string | null;
  posts_count: number | null;
  likes_received_count: number | null;
  comments_received_count: number | null;
  lessons_completed_count: number | null;
}

export function useProfileOverview(targetUserId?: string) {
  return useQuery({
    queryKey: ['profileOverview', targetUserId],
    enabled: !!targetUserId,
    queryFn: async (): Promise<ProfileOverview | null> => {
      if (!targetUserId) return null;
      const { data, error } = await supabase.rpc('get_profile_overview', {
        _target_user_id: targetUserId,
      });
      if (error) throw error;
      // RPC returns an array of rows; pick the first
      const row = Array.isArray(data) ? (data[0] as ProfileOverview | undefined) : null;
      return row ?? null;
    },
  });
}
