import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, ThumbsUp, Clock, Send, Hash } from 'lucide-react';
import { AccessibleHeading, AccessibleButton, useAccessibility } from '@/components/ui/enhanced-accessibility';
import { formatDistanceToNow } from 'date-fns';

interface Discussion {
  id: string;
  title: string;
  content: string;
  content_type: 'week' | 'lesson' | 'chapter';
  content_id: string;
  user_id: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
    is_premium?: boolean;
    premium_color?: string;
  };
  user_has_liked?: boolean;
}

interface DiscussionReply {
  id: string;
  discussion_id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
    is_premium?: boolean;
    premium_color?: string;
  };
}

interface PeerDiscussionProps {
  contentType: 'week' | 'lesson' | 'chapter';
  contentId: string;
  contentTitle?: string;
  currentUserId?: string;
}

export const PeerDiscussion: React.FC<PeerDiscussionProps> = ({ 
  contentType, 
  contentId, 
  contentTitle,
  currentUserId 
}) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    fetchDiscussions();
  }, [contentType, contentId]);

  useEffect(() => {
    if (selectedDiscussion) {
      fetchReplies(selectedDiscussion);
    }
  }, [selectedDiscussion]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('peer_discussions')
        .select(`
          *,
          profiles!inner(
            display_name,
            avatar_url,
            is_premium,
            premium_color
          )
        `)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Check which discussions the user has liked
      if (currentUserId && data) {
        const discussionIds = data.map(d => d.id);
        const { data: likes } = await supabase
          .from('discussion_likes')
          .select('discussion_id')
          .eq('user_id', currentUserId)
          .in('discussion_id', discussionIds);

        const likedIds = new Set(likes?.map(l => l.discussion_id));
        
        const discussionsWithLikes = data.map(discussion => ({
          ...discussion,
          user_has_liked: likedIds.has(discussion.id)
        }));

        setDiscussions(discussionsWithLikes);
      } else {
        setDiscussions(data || []);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (discussionId: string) => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select(`
          *,
          profiles!inner(
            display_name,
            avatar_url,
            is_premium,
            premium_color
          )
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const createDiscussion = async () => {
    if (!currentUserId || !newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('peer_discussions')
        .insert({
          title: newDiscussion.title.trim(),
          content: newDiscussion.content.trim(),
          content_type: contentType,
          content_id: contentId,
          user_id: currentUserId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion started successfully!",
      });

      announceToScreenReader("New discussion created");
      setNewDiscussion({ title: '', content: '' });
      setShowNewDiscussion(false);
      fetchDiscussions();

    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const createReply = async () => {
    if (!currentUserId || !selectedDiscussion || !newReply.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          discussion_id: selectedDiscussion,
          content: newReply.trim(),
          user_id: currentUserId
        });

      if (error) throw error;

      setNewReply('');
      fetchReplies(selectedDiscussion);
      fetchDiscussions(); // Refresh to update reply counts

      announceToScreenReader("Reply added to discussion");

    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (discussionId: string) => {
    if (!currentUserId) return;

    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    try {
      if (discussion.user_has_liked) {
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', currentUserId);
      } else {
        await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussionId,
            user_id: currentUserId
          });
      }

      fetchDiscussions();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getDisplayNameStyle = (profile: any) => {
    if (profile.is_premium && profile.premium_color) {
      return { color: profile.premium_color };
    }
    return {};
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedDiscussion) {
    const discussion = discussions.find(d => d.id === selectedDiscussion);
    if (!discussion) return null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setSelectedDiscussion(null)}
          className="mb-4"
        >
          ← Back to Discussions
        </Button>

        {/* Discussion Detail */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={discussion.profiles.avatar_url} />
                <AvatarFallback>
                  {discussion.profiles.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <AccessibleHeading level={3} className="text-lg mb-1">
                  {discussion.title}
                </AccessibleHeading>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span style={getDisplayNameStyle(discussion.profiles)}>
                    {discussion.profiles.display_name}
                  </span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(discussion.created_at))} ago</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap mb-4">{discussion.content}</p>
            <div className="flex items-center gap-4">
              <AccessibleButton
                onClick={() => toggleLike(discussion.id)}
                variant="ghost"
                size="sm"
                ariaLabel={`${discussion.user_has_liked ? 'Unlike' : 'Like'} this discussion`}
                className={discussion.user_has_liked ? 'text-primary' : ''}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {discussion.likes_count}
              </AccessibleButton>
              <span className="text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 inline mr-1" />
                {discussion.replies_count} replies
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          {replies.map((reply) => (
            <Card key={reply.id} className="ml-4">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.profiles.avatar_url} />
                    <AvatarFallback className="text-sm">
                      {reply.profiles.display_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="font-medium text-sm"
                        style={getDisplayNameStyle(reply.profiles)}
                      >
                        {reply.profiles.display_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.created_at))} ago
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        {currentUserId && (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Add your reply..."
                  rows={3}
                  aria-label="Reply to discussion"
                />
                <Button 
                  onClick={createReply}
                  disabled={!newReply.trim() || submitting}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? 'Posting...' : 'Reply'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <AccessibleHeading level={2} className="text-xl">
            <Hash className="h-5 w-5 inline mr-2" />
            Discussion Forum
          </AccessibleHeading>
          {contentTitle && (
            <p className="text-sm text-muted-foreground">
              Discussing: {contentTitle}
            </p>
          )}
        </div>
        
        {currentUserId && (
          <Button 
            onClick={() => setShowNewDiscussion(!showNewDiscussion)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Start Discussion
          </Button>
        )}
      </div>

      {/* New Discussion Form */}
      {showNewDiscussion && currentUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Start a New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="discussion-title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                id="discussion-title"
                className="w-full px-3 py-2 border border-border rounded-md"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What would you like to discuss?"
                maxLength={100}
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="discussion-content" className="block text-sm font-medium mb-2">
                Content *
              </label>
              <Textarea
                id="discussion-content"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts, questions, or insights..."
                rows={4}
                maxLength={1000}
                aria-required="true"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={createDiscussion}
                disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim() || submitting}
              >
                {submitting ? 'Creating...' : 'Create Discussion'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewDiscussion(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No discussions yet. {currentUserId ? "Start the conversation!" : "Sign in to participate."}
              </p>
            </CardContent>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card 
              key={discussion.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDiscussion(discussion.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.profiles.avatar_url} />
                    <AvatarFallback>
                      {discussion.profiles.display_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{discussion.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span style={getDisplayNameStyle(discussion.profiles)}>
                        {discussion.profiles.display_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(discussion.created_at))} ago
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {discussion.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {discussion.replies_count}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};