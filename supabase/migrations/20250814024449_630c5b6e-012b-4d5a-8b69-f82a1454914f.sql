-- Phase 2: Learning Analytics Integration

-- Create learning analytics tables
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_id UUID,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  activities_completed INTEGER DEFAULT 0,
  focus_score INTEGER, -- 1-100 rating
  device_type TEXT DEFAULT 'desktop',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.learning_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_id UUID,
  metric_type TEXT NOT NULL, -- 'time_spent', 'completion_rate', 'engagement_score', etc.
  metric_value DECIMAL NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL, -- 'week_module', 'task', 'assignment', 'review_step'
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_sessions
CREATE POLICY "Users can view their own learning sessions" 
ON public.learning_sessions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own learning sessions" 
ON public.learning_sessions FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own learning sessions" 
ON public.learning_sessions FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all learning sessions" 
ON public.learning_sessions FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for learning_analytics
CREATE POLICY "Users can view their own analytics" 
ON public.learning_analytics FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics" 
ON public.learning_analytics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" 
ON public.learning_analytics FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_versions
CREATE POLICY "Admins can manage content versions" 
ON public.content_versions FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Content versions are viewable by everyone" 
ON public.content_versions FOR SELECT 
USING (true);

-- Functions for learning analytics

CREATE OR REPLACE FUNCTION public.track_learning_session(
  _user_id UUID,
  _week_id UUID,
  _duration_minutes INTEGER,
  _activities_completed INTEGER DEFAULT 0,
  _focus_score INTEGER DEFAULT NULL,
  _device_type TEXT DEFAULT 'desktop'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO public.learning_sessions (
    user_id, week_id, duration_minutes, activities_completed, 
    focus_score, device_type, session_end
  )
  VALUES (
    _user_id, _week_id, _duration_minutes, _activities_completed,
    _focus_score, _device_type, now()
  )
  RETURNING id INTO session_id;
  
  -- Record analytics
  INSERT INTO public.learning_analytics (user_id, week_id, metric_type, metric_value, metadata)
  VALUES 
    (_user_id, _week_id, 'session_duration', _duration_minutes, jsonb_build_object('session_id', session_id)),
    (_user_id, _week_id, 'activities_completed', _activities_completed, jsonb_build_object('session_id', session_id));
  
  IF _focus_score IS NOT NULL THEN
    INSERT INTO public.learning_analytics (user_id, week_id, metric_type, metric_value, metadata)
    VALUES (_user_id, _week_id, 'focus_score', _focus_score, jsonb_build_object('session_id', session_id));
  END IF;
  
  RETURN session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_learning_insights(_user_id UUID, _days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  total_sessions BIGINT,
  total_minutes INTEGER,
  avg_session_duration DECIMAL,
  avg_focus_score DECIMAL,
  most_active_day TEXT,
  completion_rate DECIMAL,
  weekly_progress JSONB
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  WITH session_stats AS (
    SELECT 
      COUNT(*) as total_sessions,
      COALESCE(SUM(duration_minutes), 0) as total_minutes,
      COALESCE(AVG(duration_minutes), 0) as avg_duration,
      COALESCE(AVG(focus_score), 0) as avg_focus
    FROM public.learning_sessions
    WHERE user_id = _user_id 
      AND session_start >= now() - INTERVAL '1 day' * _days_back
  ),
  day_stats AS (
    SELECT 
      EXTRACT(DOW FROM session_start) as day_of_week,
      COUNT(*) as session_count
    FROM public.learning_sessions
    WHERE user_id = _user_id 
      AND session_start >= now() - INTERVAL '1 day' * _days_back
    GROUP BY EXTRACT(DOW FROM session_start)
    ORDER BY session_count DESC
    LIMIT 1
  ),
  progress_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE progress_percentage = 100) * 100.0 / NULLIF(COUNT(*), 0) as completion_rate
    FROM public.week_progress
    WHERE user_id = _user_id
  ),
  weekly_data AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'week', DATE_TRUNC('week', session_start),
        'sessions', COUNT(*),
        'minutes', COALESCE(SUM(duration_minutes), 0)
      )
    ) as weekly_progress
    FROM public.learning_sessions
    WHERE user_id = _user_id 
      AND session_start >= now() - INTERVAL '1 day' * _days_back
    GROUP BY DATE_TRUNC('week', session_start)
  )
  SELECT 
    ss.total_sessions,
    ss.total_minutes::INTEGER,
    ROUND(ss.avg_duration, 2),
    ROUND(ss.avg_focus, 2),
    CASE ds.day_of_week
      WHEN 0 THEN 'Sunday'
      WHEN 1 THEN 'Monday' 
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
    END as most_active_day,
    COALESCE(ROUND(ps.completion_rate, 2), 0),
    COALESCE(wd.weekly_progress, '[]'::jsonb)
  FROM session_stats ss
  CROSS JOIN day_stats ds
  CROSS JOIN progress_stats ps
  CROSS JOIN weekly_data wd;
END;
$$;

-- Triggers for automatic analytics tracking
CREATE OR REPLACE FUNCTION public.auto_track_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Track module completion analytics
  IF TG_TABLE_NAME = 'module_progress' AND NEW.completed = true THEN
    INSERT INTO public.learning_analytics (user_id, week_id, metric_type, metric_value, metadata)
    SELECT NEW.user_id, wm.week_id, 'module_completion', 1, 
           jsonb_build_object('module_id', NEW.week_module_id)
    FROM public.week_modules wm WHERE wm.id = NEW.week_module_id;
  END IF;
  
  -- Track submission analytics
  IF TG_TABLE_NAME = 'submissions' THEN
    IF NEW.task_id IS NOT NULL THEN
      INSERT INTO public.learning_analytics (user_id, week_id, metric_type, metric_value, metadata)
      SELECT NEW.user_id, t.week_id, 'task_submission', 1,
             jsonb_build_object('task_id', NEW.task_id, 'has_media', NEW.media_url IS NOT NULL)
      FROM public.tasks t WHERE t.id = NEW.task_id;
    END IF;
    
    IF NEW.assignment_id IS NOT NULL THEN
      INSERT INTO public.learning_analytics (user_id, week_id, metric_type, metric_value, metadata)
      SELECT NEW.user_id, a.week_id, 'assignment_submission', 1,
             jsonb_build_object('assignment_id', NEW.assignment_id, 'has_media', NEW.media_url IS NOT NULL)
      FROM public.assignments a WHERE a.id = NEW.assignment_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
CREATE TRIGGER track_module_analytics 
  AFTER INSERT OR UPDATE ON public.module_progress
  FOR EACH ROW EXECUTE FUNCTION public.auto_track_analytics();

CREATE TRIGGER track_submission_analytics 
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_track_analytics();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_date ON public.learning_sessions(user_id, session_start);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_week ON public.learning_analytics(user_id, week_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_content_versions_content ON public.content_versions(content_id, content_type, is_active);