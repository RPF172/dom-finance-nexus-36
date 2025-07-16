import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, VideoIcon, LinkIcon, MapPinIcon, EyeIcon, UsersIcon, LockIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostCreatorProps {
  userProfile: {
    display_name: string;
    avatar_url?: string;
  };
  onPostCreated?: () => void;
}

type PrivacyLevel = 'public' | 'friends' | 'private';

export const PostCreator: React.FC<PostCreatorProps> = ({ userProfile, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
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
          description: "You must be logged in to create a post",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          privacy_level: privacy,
          location: location.trim() || null,
          post_type: 'text'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      setContent('');
      setLocation('');
      setPrivacy('public');
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPrivacyIcon = (level: PrivacyLevel) => {
    switch (level) {
      case 'public':
        return <EyeIcon className="h-4 w-4" />;
      case 'friends':
        return <UsersIcon className="h-4 w-4" />;
      case 'private':
        return <LockIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile.avatar_url} />
              <AvatarFallback>
                {userProfile.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0"
                disabled={isSubmitting}
              />
              
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-0 text-sm text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center space-x-1">
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Select value={privacy} onValueChange={(value: PrivacyLevel) => setPrivacy(value)}>
                <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto">
                  <SelectValue>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      {getPrivacyIcon(privacy)}
                      <span className="capitalize">{privacy}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-4 w-4" />
                      <span>Public</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4" />
                      <span>Friends</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center space-x-2">
                      <LockIcon className="h-4 w-4" />
                      <span>Private</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button 
                type="submit" 
                disabled={!content.trim() || isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};