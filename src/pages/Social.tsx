import React, { useState, useEffect } from 'react';
import { SocialFeed } from '@/components/social/SocialFeed';
import Header from '@/components/Header';
import SlidingBottomNav from '@/components/SlidingBottomNav';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <SlidingBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Social Feed</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <SocialFeed currentUser={currentUser} />
        </div>
      </main>

      <SlidingBottomNav />
    </div>
  );
}