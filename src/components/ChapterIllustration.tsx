
import React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';

interface ChapterIllustrationProps {
  chapterIndex: number;
  title: string;
  className?: string;
}

const chapterImages = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', // Java programming
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop', // Circuit board
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop', // Code on monitor
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop', // Matrix style
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop', // Starry night
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop', // Deer and mountain
  'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=600&fit=crop', // iMac setup
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', // MacBook with code
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop', // Mountain summit
];

export const ChapterIllustration: React.FC<ChapterIllustrationProps> = ({
  chapterIndex,
  title,
  className
}) => {
  const imageUrl = chapterImages[chapterIndex % chapterImages.length];
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <OptimizedImage
        src={imageUrl}
        alt={`Illustration for ${title}`}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        aspectRatio="video"
        lazy={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>
  );
};
