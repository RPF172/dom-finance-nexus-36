import React from 'react';
import { Edit, Eye, EyeOff, Clock, Target, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLessons } from '@/hooks/useLessons';
import { cn } from '@/lib/utils';

interface ChapterListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditChapter: (chapter: any) => void;
}

export const ChapterListModal: React.FC<ChapterListModalProps> = ({
  isOpen,
  onClose,
  onEditChapter
}) => {
  const { data: lessons, isLoading } = useLessons();

  // Sort lessons by order_index
  const sortedLessons = React.useMemo(() => {
    if (!lessons) return [];
    return [...lessons].sort((a, b) => a.order_index - b.order_index);
  }, [lessons]);

  const handleEditClick = (chapter: any) => {
    onEditChapter(chapter);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-institutional uppercase tracking-wide">
              Loading Chapters...
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-institutional uppercase tracking-wide flex items-center gap-2">
            <Edit className="h-5 w-5 text-accent" />
            Manage Chapters
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select a chapter to edit its content, settings, and publication status.
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {sortedLessons.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-institutional text-sm uppercase tracking-wide mb-2">
                      No Chapters Found
                    </h3>
                    <p className="text-sm">
                      Create your first chapter to get started with course content.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              sortedLessons.map((lesson, index) => (
                <Card 
                  key={lesson.id} 
                  className={cn(
                    "transition-all duration-200 hover:shadow-md hover:border-accent/30 cursor-pointer group",
                    lesson.published ? "border-emerald-800/30 bg-emerald-950/10" : "border-muted"
                  )}
                  onClick={() => handleEditClick(lesson)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Chapter Number */}
                      <div className="shrink-0">
                        <div className="w-8 h-8 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-mono font-bold text-accent">
                            {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Chapter Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-institutional text-base uppercase tracking-wide line-clamp-1 group-hover:text-accent transition-colors">
                            {lesson.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                        </div>

                        {lesson.objective && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {lesson.objective}
                          </p>
                        )}

                        {/* Chapter Metadata */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{lesson.estimated_time || 45} min</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {lesson.published ? (
                              <>
                                <Eye className="h-3 w-3 text-emerald-500" />
                                <span className="text-emerald-500">Published</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Draft</span>
                              </>
                            )}
                          </div>

                          {lesson.body_text && (
                            <Badge variant="outline" className="text-xs">
                              {lesson.body_text.split(/\s+/).length} words
                            </Badge>
                          )}
                        </div>

                        {/* Learning Elements */}
                        <div className="flex items-center gap-2">
                          {lesson.assignment_text && (
                            <Badge variant="secondary" className="text-xs">
                              Assignment
                            </Badge>
                          )}
                          {lesson.ritual_text && (
                            <Badge variant="secondary" className="text-xs">
                              Ritual
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};