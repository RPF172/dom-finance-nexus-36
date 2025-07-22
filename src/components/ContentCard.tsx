import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Target, CheckCircle, Lock } from 'lucide-react';
import { MixedContentItem } from '@/hooks/useContentSequence';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Chapter } from '@/hooks/useChapters';
import { Lesson } from '@/hooks/useLessons';

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

  const getCardIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isLocked) return <Lock className="w-5 h-5 text-muted-foreground" />;
    return isChapter ? <BookOpen className="w-5 h-5" /> : <Target className="w-5 h-5" />;
  };

  const getCardBadge = () => {
    if (isChapter) {
      return <Badge variant="secondary" className="text-xs">Chapter</Badge>;
    } else {
      return <Badge variant="default" className="text-xs">Lesson</Badge>;
    }
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
        isLocked ? 'opacity-60' : 'hover:scale-[1.02]'
      } ${isCompleted ? 'ring-2 ring-green-500/20' : ''}`}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Progress Bar */}
      {!isChapter && progress > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500" 
             style={{ width: `${progress}%` }} />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              {getCardIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getCardBadge()}
                <span className="text-xs text-muted-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {content.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {(content as any).featured_image_url && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
            <OptimizedImage
              src={(content as any).featured_image_url}
              alt={content.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              width={400}
              height={200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Content Preview */}
        <div className="space-y-3">
          {!isChapter && (content as Lesson).objective && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              <span className="font-medium">Objective:</span> {(content as Lesson).objective}
            </p>
          )}
          
          {(isChapter ? (content as Chapter).body_text : (content as Lesson).body_text) && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {isChapter 
                ? (content as Chapter).body_text 
                : (content as Lesson).body_text
              }
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getEstimatedTime()} min
            </div>
            {!isChapter && (
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Learning
              </div>
            )}
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              Complete
            </div>
          )}
          
          {!isCompleted && !isLocked && progress > 0 && (
            <div className="text-xs text-primary font-medium">
              {Math.round(progress)}% Complete
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};