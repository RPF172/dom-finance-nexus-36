-- Create community challenges system
CREATE TABLE public.community_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'engagement',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  target_value INTEGER NOT NULL DEFAULT 100,
  reward_points INTEGER NOT NULL DEFAULT 50,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on community challenges
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;

-- Create challenge participants table
CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_progress INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS on challenge participants
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for community challenges
CREATE POLICY "Community challenges are viewable by everyone"
ON public.community_challenges FOR SELECT
USING (true);

CREATE POLICY "Admins can manage community challenges"
ON public.community_challenges FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for challenge participants
CREATE POLICY "Challenge participants are viewable by everyone"
ON public.challenge_participants FOR SELECT
USING (true);

CREATE POLICY "Users can join challenges"
ON public.challenge_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
ON public.challenge_participants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave challenges"
ON public.challenge_participants FOR DELETE
USING (auth.uid() = user_id);

-- Create activity aggregation view for the activity feed
CREATE OR REPLACE VIEW public.user_activities AS
SELECT 
  'obedience_points' as activity_type,
  opl.id,
  opl.user_id,
  opl.created_at as occurred_at,
  CASE 
    WHEN opl.action_type = 'post' THEN 'Created a post'
    WHEN opl.action_type = 'comment' THEN 'Added a comment'
    WHEN opl.action_type = 'read_doc' THEN 'Completed reading'
    WHEN opl.action_type = 'task_complete' THEN 'Completed a task'
    WHEN opl.action_type = 'assignment_complete' THEN 'Submitted assignment'
    WHEN opl.action_type = 'tribute_paid' THEN 'Made a tribute'
    ELSE 'Earned points'
  END as title,
  CONCAT('Earned ', opl.points, ' obedience points') as description,
  opl.points::TEXT as metadata
FROM public.obedience_points_ledger opl

UNION ALL

SELECT 
  'post' as activity_type,
  p.id,
  p.user_id,
  p.created_at as occurred_at,
  'Created a post' as title,
  COALESCE(SUBSTRING(p.content FROM 1 FOR 100), 'New post') as description,
  p.post_type::TEXT as metadata
FROM public.posts p

UNION ALL

SELECT 
  'learning_session' as activity_type,
  ls.id,
  ls.user_id,
  ls.session_start as occurred_at,
  'Completed learning session' as title,
  CONCAT('Studied for ', ls.duration_minutes, ' minutes') as description,
  ls.duration_minutes::TEXT as metadata  
FROM public.learning_sessions ls
WHERE ls.session_end IS NOT NULL

UNION ALL

SELECT 
  'connection' as activity_type,
  uc.id,
  uc.follower_id as user_id,
  uc.created_at as occurred_at,
  'Made a new connection' as title,
  'Connected with another user' as description,
  uc.status as metadata
FROM public.user_connections uc
WHERE uc.status = 'accepted'

ORDER BY occurred_at DESC;

-- Insert some sample community challenges
INSERT INTO public.community_challenges (title, description, type, difficulty, target_value, reward_points, end_date) VALUES
('Daily Engagement Challenge', 'Earn points through daily activities and participation', 'engagement', 'beginner', 100, 50, now() + interval '30 days'),
('Learning Marathon', 'Complete multiple learning sessions this month', 'learning', 'intermediate', 500, 150, now() + interval '30 days'),
('Social Butterfly', 'Create posts and engage with the community', 'social', 'beginner', 50, 75, now() + interval '14 days'),
('Master Submitter', 'Submit assignments and complete tasks', 'submission', 'advanced', 1000, 300, now() + interval '45 days');

-- Update timestamps trigger
CREATE TRIGGER update_community_challenges_updated_at
  BEFORE UPDATE ON public.community_challenges 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenge_participants_updated_at
  BEFORE UPDATE ON public.challenge_participants 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();