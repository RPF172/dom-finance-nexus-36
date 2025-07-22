-- Add featured_image_url column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN featured_image_url TEXT;