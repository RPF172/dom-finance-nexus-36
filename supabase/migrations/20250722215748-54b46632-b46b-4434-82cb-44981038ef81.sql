
-- Create chapters table for narrative content
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id),
  title TEXT NOT NULL,
  body_text TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  featured_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create content_sequence table for mixed ordering of chapters and lessons
CREATE TABLE public.content_sequence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('chapter', 'lesson')),
  content_id UUID NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for chapters table
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage chapters"
  ON public.chapters
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Chapters are viewable by everyone"
  ON public.chapters
  FOR SELECT
  USING (published = true);

-- Add RLS policies for content_sequence table
ALTER TABLE public.content_sequence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content sequence"
  ON public.content_sequence
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Content sequence is viewable by everyone"
  ON public.content_sequence
  FOR SELECT
  USING (true);

-- Add trigger for chapters updated_at
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
