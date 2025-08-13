-- Create storage policies for the magat bucket avatars folder
CREATE POLICY "Users can upload images to avatars folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'magat' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] = 'avatars'
);

CREATE POLICY "Anyone can view uploaded images in magat bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'magat');

CREATE POLICY "Users can update their own images in avatars folder" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'magat' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] = 'avatars'
);

CREATE POLICY "Users can delete their own images in avatars folder" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'magat' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] = 'avatars'
);