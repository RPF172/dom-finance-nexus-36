import React, { useState, useEffect } from 'react';
import { PostCreator } from './PostCreator';
import { PostCard } from './PostCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  privacy_level: 'public' | 'friends' | 'private';
  location?: string;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
    is_premium?: boolean;
    premium_color?: string;
  };
}

interface SocialFeedProps {
  currentUser?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // First get posts with enhanced algorithm for friends
      const { data: { user } } = await supabase.auth.getUser();
      let postsQuery = supabase
        .from('posts')
        .select(`
          id,
          content,
          privacy_level,
          location,
          is_pinned,
          likes_count,
          comments_count,
          shares_count,
          created_at,
          user_id
        `)
        .limit(20);

      // If user is logged in, get their friend connections for prioritization
      let friendIds: string[] = [];
      if (user) {
        const { data: connections } = await supabase
          .from('user_connections')
          .select('follower_id, following_id')
          .eq('status', 'accepted')
          .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`);

        friendIds = (connections || []).map(conn => 
          conn.follower_id === user.id ? conn.following_id : conn.follower_id
        );
      }

      const { data: postsData, error: postsError } = await postsQuery;
      if (postsError) throw postsError;

      // Get unique user IDs
      const userIds = [...new Set(postsData?.map(post => post.user_id) || [])];

      // Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, is_premium, premium_color')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a profiles map
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      // Combine posts with profiles and apply algorithm
      let transformedPosts: Post[] = (postsData || [])
        .filter(post => profilesMap.has(post.user_id))
        .map(post => ({
          ...post,
          profiles: profilesMap.get(post.user_id)!
        }));

      // Enhanced algorithm: Prioritize posts based on relationship and engagement
      transformedPosts.sort((a, b) => {
        // First priority: Pinned posts
        if (a.is_pinned !== b.is_pinned) {
          return a.is_pinned ? -1 : 1;
        }

        // Second priority: Friend posts (if user is logged in)
        if (user && friendIds.length > 0) {
          const aIsFriend = friendIds.includes(a.user_id);
          const bIsFriend = friendIds.includes(b.user_id);
          
          if (aIsFriend !== bIsFriend) {
            return aIsFriend ? -1 : 1;
          }
        }

        // Third priority: User's own posts
        if (user) {
          const aIsOwn = a.user_id === user.id;
          const bIsOwn = b.user_id === user.id;
          
          if (aIsOwn !== bIsOwn) {
            return aIsOwn ? -1 : 1;
          }
        }

        // Fourth priority: Engagement score (likes + comments * 2)
        const aScore = a.likes_count + (a.comments_count * 2);
        const bScore = b.likes_count + (b.comments_count * 2);
        
        if (aScore !== bScore) {
          return bScore - aScore; // Higher engagement first
        }

        // Final priority: Recency
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts(true);
  };

  const handlePostUpdate = () => {
    fetchPosts(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Post Creator */}
      {currentUser && (
        <PostCreator
          userProfile={{
            display_name: currentUser.display_name,
            avatar_url: currentUser.avatar_url,
          }}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {refreshing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts yet. {currentUser ? "Be the first to share something!" : "Sign in to see posts."}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userProfile={post.profiles}
              isOwnPost={currentUser?.id === post.user_id}
              onPostUpdate={handlePostUpdate}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};