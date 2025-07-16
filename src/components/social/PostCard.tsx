import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: {
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
  };
  userProfile: {
    display_name: string;
    avatar_url?: string;
    is_premium?: boolean;
    premium_color?: string;
  };
  isOwnPost?: boolean;
  onPostUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  userProfile, 
  isOwnPost = false,
  onPostUpdate 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfLiked();
  }, [post.id]);

  const checkIfLiked = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    } catch (error) {
      // No like found, which is fine
    }
  };

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to like posts",
          variant: "destructive",
        });
        return;
      }

      setIsLiking(true);

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });

        if (error) throw error;

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const getDisplayNameStyle = () => {
    if (userProfile.is_premium && userProfile.premium_color) {
      return { color: userProfile.premium_color };
    }
    return {};
  };

  const getPrivacyBadgeVariant = (privacy: string) => {
    switch (privacy) {
      case 'friends':
        return 'secondary';
      case 'private':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userProfile.avatar_url} />
                <AvatarFallback>
                  {userProfile.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 
                    className="font-semibold text-sm"
                    style={getDisplayNameStyle()}
                  >
                    {userProfile.display_name}
                  </h3>
                  {userProfile.is_premium && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      PRO
                    </Badge>
                  )}
                  {post.is_pinned && (
                    <Pin className="h-3 w-3 text-primary" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                  <span>•</span>
                  <Badge 
                    variant={getPrivacyBadgeVariant(post.privacy_level)} 
                    className="text-xs px-2 py-0.5"
                  >
                    {post.privacy_level}
                  </Badge>
                </div>
              </div>
            </div>

            {isOwnPost && (
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {post.location && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{post.location}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-1 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.comments_count}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs">{post.shares_count}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};