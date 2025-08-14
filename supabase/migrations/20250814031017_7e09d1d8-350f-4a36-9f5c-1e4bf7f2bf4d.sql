-- Create study groups table
CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  week_id UUID,
  max_members INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study group members table
CREATE TABLE IF NOT EXISTS public.study_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_group_id UUID NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(study_group_id, user_id)
);

-- Create peer discussions table
CREATE TABLE IF NOT EXISTS public.peer_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('week', 'lesson', 'chapter')),
  content_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discussion likes table
CREATE TABLE IF NOT EXISTS public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_groups
CREATE POLICY "Study groups are viewable by everyone" 
ON public.study_groups 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create study groups" 
ON public.study_groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their study groups" 
ON public.study_groups 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage study groups" 
ON public.study_groups 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for study_group_members
CREATE POLICY "Study group members are viewable by everyone" 
ON public.study_group_members 
FOR SELECT 
USING (true);

CREATE POLICY "Users can join study groups" 
ON public.study_group_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave study groups" 
ON public.study_group_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for peer_discussions
CREATE POLICY "Discussions are viewable by everyone" 
ON public.peer_discussions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create discussions" 
ON public.peer_discussions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" 
ON public.peer_discussions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions" 
ON public.peer_discussions 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for discussion_replies
CREATE POLICY "Discussion replies are viewable by everyone" 
ON public.discussion_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create replies" 
ON public.discussion_replies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" 
ON public.discussion_replies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" 
ON public.discussion_replies 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for discussion_likes
CREATE POLICY "Discussion likes are viewable by everyone" 
ON public.discussion_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.discussion_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers to update reply counts
CREATE OR REPLACE FUNCTION public.update_discussion_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.peer_discussions SET replies_count = replies_count + 1 WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.peer_discussions SET replies_count = replies_count - 1 WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discussion_replies_count_trigger
  AFTER INSERT OR DELETE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_discussion_replies_count();

-- Create triggers to update like counts
CREATE OR REPLACE FUNCTION public.update_discussion_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.peer_discussions SET likes_count = likes_count + 1 WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.peer_discussions SET likes_count = likes_count - 1 WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discussion_likes_count_trigger
  AFTER INSERT OR DELETE ON public.discussion_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_discussion_likes_count();

-- Create updated_at triggers
CREATE TRIGGER update_study_groups_updated_at
  BEFORE UPDATE ON public.study_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_discussions_updated_at
  BEFORE UPDATE ON public.peer_discussions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();