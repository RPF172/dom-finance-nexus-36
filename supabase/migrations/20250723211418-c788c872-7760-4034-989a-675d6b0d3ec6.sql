-- Create emails table for newsletter subscriptions and email captures
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT,
  source TEXT DEFAULT 'investor_modal',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert emails (for public signup)
CREATE POLICY "Anyone can signup for emails" 
ON public.emails 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all emails
CREATE POLICY "Admins can view all emails" 
ON public.emails 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON public.emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for email lookups
CREATE INDEX idx_emails_email ON public.emails(email);
CREATE INDEX idx_emails_created_at ON public.emails(created_at);