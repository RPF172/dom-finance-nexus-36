import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

export interface RealCommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_value: number;
  reward_points: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  participant_count: number;
  user_progress: number;
  is_joined: boolean;
  leaderboard: Array<{
    user_id: string;
    display_name: string;
    avatar_url?: string;
    progress: number;
    is_premium: boolean;
  }>;
}

export const useRealCommunityChallenges = () => {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading, error } = useQuery({
    queryKey: ['community-challenges', currentUser?.id],
    queryFn: async () => {
      // Fetch active challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('community_challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (challengesError) throw challengesError;

      const challengesWithData = await Promise.all(
        challengesData.map(async (challenge) => {
          // Get participant count
          const { count: participantCount } = await supabase
            .from('challenge_participants')
            .select('*', { count: 'exact', head: true })
            .eq('challenge_id', challenge.id);

          // Check if current user is joined
          let userProgress = 0;
          let isJoined = false;
          
          if (currentUser) {
            const { data: userParticipation } = await supabase
              .from('challenge_participants')
              .select('current_progress')
              .eq('challenge_id', challenge.id)
              .eq('user_id', currentUser.id)
              .single();

            if (userParticipation) {
              isJoined = true;
              userProgress = userParticipation.current_progress;
            }
          }

          // Get leaderboard (top 10) with proper join
          const { data: leaderboardData } = await supabase
            .from('challenge_participants')
            .select(`
              user_id,
              current_progress
            `)
            .eq('challenge_id', challenge.id)
            .order('current_progress', { ascending: false })
            .limit(10);

          // Get profile data for leaderboard users
          const leaderboard = await Promise.all(
            (leaderboardData || []).map(async (participant) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, avatar_url, is_premium')
                .eq('user_id', participant.user_id)
                .single();

              return {
                user_id: participant.user_id,
                display_name: profile?.display_name || 'Anonymous',
                avatar_url: profile?.avatar_url,
                progress: participant.current_progress,
                is_premium: profile?.is_premium || false
              };
            })
          );

          return {
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            type: challenge.type,
            difficulty: challenge.difficulty as 'beginner' | 'intermediate' | 'advanced',
            target_value: challenge.target_value,
            reward_points: challenge.reward_points,
            start_date: challenge.start_date,
            end_date: challenge.end_date,
            is_active: challenge.is_active,
            participant_count: participantCount || 0,
            user_progress: userProgress,
            is_joined: isJoined,
            leaderboard
          };
        })
      );

      return challengesWithData;
    },
    enabled: !!currentUser
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: currentUser.id,
          current_progress: 0
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-challenges'] });
    }
  });

  const leaveChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('challenge_participants')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-challenges'] });
    }
  });

  return {
    challenges,
    isLoading,
    error,
    joinChallenge: joinChallengeMutation.mutate,
    leaveChallenge: leaveChallengeMutation.mutate,
    isJoiningChallenge: joinChallengeMutation.isPending,
    isLeavingChallenge: leaveChallengeMutation.isPending
  };
};