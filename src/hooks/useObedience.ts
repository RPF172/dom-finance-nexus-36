import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ObedienceSummaryRow {
  user_id: string;
  total_points: number;
  tier_code: string | null;
  alpha_approved: boolean | null;
  last_activity_at: string | null;
  last_decay_run_at: string | null;
  shame_mark: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ObedienceTier {
  code: string;
  min_points: number;
  max_points: number | null;
  title: string;
  unlocks: Record<string, any> | null;
  order_index: number;
}

export interface UseObedienceResult {
  summary: ObedienceSummaryRow | null;
  tiers: ObedienceTier[];
  currentTier: ObedienceTier | null;
  nextTier: ObedienceTier | null;
  progressPercent: number; // 0-100
  pointsToNext: number; // 0 if max tier
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export function useObedience(targetUserId?: string) {
  return useQuery<UseObedienceResult>({
    queryKey: ['obedience', targetUserId ?? 'self'],
    queryFn: async () => {
      const userId = targetUserId ?? (await getCurrentUserId());
      if (!userId) return { summary: null, tiers: [], currentTier: null, nextTier: null, progressPercent: 0, pointsToNext: 0 };

      const [{ data: summary, error: summaryError }, { data: tiers, error: tiersError }] = await Promise.all([
        supabase.from('user_obedience_summary').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('obedience_tiers').select('*').order('min_points', { ascending: true }),
      ]);

      if (summaryError) throw summaryError;
      if (tiersError) throw tiersError;

      const tiersList = (tiers ?? []) as ObedienceTier[];
      const total = summary?.total_points ?? 0;

      const findTier = (pts: number): ObedienceTier | null => {
        if (!tiersList.length) return null;
        const tier = tiersList.find(t => pts >= t.min_points && (t.max_points == null || pts <= t.max_points));
        if (tier) return tier;
        // Fallback to lowest tier
        return tiersList[0] ?? null;
      };

      const currentTier = findTier(total);
      let nextTier: ObedienceTier | null = null;
      if (currentTier) {
        const idx = tiersList.findIndex(t => t.code === currentTier.code);
        nextTier = idx >= 0 && idx + 1 < tiersList.length ? tiersList[idx + 1] : null;
      }

      let progressPercent = 0;
      let pointsToNext = 0;
      if (currentTier && nextTier) {
        const range = nextTier.min_points - currentTier.min_points;
        const progressed = total - currentTier.min_points;
        progressPercent = Math.max(0, Math.min(100, Math.round((progressed / range) * 100)));
        pointsToNext = Math.max(0, nextTier.min_points - total);
      } else if (currentTier && !nextTier) {
        progressPercent = 100;
        pointsToNext = 0;
      }

      return {
        summary: (summary ?? null) as ObedienceSummaryRow | null,
        tiers: tiersList,
        currentTier,
        nextTier,
        progressPercent,
        pointsToNext,
      };
    },
  });
}
