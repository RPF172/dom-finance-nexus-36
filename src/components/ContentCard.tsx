import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Target, CheckCircle, Lock, Calendar } from 'lucide-react';
import { MixedContentItem } from '@/hooks/useContentSequence';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Chapter } from '@/hooks/useChapters';
import { Lesson } from '@/hooks/useLessons';
import { format } from 'date-fns';

interface ContentCardProps {
  item: MixedContentItem;
  index: number;
  isLocked: boolean;
  isCompleted: boolean;
  progress?: number;
  onClick: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  index,
  isLocked,
  isCompleted,
  progress = 0,
  onClick
}) => {
  const isChapter = item.type === 'chapter';
  const content = item.content as Chapter | Lesson;
  
  const getEstimatedTime = () => {
    if (isChapter) {
      const chapter = content as Chapter;
      return Math.ceil((chapter.body_text?.length || 0) / 1000);
    } else {
      const lesson = content as Lesson;
      return lesson.estimated_time || 45;
    }
  };

  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e425?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&h=400&fit=crop'
    ];
    return fallbackImages[index % fallbackImages.length];
  };

  const getImageSrc = () => {
    return (content as any).featured_image_url || getFallbackImage();
  };

  const getCardBadge = () => {
    if (isChapter) {
      return <Badge variant="secondary" className="text-xs font-medium">Chapter</Badge>;
    } else {
      return <Badge variant="default" className="text-xs font-medium">Lesson</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Recently';
    }
  };

  return (
    <article 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden bg-card rounded-lg border ${
        isLocked ? 'opacity-60' : 'hover:scale-[1.01]'
      } ${isCompleted ? 'ring-2 ring-green-500/20' : ''}`}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Progress Bar */}
      {!isChapter && progress > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500 z-10" 
             style={{ width: `${progress}%` }} />
      )}

      {/* Featured Image - Always Show */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <OptimizedImage
          src={getImageSrc()}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={800}
          height={450}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {getCardBadge()}
          {isCompleted && (
            <Badge variant="outline" className="bg-green-500/90 text-white border-green-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
          {isLocked && (
            <Badge variant="outline" className="bg-muted/90 text-muted-foreground border-muted">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>

        {/* Reading Progress for Lessons */}
        {!isCompleted && !isLocked && progress > 0 && (
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-primary/90 text-primary-foreground border-primary">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate((content as any).created_at || new Date().toISOString())}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getEstimatedTime()} min read
            </div>
          </div>
          <span className="font-medium">#{index + 1}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {content.title}
        </h2>

        {/* Objective for Lessons */}
        {!isChapter && (content as Lesson).objective && (
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-sm font-medium text-foreground">
              Learning Objective
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {(content as Lesson).objective}
            </p>
          </div>
        )}

        {/* Content Preview */}
        {(isChapter ? (content as Chapter).body_text : (content as Lesson).body_text) && (
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {isChapter 
              ? (content as Chapter).body_text 
              : (content as Lesson).body_text
            }
          </p>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {isChapter ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                Reading
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="w-3 h-3" />
                Interactive Learning
              </div>
            )}
          </div>
          
          {!isLocked && (
            <div className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              {isCompleted ? 'Review' : 'Continue'} →
            </div>
          )}
        </div>
      </div>
    </article>
  );
};