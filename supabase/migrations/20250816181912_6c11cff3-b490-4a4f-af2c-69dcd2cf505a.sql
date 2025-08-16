-- Create week_module_links table to connect weeks with modules
CREATE TABLE public.week_module_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id UUID NOT NULL,
  module_id UUID NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(week_id, module_id)
);

-- Enable RLS
ALTER TABLE public.week_module_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Week module links are viewable by everyone" 
ON public.week_module_links 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage week module links" 
ON public.week_module_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create view for week slides
CREATE VIEW public.week_slides_view AS
SELECT 
  w.id as week_id,
  w.week_number,
  w.title as week_title,
  w.description as week_description,
  m.id as module_id,
  m.title as module_title,
  m.slug as module_slug,
  ms.id as slide_id,
  ms.order_index as slide_order,
  ms.type as slide_type,
  ms.title as slide_title,
  ms.body as slide_body,
  ms.media_url as slide_media_url,
  ms.interactive_config as slide_interactive_config,
  ms.required as slide_required,
  wml.order_index as module_order
FROM weeks w
JOIN week_module_links wml ON w.id = wml.week_id
JOIN modules m ON wml.module_id = m.id AND m.published = true
JOIN module_slides ms ON m.id = ms.module_id
ORDER BY w.week_number, wml.order_index, ms.order_index;