-- Create the dom_token table for investor signups
CREATE TABLE public.dom_token (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for the dom_token table
ALTER TABLE public.dom_token ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for investor signups)
CREATE POLICY "Anyone can signup for investor updates" 
  ON public.dom_token 
  FOR INSERT 
  WITH CHECK (true);