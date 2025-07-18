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
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-accent animate-pulse"></div>
              <h1 className="text-3xl font-institutional uppercase tracking-wide">Social Feed</h1>
            </div>
            <p className="text-muted-foreground">Connect with the community</p>
            <div className="w-full bg-muted h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-accent h-1 rounded-full w-1/3 animate-pulse"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
            <SocialFeed currentUser={currentUser} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}