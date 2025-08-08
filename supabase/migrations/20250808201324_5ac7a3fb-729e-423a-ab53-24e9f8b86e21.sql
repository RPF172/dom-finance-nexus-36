-- 1) Create module_progress table
CREATE TABLE IF NOT EXISTS public.module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  week_module_id UUID NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT module_progress_user_module_unique UNIQUE (user_id, week_module_id)
);

-- Enable RLS
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY IF NOT EXISTS "Admins can view all module progress"
ON public.module_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY IF NOT EXISTS "Users can view their own module progress"
ON public.module_progress
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can insert their own module progress"
ON public.module_progress
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own module progress"
ON public.module_progress
FOR UPDATE
USING (user_id = auth.uid());

-- Trigger to keep updated_at fresh
DROP TRIGGER IF EXISTS update_module_progress_updated_at ON public.module_progress;
CREATE TRIGGER update_module_progress_updated_at
BEFORE UPDATE ON public.module_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Award OP when module is marked complete
CREATE OR REPLACE FUNCTION public.award_op_on_module_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.completed = true THEN
      PERFORM public.award_op(NEW.user_id, 'read_doc', NEW.week_module_id::text, 10, NULL, 24, jsonb_build_object('source','module_progress'));
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.completed = true AND COALESCE(OLD.completed,false) <> NEW.completed THEN
      PERFORM public.award_op(NEW.user_id, 'read_doc', NEW.week_module_id::text, 10, NULL, 24, jsonb_build_object('source','module_progress'));
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS award_op_on_module_progress_trigger ON public.module_progress;
CREATE TRIGGER award_op_on_module_progress_trigger
AFTER INSERT OR UPDATE ON public.module_progress
FOR EACH ROW
EXECUTE FUNCTION public.award_op_on_module_progress();