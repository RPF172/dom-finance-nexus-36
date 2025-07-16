-- Create post_type enum
CREATE TYPE public.post_type AS ENUM ('text', 'image', 'video', 'link');

-- Create privacy_level enum
CREATE TYPE public.privacy_level AS ENUM ('public', 'friends', 'private');

-- Enhanced profiles table (extending existing)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_color TEXT;

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type post_type NOT NULL DEFAULT 'text',
  privacy_level privacy_level NOT NULL DEFAULT 'public',
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  link_url TEXT,
  link_title TEXT,
  link_description TEXT,
  link_image_url TEXT,
  location TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_connections table
CREATE TABLE public.user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_user_premium_status(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(is_premium, false) FROM public.profiles WHERE profiles.user_id = $1;
$$;

CREATE OR REPLACE FUNCTION public.are_users_connected(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_connections 
    WHERE (follower_id = user1_id AND following_id = user2_id AND status = 'accepted')
       OR (follower_id = user2_id AND following_id = user1_id AND status = 'accepted')
  );
$$;

-- RLS Policies for posts
CREATE POLICY "Posts are viewable based on privacy" ON public.posts
  FOR SELECT USING (
    privacy_level = 'public' 
    OR user_id = auth.uid()
    OR (privacy_level = 'friends' AND public.are_users_connected(user_id, auth.uid()))
  );

CREATE POLICY "Users can create their own posts" ON public.posts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for post_likes
CREATE POLICY "Anyone can view likes" ON public.post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON public.post_likes
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for post_comments
CREATE POLICY "Anyone can view comments on visible posts" ON public.post_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_id 
      AND (
        posts.privacy_level = 'public'
        OR posts.user_id = auth.uid()
        OR (posts.privacy_level = 'friends' AND public.are_users_connected(posts.user_id, auth.uid()))
      )
    )
  );

CREATE POLICY "Users can create comments on visible posts" ON public.post_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_id 
      AND (
        posts.privacy_level = 'public'
        OR posts.user_id = auth.uid()
        OR (posts.privacy_level = 'friends' AND public.are_users_connected(posts.user_id, auth.uid()))
      )
    )
  );

CREATE POLICY "Users can update their own comments" ON public.post_comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.post_comments
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for user_connections
CREATE POLICY "Users can view their own connections" ON public.user_connections
  FOR SELECT USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can create connection requests" ON public.user_connections
  FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can update connections they're part of" ON public.user_connections
  FOR UPDATE USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can delete their own connections" ON public.user_connections
  FOR DELETE USING (follower_id = auth.uid() OR following_id = auth.uid());

-- Create triggers for updating counts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- Create trigger for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();