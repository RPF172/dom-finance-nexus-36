-- Create collars table
CREATE TABLE public.collars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collar_id text NOT NULL UNIQUE,
  registered boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Collars are viewable by everyone" 
ON public.collars 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage collars" 
ON public.collars 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_collars_updated_at
BEFORE UPDATE ON public.collars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();