import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  rank: number;
}

export function useObedienceLeaderboard(limit = 10) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['obedience-leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-leaderboard', {
        body: { limit },
      });
      if (error) throw error;
      return (data ?? []) as LeaderboardEntry[];
    },
  });
}
