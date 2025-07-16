import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CommentCreator } from './CommentCreator';

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user_id: string;
  parent_comment_id?: string;
  profile: {
    display_name: string;
    avatar_url?: string;
    is_premium?: boolean;
    premium_color?: string;
  };
  replies?: Comment[];
}

interface CommentsListProps {
  postId: string;
  currentUser?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

export const CommentsList: React.FC<CommentsListProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReplyTo, setShowReplyTo] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      // Fetch all comments for this post
      const { data: commentsData, error: commentsError } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          likes_count,
          created_at,
          user_id,
          parent_comment_id
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Get unique user IDs
      const userIds = [...new Set(commentsData?.map(comment => comment.user_id) || [])];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, is_premium, premium_color')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create profiles map
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      // Process comments with profiles
      const commentsWithProfiles: Comment[] = (commentsData || [])
        .filter(comment => profilesMap.has(comment.user_id))
        .map(comment => ({
          ...comment,
          profile: profilesMap.get(comment.user_id)!
        }));

      // Organize comments into threads
      const topLevelComments: Comment[] = [];
      const repliesMap = new Map<string, Comment[]>();

      commentsWithProfiles.forEach(comment => {
        if (!comment.parent_comment_id) {
          topLevelComments.push(comment);
        } else {
          if (!repliesMap.has(comment.parent_comment_id)) {
            repliesMap.set(comment.parent_comment_id, []);
          }
          repliesMap.get(comment.parent_comment_id)!.push(comment);
        }
      });

      // Add replies to their parent comments
      const threadsWithReplies = topLevelComments.map(comment => ({
        ...comment,
        replies: repliesMap.get(comment.id) || []
      }));

      setComments(threadsWithReplies);

      // Check which comments current user has liked
      if (currentUser) {
        await checkLikedComments(commentsWithProfiles.map(c => c.id));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLikedComments = async (commentIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('id')
        .in('id', commentIds);
        // Note: We would need a comment_likes table for this feature
        // For now, just setting empty set

      if (error) throw error;
      
      // This would be implemented when we add comment likes table
      setLikedComments(new Set());
    } catch (error) {
      console.error('Error checking liked comments:', error);
    }
  };

  const handleCommentCreated = () => {
    fetchComments();
    setShowReplyTo(null);
  };

  const getDisplayNameStyle = (profile: Comment['profile']) => {
    if (profile.is_premium && profile.premium_color) {
      return { color: profile.premium_color };
    }
    return {};
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.profile.avatar_url} />
          <AvatarFallback className="text-xs">
            {comment.profile.display_name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <h4 
                className="font-semibold text-sm"
                style={getDisplayNameStyle(comment.profile)}
              >
                {comment.profile.display_name}
              </h4>
              {comment.profile.is_premium && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  PRO
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at))} ago
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
            >
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes_count}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyTo(showReplyTo === comment.id ? null : comment.id)}
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            
            {currentUser?.id === comment.user_id && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {showReplyTo === comment.id && currentUser && (
            <div className="mt-3">
              <CommentCreator
                postId={postId}
                parentCommentId={comment.id}
                userProfile={{
                  display_name: currentUser.display_name,
                  avatar_url: currentUser.avatar_url,
                }}
                onCommentCreated={handleCommentCreated}
                placeholder={`Reply to ${comment.profile.display_name}...`}
                autoFocus={true}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add new comment */}
      {currentUser && (
        <CommentCreator
          postId={postId}
          userProfile={{
            display_name: currentUser.display_name,
            avatar_url: currentUser.avatar_url,
          }}
          onCommentCreated={handleCommentCreated}
        />
      )}
      
      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-6">
          <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {currentUser ? "Be the first to comment!" : "Sign in to view comments."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
};