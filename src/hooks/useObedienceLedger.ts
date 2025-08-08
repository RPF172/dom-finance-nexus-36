import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ObedienceLedgerEntry {
  id: string;
  user_id: string;
  points: number;
  action_type: string;
  action_key: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export function useObedienceLedger(limit = 8) {
  return useQuery<ObedienceLedgerEntry[]>({
    queryKey: ['obedience-ledger', limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('obedience_points_ledger')
        .select('id,user_id,points,action_type,action_key,metadata,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as ObedienceLedgerEntry[];
    },
  });
}
