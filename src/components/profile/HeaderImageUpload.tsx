import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';

interface HeaderImageUploadProps {
  currentImage?: string;
  onImageUpdate: (url: string) => void;
  isOwner?: boolean;
}

export const HeaderImageUpload: React.FC<HeaderImageUploadProps> = ({
  currentImage,
  onImageUpdate,
  isOwner = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'headers');
    if (url) {
      onImageUpdate(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 overflow-hidden">
      {currentImage && (
        <img
          src={currentImage}
          alt="Profile header"
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {isOwner && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            {uploading ? (
              <Upload className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Change Header'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};