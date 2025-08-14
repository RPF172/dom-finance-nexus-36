-- Fix function search path security issues for the functions we just created
CREATE OR REPLACE FUNCTION public.calculate_week_progress_percentage(
  _user_id UUID,
  _week_id UUID
) RETURNS INTEGER
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  total_items INTEGER := 0;
  completed_items INTEGER := 0;
  week_data RECORD;
  progress_percentage INTEGER := 0;
BEGIN
  -- Get week totals
  SELECT total_modules, total_tasks, total_assignments, 
         (SELECT COUNT(*) FROM public.review_steps WHERE week_id = _week_id) as total_review_steps
  INTO week_data
  FROM public.weeks 
  WHERE id = _week_id;
  
  IF week_data IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculate total items
  total_items := COALESCE(week_data.total_modules, 0) + 
                 COALESCE(week_data.total_tasks, 0) + 
                 COALESCE(week_data.total_assignments, 0) +
                 COALESCE(week_data.total_review_steps, 0);
  
  IF total_items = 0 THEN
    RETURN 0;
  END IF;
  
  -- Count completed modules
  SELECT COUNT(*) INTO completed_items
  FROM public.module_progress mp
  JOIN public.week_modules wm ON mp.week_module_id = wm.id
  WHERE mp.user_id = _user_id AND wm.week_id = _week_id AND mp.completed = true;
  
  -- Count completed tasks
  SELECT completed_items + COUNT(*) INTO completed_items
  FROM public.submissions s
  JOIN public.tasks t ON s.task_id = t.id
  WHERE s.user_id = _user_id AND t.week_id = _week_id;
  
  -- Count completed assignments
  SELECT completed_items + COUNT(*) INTO completed_items
  FROM public.submissions s
  JOIN public.assignments a ON s.assignment_id = a.id
  WHERE s.user_id = _user_id AND a.week_id = _week_id;
  
  -- Count completed review steps
  SELECT completed_items + COUNT(*) INTO completed_items
  FROM public.step_progress sp
  JOIN public.review_steps rs ON sp.review_step_id = rs.id
  WHERE sp.user_id = _user_id AND rs.week_id = _week_id AND sp.completed = true;
  
  -- Calculate percentage
  progress_percentage := ROUND((completed_items::DECIMAL / total_items::DECIMAL) * 100);
  
  RETURN LEAST(progress_percentage, 100);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_week_progress(_user_id UUID, _week_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_progress INTEGER;
  week_data RECORD;
  modules_done INTEGER := 0;
  tasks_done INTEGER := 0;
  assignments_done INTEGER := 0;
  review_steps_done INTEGER := 0;
BEGIN
  -- Calculate current progress percentage
  current_progress := public.calculate_week_progress_percentage(_user_id, _week_id);
  
  -- Count completed items by type
  SELECT COUNT(*) INTO modules_done
  FROM public.module_progress mp
  JOIN public.week_modules wm ON mp.week_module_id = wm.id
  WHERE mp.user_id = _user_id AND wm.week_id = _week_id AND mp.completed = true;
  
  SELECT COUNT(*) INTO tasks_done
  FROM public.submissions s
  JOIN public.tasks t ON s.task_id = t.id
  WHERE s.user_id = _user_id AND t.week_id = _week_id;
  
  SELECT COUNT(*) INTO assignments_done
  FROM public.submissions s
  JOIN public.assignments a ON s.assignment_id = a.id
  WHERE s.user_id = _user_id AND a.week_id = _week_id;
  
  SELECT COUNT(*) INTO review_steps_done
  FROM public.step_progress sp
  JOIN public.review_steps rs ON sp.review_step_id = rs.id
  WHERE sp.user_id = _user_id AND rs.week_id = _week_id AND sp.completed = true;
  
  -- Upsert week progress
  INSERT INTO public.week_progress (
    user_id, 
    week_id, 
    progress_percentage,
    modules_completed,
    tasks_completed,
    assignments_completed,
    review_steps_completed,
    completed_at,
    last_activity_at,
    updated_at
  )
  VALUES (
    _user_id,
    _week_id,
    current_progress,
    modules_done,
    tasks_done,
    assignments_done,
    review_steps_done,
    CASE WHEN current_progress = 100 THEN now() ELSE NULL END,
    now(),
    now()
  )
  ON CONFLICT (user_id, week_id) 
  DO UPDATE SET
    progress_percentage = EXCLUDED.progress_percentage,
    modules_completed = EXCLUDED.modules_completed,
    tasks_completed = EXCLUDED.tasks_completed,
    assignments_completed = EXCLUDED.assignments_completed,
    review_steps_completed = EXCLUDED.review_steps_completed,
    completed_at = EXCLUDED.completed_at,
    last_activity_at = EXCLUDED.last_activity_at,
    updated_at = EXCLUDED.updated_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_update_week_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_week_id UUID;
  target_user_id UUID;
BEGIN
  -- Handle different trigger sources
  IF TG_TABLE_NAME = 'module_progress' THEN
    SELECT wm.week_id, NEW.user_id INTO target_week_id, target_user_id
    FROM public.week_modules wm 
    WHERE wm.id = NEW.week_module_id;
  ELSIF TG_TABLE_NAME = 'submissions' THEN
    target_user_id := NEW.user_id;
    IF NEW.task_id IS NOT NULL THEN
      SELECT t.week_id INTO target_week_id
      FROM public.tasks t WHERE t.id = NEW.task_id;
    ELSIF NEW.assignment_id IS NOT NULL THEN
      SELECT a.week_id INTO target_week_id
      FROM public.assignments a WHERE a.id = NEW.assignment_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'step_progress' THEN
    SELECT rs.week_id, NEW.user_id INTO target_week_id, target_user_id
    FROM public.review_steps rs 
    WHERE rs.id = NEW.review_step_id;
  END IF;
  
  -- Update week progress if we have valid IDs
  IF target_week_id IS NOT NULL AND target_user_id IS NOT NULL THEN
    PERFORM public.update_week_progress(target_user_id, target_week_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_week_prerequisites(_user_id UUID, _week_id UUID)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  prereq_week_id TEXT;
  prereq_weeks JSONB;
  is_prerequisite_met boolean := true;
BEGIN
  -- Get prerequisites for the week
  SELECT prerequisites INTO prereq_weeks
  FROM public.weeks
  WHERE id = _week_id;
  
  -- If no prerequisites, week is unlocked
  IF prereq_weeks IS NULL OR jsonb_array_length(prereq_weeks) = 0 THEN
    RETURN true;
  END IF;
  
  -- Check each prerequisite
  FOR prereq_week_id IN SELECT jsonb_array_elements_text(prereq_weeks)
  LOOP
    -- Check if prerequisite week is completed
    SELECT COALESCE(wp.progress_percentage = 100, false) INTO is_prerequisite_met
    FROM public.week_progress wp
    WHERE wp.user_id = _user_id 
      AND wp.week_id = prereq_week_id::UUID;
    
    -- If any prerequisite is not met, return false
    IF NOT is_prerequisite_met THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$;

-- Enable RLS on assignments table if not already enabled
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for assignments if they don't exist
DO $$
BEGIN
  -- Check if policies exist, if not create them
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'assignments' 
    AND policyname = 'Users can view their own assignments'
  ) THEN
    CREATE POLICY "Users can view their own assignments" 
    ON public.assignments 
    FOR SELECT 
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'assignments' 
    AND policyname = 'Admins can view all assignments'
  ) THEN
    CREATE POLICY "Admins can view all assignments" 
    ON public.assignments 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'assignments' 
    AND policyname = 'Admins can manage assignments'
  ) THEN
    CREATE POLICY "Admins can manage assignments" 
    ON public.assignments 
    FOR ALL 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END
$$;