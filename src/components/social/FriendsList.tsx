import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserMinus, UserCheck, Clock, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FriendConnection {
  id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  follower_id: string;
  following_id: string;
  profile: {
    display_name: string;
    avatar_url?: string;
    is_premium?: boolean;
    premium_color?: string;
  };
}

interface FriendsListProps {
  currentUserId?: string;
}

export const FriendsList: React.FC<FriendsListProps> = ({ currentUserId }) => {
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendConnection[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'sent'>('friends');
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserId) {
      fetchConnections();
    }
  }, [currentUserId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);

      // Get all connections for this user
      const { data: connections, error } = await supabase
        .from('user_connections')
        .select(`
          id,
          status,
          created_at,
          follower_id,
          following_id
        `)
        .or(`follower_id.eq.${currentUserId},following_id.eq.${currentUserId}`);

      if (error) throw error;

      // Get all unique user IDs we need profiles for
      const userIds = new Set<string>();
      connections?.forEach(conn => {
        userIds.add(conn.follower_id === currentUserId ? conn.following_id : conn.follower_id);
      });

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, is_premium, premium_color')
        .in('user_id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create profiles map
      const profilesMap = new Map(
        profiles?.map(p => [p.user_id, p]) || []
      );

      // Process connections
      const processedConnections: FriendConnection[] = (connections || [])
        .map(conn => {
          const otherUserId = conn.follower_id === currentUserId ? conn.following_id : conn.follower_id;
          const profile = profilesMap.get(otherUserId);
          
          if (!profile) return null;

          return {
            ...conn,
            profile
          };
        })
        .filter(Boolean) as FriendConnection[];

      // Separate into different categories
      const acceptedFriends = processedConnections.filter(conn => conn.status === 'accepted');
      const pendingReceived = processedConnections.filter(conn => 
        conn.status === 'pending' && conn.following_id === currentUserId
      );
      const pendingSent = processedConnections.filter(conn => 
        conn.status === 'pending' && conn.follower_id === currentUserId
      );

      setFriends(acceptedFriends);
      setPendingRequests(pendingReceived);
      setSentRequests(pendingSent);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Error",
        description: "Failed to load connections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request accepted!",
      });

      fetchConnections();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request declined.",
      });

      fetchConnections();
    } catch (error) {
      console.error('Error declining request:', error);
      toast({
        title: "Error",
        description: "Failed to decline request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFriend = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend removed.",
      });

      fetchConnections();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDisplayNameStyle = (profile: FriendConnection['profile']) => {
    if (profile.is_premium && profile.premium_color) {
      return { color: profile.premium_color };
    }
    return {};
  };

  const renderConnectionCard = (connection: FriendConnection, type: 'friend' | 'request' | 'sent') => (
    <Card key={connection.id} className="bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={connection.profile.avatar_url} />
              <AvatarFallback>
                {connection.profile.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 
                  className="font-semibold text-sm"
                  style={getDisplayNameStyle(connection.profile)}
                >
                  {connection.profile.display_name}
                </h3>
                {connection.profile.is_premium && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {type === 'friend' && 'Connected'}
                {type === 'request' && 'Wants to connect'}
                {type === 'sent' && 'Request sent'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {type === 'friend' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveFriend(connection.id)}
                className="text-destructive hover:text-destructive"
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            )}
            
            {type === 'request' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAcceptRequest(connection.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeclineRequest(connection.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {type === 'sent' && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'friends'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
            activeTab === 'requests'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Requests ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {pendingRequests.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'sent'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'friends' && (
          <>
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No friends yet. Start connecting!</p>
              </div>
            ) : (
              friends.map(friend => renderConnectionCard(friend, 'friend'))
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending requests.</p>
              </div>
            ) : (
              pendingRequests.map(request => renderConnectionCard(request, 'request'))
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No sent requests.</p>
              </div>
            ) : (
              sentRequests.map(request => renderConnectionCard(request, 'sent'))
            )}
          </>
        )}
      </div>
    </div>
  );
};