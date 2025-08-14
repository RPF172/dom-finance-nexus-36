import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DailyCheckinData {
  id: string;
  user_id: string;
  check_in_date: string;
  streak_day: number;
  points_awarded: number;
  created_at: string;
}

interface CheckinResult {
  streak_day: number;
  points_awarded: number;
  is_new_checkin: boolean;
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export function useDailyCheckin() {
  const queryClient = useQueryClient();

  // Get current user's check-in status
  const { data: checkinData, isLoading } = useQuery<DailyCheckinData[]>({
    queryKey: ['daily-checkin'],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('check_in_date', { ascending: false })
        .limit(7);

      if (error) throw error;
      return (data ?? []) as DailyCheckinData[];
    },
  });

  // Check if user has checked in today
  const hasCheckedInToday = checkinData?.some(
    checkin => checkin.check_in_date === new Date().toISOString().split('T')[0]
  ) ?? false;

  // Get current streak info
  const todayCheckin = checkinData?.find(
    checkin => checkin.check_in_date === new Date().toISOString().split('T')[0]
  );

  // Calculate streak visual data (last 7 days)
  const getStreakData = () => {
    const today = new Date();
    const streakDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const checkin = checkinData?.find(c => c.check_in_date === dateStr);
      streakDays.push({
        date: dateStr,
        day: date.getDate(),
        isCheckedIn: !!checkin,
        isToday: i === 0,
        points: checkin?.points_awarded || 0
      });
    }
    
    return streakDays;
  };

  // Perform daily check-in
  const checkinMutation = useMutation({
    mutationFn: async (): Promise<CheckinResult> => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('handle_daily_checkin', {
        _user_id: userId
      });

      if (error) throw error;
      return data[0] as CheckinResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-checkin'] });
      queryClient.invalidateQueries({ queryKey: ['obedience'] });
      queryClient.invalidateQueries({ queryKey: ['obedience-ledger'] });
    },
  });

  return {
    checkinData,
    isLoading,
    hasCheckedInToday,
    currentStreak: todayCheckin?.streak_day || 0,
    todayPoints: todayCheckin?.points_awarded || 0,
    streakData: getStreakData(),
    checkin: checkinMutation.mutate,
    isCheckingIn: checkinMutation.isPending,
  };
}