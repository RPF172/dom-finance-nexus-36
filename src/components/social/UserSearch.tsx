import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Loader2, UserCheck, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_premium?: boolean;
  premium_color?: string;
}

interface ConnectionStatus {
  status: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  connection_id?: string;
}

interface UserSearchProps {
  currentUserId?: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({ currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [connectionStatuses, setConnectionStatuses] = useState<Map<string, ConnectionStatus>>(new Map());
  const [searching, setSearching] = useState(false);
  const [sendingRequests, setSendingRequests] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
        setConnectionStatuses(new Map());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentUserId]);

  const searchUsers = async () => {
    if (!currentUserId) return;

    try {
      setSearching(true);

      // Search for users by display name
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, is_premium, premium_color')
        .ilike('display_name', `%${searchTerm}%`)
        .neq('user_id', currentUserId)
        .limit(10);

      if (error) throw error;

      setSearchResults(profiles || []);

      // Check connection status for each user
      if (profiles && profiles.length > 0) {
        const userIds = profiles.map(p => p.user_id);
        await checkConnectionStatuses(userIds);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const checkConnectionStatuses = async (userIds: string[]) => {
    try {
      const { data: connections, error } = await supabase
        .from('user_connections')
        .select('id, follower_id, following_id, status')
        .or(
          userIds.map(id => `and(follower_id.eq.${currentUserId},following_id.eq.${id}),and(follower_id.eq.${id},following_id.eq.${currentUserId})`).join(',')
        );

      if (error) throw error;

      const statusMap = new Map<string, ConnectionStatus>();

      userIds.forEach(userId => {
        const connection = connections?.find(conn => 
          (conn.follower_id === currentUserId && conn.following_id === userId) ||
          (conn.follower_id === userId && conn.following_id === currentUserId)
        );

        if (!connection) {
          statusMap.set(userId, { status: 'none' });
        } else if (connection.status === 'accepted') {
          statusMap.set(userId, { status: 'connected', connection_id: connection.id });
        } else if (connection.status === 'pending') {
          if (connection.follower_id === currentUserId) {
            statusMap.set(userId, { status: 'pending_sent', connection_id: connection.id });
          } else {
            statusMap.set(userId, { status: 'pending_received', connection_id: connection.id });
          }
        }
      });

      setConnectionStatuses(statusMap);
    } catch (error) {
      console.error('Error checking connection statuses:', error);
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    if (!currentUserId) return;

    try {
      setSendingRequests(prev => new Set(prev).add(targetUserId));

      const { error } = await supabase
        .from('user_connections')
        .insert({
          follower_id: currentUserId,
          following_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request sent!",
      });

      // Update connection status
      setConnectionStatuses(prev => new Map(prev).set(targetUserId, { status: 'pending_sent' }));
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  };

  const getDisplayNameStyle = (profile: UserProfile) => {
    if (profile.is_premium && profile.premium_color) {
      return { color: profile.premium_color };
    }
    return {};
  };

  const getConnectionButton = (profile: UserProfile) => {
    const status = connectionStatuses.get(profile.user_id)?.status || 'none';
    const isLoading = sendingRequests.has(profile.user_id);

    switch (status) {
      case 'connected':
        return (
          <Badge variant="secondary" className="text-xs">
            <UserCheck className="h-3 w-3 mr-1" />
            Friends
          </Badge>
        );
      case 'pending_sent':
        return (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case 'pending_received':
        return (
          <Badge variant="default" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Received
          </Badge>
        );
      case 'none':
      default:
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendFriendRequest(profile.user_id)}
            disabled={isLoading}
            className="text-primary hover:text-primary"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for friends by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm.trim().length >= 2 && (
        <div className="space-y-3">
          {searchResults.length === 0 && !searching ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
            </div>
          ) : (
            searchResults.map((profile) => (
              <Card key={profile.user_id} className="bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback>
                          {profile.display_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 
                            className="font-semibold text-sm"
                            style={getDisplayNameStyle(profile)}
                          >
                            {profile.display_name}
                          </h3>
                          {profile.is_premium && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              PRO
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {getConnectionButton(profile)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Type at least 2 characters to search for users
          </p>
        </div>
      )}
    </div>
  );
};