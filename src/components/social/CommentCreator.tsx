import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommentCreatorProps {
  postId: string;
  parentCommentId?: string;
  userProfile: {
    display_name: string;
    avatar_url?: string;
  };
  onCommentCreated?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentCreator: React.FC<CommentCreatorProps> = ({
  postId,
  parentCommentId,
  userProfile,
  onCommentCreated,
  placeholder = "Write a comment...",
  autoFocus = false
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to comment",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
          parent_comment_id: parentCommentId || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });

      setContent('');
      onCommentCreated?.();
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={userProfile.avatar_url} />
        <AvatarFallback className="text-xs">
          {userProfile.display_name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
          disabled={isSubmitting}
          autoFocus={autoFocus}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!content.trim() || isSubmitting}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? 'Posting...' : 'Reply'}
          </Button>
        </div>
      </div>
    </form>
  );
};