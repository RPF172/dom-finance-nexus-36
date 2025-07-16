import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SlidingBottomNav from '@/components/SlidingBottomNav';
import { FriendsList } from '@/components/social/FriendsList';
import { UserSearch } from '@/components/social/UserSearch';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function Friends() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'search'>('friends');
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setCurrentUserId(user.id);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/auth');
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

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/social')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Friends</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'friends'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Friends
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'search'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Find Friends
            </button>
          </div>

          {/* Content */}
          {activeTab === 'friends' ? (
            <FriendsList currentUserId={currentUserId} />
          ) : (
            <UserSearch currentUserId={currentUserId} />
          )}
        </div>
      </main>

      <SlidingBottomNav />
    </div>
  );
}