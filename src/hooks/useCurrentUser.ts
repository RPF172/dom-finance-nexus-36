import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

interface CurrentUserProfile {
  id: string;
  user_id: string; 
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_premium: boolean;
  created_at: string;
}

interface CurrentUserData extends User {
  profile?: CurrentUserProfile;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // Listen to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return useQuery({
    queryKey: ['current-user', user?.id],
    queryFn: async (): Promise<CurrentUserData | null> => {
      if (!user) return null;
      
      // Fetch user profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return user; // Return user without profile if error
      }
      
      return {
        ...user,
        profile: profile || undefined
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};