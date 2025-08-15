import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return data || false;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};