import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProfileActivityItem {
  activity_type: 'post' | 'lesson' | string;
  id: string;
  occurred_at: string;
  title: string | null;
  description: string | null;
}

export function useProfileActivity(targetUserId?: string, limit: number = 10) {
  return useQuery({
    queryKey: ['profileActivity', targetUserId, limit],
    enabled: !!targetUserId,
    queryFn: async (): Promise<ProfileActivityItem[]> => {
      if (!targetUserId) return [];
      const { data, error } = await supabase.rpc('get_recent_activity', {
        _target_user_id: targetUserId,
        _limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as ProfileActivityItem[];
    },
  });
}
