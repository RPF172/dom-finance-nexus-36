-- Update the subscribers table to ensure it has all needed fields
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_price_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_amount INTEGER;

-- Update existing records to have proper status
UPDATE public.subscribers 
SET subscription_status = CASE 
  WHEN subscribed = true THEN 'active' 
  ELSE 'inactive' 
END
WHERE subscription_status IS NULL;