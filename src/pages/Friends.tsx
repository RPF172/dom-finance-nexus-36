import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { FriendsList } from '@/components/social/FriendsList';
import { UserSearch } from '@/components/social/UserSearch';
import { Button } from '@/components/ui/button';
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

  if (!currentUserId) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-institutional uppercase tracking-wide">Connections</h1>
            <p className="text-muted-foreground mt-2">Manage your network</p>
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
        </div>
      </div>
    </AppLayout>
  );
}