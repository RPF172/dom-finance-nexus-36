import React, { useState, useEffect } from 'react';
import { SocialFeed } from '@/components/social/SocialFeed';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Social() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    display_name: string;
    avatar_url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setCurrentUser({
          id: user.id,
          display_name: profile.display_name || 'Anonymous',
          avatar_url: profile.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-institutional uppercase tracking-wide">Social Feed</h1>
            <p className="text-muted-foreground mt-2">Connect with the community</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SocialFeed currentUser={currentUser} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}