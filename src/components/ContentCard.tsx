import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Target, CheckCircle, Lock, Calendar } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface BaseContent {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

interface Chapter extends BaseContent {
  type: 'chapter';
  description?: string;
  order?: number;
  module_id?: string;
  published?: boolean;
}

interface Lesson extends BaseContent {
  type: 'lesson';
  objective?: string;
  body_text?: string;
  module_id?: string;
  order?: number;
  published?: boolean;
  featured_image_url?: string;
}

type MixedContentItem = Chapter | Lesson;

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
  const content = item;
  
  const getEstimatedTime = () => {
    if (isChapter) {
      return 15; // Default chapter reading time
    }
    const lesson = item as Lesson;
    return Math.max(3, Math.ceil((lesson.body_text?.length || 0) / 200));
  };

  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop'
    ];
    return fallbackImages[index % fallbackImages.length];
  };

  const getImageSrc = () => {
    if (isChapter) {
      return getFallbackImage();
    }
    const lesson = item as Lesson;
    return lesson.featured_image_url || getFallbackImage();
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
              {formatDate(content.created_at || new Date().toISOString())}
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
        {!isChapter && (item as Lesson).objective && (
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-sm font-medium text-foreground">
              Learning Objective
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {(item as Lesson).objective}
            </p>
          </div>
        )}

        {/* Description for Chapters */}
        {isChapter && (item as Chapter).description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {(item as Chapter).description}
          </p>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {isCompleted ? (
            <Button 
              variant="outline" 
              className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Review {isChapter ? 'Chapter' : 'Lesson'}
            </Button>
          ) : isLocked ? (
            <Button 
              variant="outline" 
              className="w-full border-muted-foreground/30 text-muted-foreground"
              disabled
            >
              <Lock className="w-4 h-4 mr-2" />
              Complete Previous {isChapter ? 'Chapter' : 'Lesson'}
            </Button>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start {isChapter ? 'Chapter' : 'Lesson'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};