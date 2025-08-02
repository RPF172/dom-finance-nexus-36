import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useImageUpload } from '@/hooks/useImageUpload';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdate: (url: string) => void;
  isOwner?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fallbackText?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarUpdate,
  isOwner = false,
  size = 'lg',
  fallbackText = 'User'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'avatars');
    if (url) {
      onAvatarUpdate(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} border-4 border-primary/20`}>
        <AvatarImage src={currentAvatar} alt="Avatar" />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
          {fallbackText.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {isOwner && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg border-2 bg-background"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            {uploading ? (
              <Upload className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
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