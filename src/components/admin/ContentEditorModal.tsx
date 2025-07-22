import React, { useState } from 'react';
import { BookOpen, GraduationCap, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChapterEditorModal } from './ChapterEditorModal';

import { cn } from '@/lib/utils';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'chapter' | 'lesson'>('chapter');
  const [isChapterEditorOpen, setIsChapterEditorOpen] = useState(false);

  const handleCreateChapter = () => {
    setIsChapterEditorOpen(true);
  };

  const handleChapterSave = () => {
    onSave();
    setIsChapterEditorOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 font-institutional uppercase tracking-wide">
                <BookOpen className="h-5 w-5 text-accent" />
                Content Creator
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Create chapters for narrative content or lessons for educational material
            </p>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chapter' | 'lesson')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="chapter" 
                className="flex items-center gap-2 data-[state=active]:bg-accent/20"
              >
                <BookOpen className="h-4 w-4" />
                Chapter Entry
              </TabsTrigger>
              <TabsTrigger 
                value="lesson"
                className="flex items-center gap-2 data-[state=active]:bg-accent/20"
              >
                <GraduationCap className="h-4 w-4" />
                Lesson Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chapter" className="space-y-4 h-[60vh] overflow-y-auto">
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Create Chapter</h3>
                  <p className="text-muted-foreground mb-4">
                    Chapters contain narrative content, story elements, and lore that advance the storyline.
                  </p>
                  <Button 
                    onClick={handleCreateChapter}
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create New Chapter
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lesson" className="space-y-4 h-[60vh] overflow-y-auto">
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Create Lesson</h3>
                  <p className="text-muted-foreground mb-4">
                    Lessons contain educational content, objectives, quizzes, assignments, and rituals for interactive learning.
                  </p>
                  <Button 
                    onClick={() => {
                      onClose();
                      // Navigate to lesson editor - we'll implement this routing
                      window.location.href = '/admin/content/lessons/new';
                    }}
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Create New Lesson
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Chapter Editor Modal */}
      <ChapterEditorModal
        isOpen={isChapterEditorOpen}
        onClose={() => setIsChapterEditorOpen(false)}
        editingChapter={null}
        onSave={handleChapterSave}
      />
    </>
  );
};