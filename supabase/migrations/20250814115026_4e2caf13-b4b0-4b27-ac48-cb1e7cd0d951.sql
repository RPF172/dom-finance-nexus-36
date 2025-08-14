-- Create daily check-ins table
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_day INTEGER NOT NULL DEFAULT 1,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

-- Enable RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own check-ins" 
ON public.daily_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" 
ON public.daily_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle daily check-in logic
CREATE OR REPLACE FUNCTION public.handle_daily_checkin(_user_id uuid)
RETURNS TABLE(streak_day integer, points_awarded integer, is_new_checkin boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  last_checkin_date DATE;
  current_streak INTEGER := 1;
  points_to_award INTEGER;
  existing_checkin_today BOOLEAN := FALSE;
BEGIN
  -- Check if user already checked in today
  SELECT EXISTS (
    SELECT 1 FROM public.daily_checkins 
    WHERE user_id = _user_id AND check_in_date = CURRENT_DATE
  ) INTO existing_checkin_today;
  
  IF existing_checkin_today THEN
    -- Return existing check-in info
    SELECT dc.streak_day, dc.points_awarded, FALSE
    INTO streak_day, points_awarded, is_new_checkin
    FROM public.daily_checkins dc
    WHERE dc.user_id = _user_id AND dc.check_in_date = CURRENT_DATE;
    RETURN NEXT;
    RETURN;
  END IF;
  
  -- Get last check-in date
  SELECT check_in_date INTO last_checkin_date
  FROM public.daily_checkins
  WHERE user_id = _user_id
  ORDER BY check_in_date DESC
  LIMIT 1;
  
  -- Calculate streak
  IF last_checkin_date IS NULL THEN
    current_streak := 1;
  ELSIF last_checkin_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Continue streak
    SELECT MAX(dc.streak_day) + 1 INTO current_streak
    FROM public.daily_checkins dc
    WHERE dc.user_id = _user_id;
    
    -- Cap at 7 days, reset to 1 if over 7
    IF current_streak > 7 THEN
      current_streak := 1;
    END IF;
  ELSE
    -- Streak broken, start over
    current_streak := 1;
  END IF;
  
  -- Calculate points based on streak day
  CASE current_streak
    WHEN 1 THEN points_to_award := 5;
    WHEN 2 THEN points_to_award := 10;
    WHEN 3 THEN points_to_award := 20;
    WHEN 4 THEN points_to_award := 40;
    WHEN 5 THEN points_to_award := 80;
    WHEN 6 THEN points_to_award := 160;
    WHEN 7 THEN points_to_award := 320;
    ELSE points_to_award := 5;
  END CASE;
  
  -- Insert new check-in
  INSERT INTO public.daily_checkins (user_id, check_in_date, streak_day, points_awarded)
  VALUES (_user_id, CURRENT_DATE, current_streak, points_to_award);
  
  -- Award obedience points
  PERFORM public.award_op(_user_id, 'daily_checkin', CURRENT_DATE::text, points_to_award, 1, 24, 
    jsonb_build_object('source', 'daily_checkin', 'streak_day', current_streak));
  
  -- Return results
  streak_day := current_streak;
  points_awarded := points_to_award;
  is_new_checkin := TRUE;
  RETURN NEXT;
END;
$$;