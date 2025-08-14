import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export interface ActivityItem {
  id: string;
  type: 'obedience_points' | 'post' | 'learning_session' | 'connection';
  user: {
    id: string;
    name: string;
    avatar?: string;
    is_premium?: boolean;
  };
  timestamp: string;
  content?: {
    title?: string;
    description?: string;
    points?: number;
  };
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
}

export const useRealActivityFeed = () => {
  const [filter, setFilter] = useState<'all' | 'posts' | 'achievements' | 'connections'>('all');

  const { data: activities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['activity-feed', filter],
    queryFn: async () => {
      // Fetch from the user_activities view with profile data
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(50);

      // Apply filter
      if (filter === 'posts') {
        query = query.eq('activity_type', 'post');
      } else if (filter === 'achievements') {
        query = query.in('activity_type', ['obedience_points', 'learning_session']);
      } else if (filter === 'connections') {
        query = query.eq('activity_type', 'connection');
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Get profile data for each activity user
      const activitiesWithProfiles = await Promise.all(
        (data || []).map(async (item: any) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url, is_premium')
            .eq('user_id', item.user_id)
            .single();

          return {
            id: item.id,
            type: item.activity_type,
            user: {
              id: item.user_id,
              name: profile?.display_name || 'Anonymous',
              avatar: profile?.avatar_url,
              is_premium: profile?.is_premium || false
            },
            timestamp: item.occurred_at,
            content: {
              title: item.title,
              description: item.description,
              points: item.metadata && !isNaN(Number(item.metadata)) ? Number(item.metadata) : undefined
            },
            isLiked: false, // TODO: Implement activity likes system
            likeCount: Math.floor(Math.random() * 10), // Temporary random likes
            commentCount: Math.floor(Math.random() * 5) // Temporary random comments
          };
        })
      );

      return activitiesWithProfiles as ActivityItem[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds for fresh data
  });

  const toggleLike = async (activityId: string) => {
    // TODO: Implement activity likes functionality
    console.log('Toggle like for activity:', activityId);
    // For now, just refetch to simulate the change
    refetch();
  };

  return {
    activities,
    isLoading,
    error,
    filter,
    setFilter,
    toggleLike,
    refetch
  };
};