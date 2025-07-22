
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Play, CheckCircle, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChapterIllustration } from '@/components/ChapterIllustration';
import { ReadingProgressRing } from '@/components/ReadingProgressRing';
import { cn } from '@/lib/utils';

interface ChapterCardProps {
  lesson: any;
  index: number;
  status: 'locked' | 'in_progress' | 'complete';
  progress: number;
  estimatedTime?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const difficultyColors = {
  beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const statusIcons = {
  locked: <Lock className="h-5 w-5 text-muted-foreground" />,
  in_progress: <Play className="h-5 w-5 text-amber-500" />,
  complete: <CheckCircle className="h-5 w-5 text-emerald-500" />,
};

export const ChapterCard: React.FC<ChapterCardProps> = ({
  lesson,
  index,
  status,
  progress,
  estimatedTime = 15,
  difficulty = 'beginner'
}) => {
  const isLocked = status === 'locked';
  const isComplete = status === 'complete';
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        "border-2 bg-gradient-to-br from-card via-card to-card/80",
        isLocked && "opacity-60 hover:opacity-80",
        isComplete && "border-emerald-500/30 shadow-emerald-500/10",
        status === 'in_progress' && "border-accent/30 shadow-accent/10"
      )}
    >
      {/* Chapter Illustration */}
      <div className="relative h-48 sm:h-56">
        <ChapterIllustration
          chapterIndex={index}
          title={lesson.title}
          className="h-full"
        />
        
        {/* Status and Progress Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {status === 'in_progress' && progress > 0 && (
            <ReadingProgressRing progress={progress} size="sm" />
          )}
          <div className="p-2 bg-black/50 backdrop-blur-sm rounded-full">
            {statusIcons[status]}
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
            difficultyColors[difficulty]
          )}>
            <Star className="h-3 w-3 inline mr-1" />
            {difficulty.toUpperCase()}
          </div>
        </div>

        {/* Chapter Number Overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-mono text-sm font-bold">
            #{index + 1}
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title and Metadata */}
        <div className="space-y-2">
          <h3 className="font-institutional text-lg leading-tight uppercase tracking-wide group-hover:text-accent transition-colors">
            {lesson.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime} min</span>
            </div>
            <div className="text-xs">
              {status === 'complete' && '✓ Complete'}
              {status === 'in_progress' && `🔓 ${progress}% done`}
              {status === 'locked' && '🔒 Locked'}
            </div>
          </div>
        </div>

        {/* Objective Preview */}
        {lesson.objective && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {lesson.objective}
          </p>
        )}

        {/* Prerequisites Notice */}
        {status === 'locked' && index > 0 && (
          <div className="bg-muted/50 border border-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Complete the previous chapter to unlock
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {status === 'complete' ? (
            <Button 
              variant="outline" 
              className="w-full bg-emerald-950/30 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50"
              asChild
            >
              <Link to={`/lesson/${lesson.id}`}>REVIEW CHAPTER</Link>
            </Button>
          ) : status === 'in_progress' ? (
            <Button 
              className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
              asChild
            >
              <Link to={`/lesson/${lesson.id}`}>CONTINUE READING</Link>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="w-full border-muted-foreground/30 text-muted-foreground"
              disabled
            >
              COMPLETE PREVIOUS CHAPTER
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
