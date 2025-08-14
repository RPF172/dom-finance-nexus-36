import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LearningSession {
  id: string;
  user_id: string;
  week_id?: string;
  session_start: string;
  session_end?: string;
  duration_minutes?: number;
  activities_completed: number;
  focus_score?: number;
  device_type: string;
}

export interface LearningInsights {
  total_sessions: number;
  total_minutes: number;
  avg_session_duration: number;
  avg_focus_score: number;
  most_active_day: string;
  completion_rate: number;
  weekly_progress: Array<{
    week: string;
    sessions: number;
    minutes: number;
  }>;
}

// Hook to get learning insights for current user
export const useLearningInsights = (daysBack: number = 30) => {
  return useQuery({
    queryKey: ['learning-insights', daysBack],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('get_learning_insights', {
        _user_id: user.id,
        _days_back: daysBack
      });

      if (error) throw error;
      return data[0] as LearningInsights;
    }
  });
};

// Hook to get user's learning sessions
export const useLearningSession = (limit: number = 10) => {
  return useQuery({
    queryKey: ['learning-sessions', limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_start', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as LearningSession[];
    }
  });
};

// Hook to track a learning session
export const useTrackLearningSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      weekId,
      durationMinutes,
      activitiesCompleted = 0,
      focusScore,
      deviceType = 'desktop'
    }: {
      weekId?: string;
      durationMinutes: number;
      activitiesCompleted?: number;
      focusScore?: number;
      deviceType?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('track_learning_session', {
        _user_id: user.id,
        _week_id: weekId || null,
        _duration_minutes: durationMinutes,
        _activities_completed: activitiesCompleted,
        _focus_score: focusScore || null,
        _device_type: deviceType
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-insights'] });
      queryClient.invalidateQueries({ queryKey: ['learning-sessions'] });
    }
  });
};

// Hook to get learning analytics for a specific week
export const useWeekAnalytics = (weekId: string) => {
  return useQuery({
    queryKey: ['week-analytics', weekId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_id', weekId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!weekId
  });
};

// Hook to start a learning session (for session timing)
export const useSessionTimer = () => {
  const trackSession = useTrackLearningSession();

  const startSession = (weekId?: string) => {
    const startTime = Date.now();
    let activitiesCount = 0;

    const endSession = (focusScore?: number) => {
      const endTime = Date.now();
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

      trackSession.mutate({
        weekId,
        durationMinutes,
        activitiesCompleted: activitiesCount,
        focusScore,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    };

    const incrementActivity = () => {
      activitiesCount += 1;
    };

    return { endSession, incrementActivity };
  };

  return { startSession, isTracking: trackSession.isPending };
};