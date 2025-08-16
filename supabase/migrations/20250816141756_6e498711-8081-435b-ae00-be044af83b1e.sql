-- Create module slides table
CREATE TABLE public.module_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('command', 'visual', 'instruction', 'interactive', 'checkpoint', 'final')),
  title TEXT NOT NULL,
  body TEXT,
  media_url TEXT,
  interactive_config JSONB DEFAULT '{}',
  required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create slide progress table
CREATE TABLE public.slide_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL,
  slide_id UUID NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slide_id)
);

-- Create slide submissions table
CREATE TABLE public.slide_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL,
  slide_id UUID NOT NULL,
  text_response TEXT,
  media_url TEXT,
  metadata JSONB DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add slide experience fields to modules
ALTER TABLE public.modules 
ADD COLUMN completion_points INTEGER DEFAULT 100,
ADD COLUMN has_slide_experience BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.module_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slide_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slide_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for module_slides
CREATE POLICY "Slides are viewable by everyone" 
ON public.module_slides 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage slides" 
ON public.module_slides 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for slide_progress
CREATE POLICY "Users can manage their own slide progress" 
ON public.slide_progress 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all slide progress" 
ON public.slide_progress 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for slide_submissions
CREATE POLICY "Users can manage their own slide submissions" 
ON public.slide_submissions 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all slide submissions" 
ON public.slide_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Function to finalize module completion
CREATE OR REPLACE FUNCTION public.finalize_module_completion(_user_id UUID, _module_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  module_points INTEGER;
  awarded_points INTEGER := 0;
  module_title TEXT;
BEGIN
  -- Check if already completed
  IF EXISTS (
    SELECT 1 FROM public.obedience_points_ledger 
    WHERE user_id = _user_id 
    AND action_type = 'module_complete' 
    AND action_key = _module_id::text
  ) THEN
    RETURN 0;
  END IF;
  
  -- Get module info
  SELECT completion_points, title INTO module_points, module_title
  FROM public.modules 
  WHERE id = _module_id;
  
  -- Award obedience points
  awarded_points := public.award_op(
    _user_id, 
    'module_complete', 
    _module_id::text, 
    COALESCE(module_points, 100), 
    1, 
    24, 
    jsonb_build_object('source', 'slide_experience', 'module_title', module_title)
  );
  
  RETURN awarded_points;
END;
$$;

-- Update timestamps trigger
CREATE TRIGGER update_module_slides_updated_at
BEFORE UPDATE ON public.module_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();