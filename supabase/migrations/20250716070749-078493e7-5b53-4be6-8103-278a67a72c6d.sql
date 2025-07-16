-- Create tributes table to track tribute payments
CREATE TABLE public.tributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,        -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'paid', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.tributes ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view their own tributes
CREATE POLICY "select_own_tributes" ON public.tributes
  FOR SELECT
  USING (user_id = auth.uid());

-- Create policies for edge functions to insert and update tributes
CREATE POLICY "insert_tribute" ON public.tributes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_tribute" ON public.tributes
  FOR UPDATE
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tributes_updated_at
  BEFORE UPDATE ON public.tributes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();