import React, { useState } from 'react';
import { Plus, Edit, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChapterEditorModal } from './ChapterEditorModal';
import { ChapterListModal } from './ChapterListModal';
import { cn } from '@/lib/utils';

interface ChapterManagerFABProps {
  className?: string;
}

export const ChapterManagerFAB: React.FC<ChapterManagerFABProps> = ({ className }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNew = () => {
    setEditingChapter(null);
    setIsEditorOpen(true);
    setIsOpen(false);
  };

  const handleEditExisting = () => {
    setIsListOpen(true);
    setIsOpen(false);
  };

  const handleEditChapter = (chapter: any) => {
    setEditingChapter(chapter);
    setIsListOpen(false);
    setIsEditorOpen(true);
  };

  const handleEditorSave = () => {
    // Refresh any parent components if needed
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50",
        className
      )}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
                "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70",
                "border-2 border-accent/20 hover:border-accent/40",
                "group relative overflow-hidden"
              )}
            >
              <div className="relative z-10 flex items-center justify-center">
                {isOpen ? (
                  <Settings className="h-6 w-6 text-accent-foreground animate-spin" />
                ) : (
                  <BookOpen className="h-6 w-6 text-accent-foreground transition-transform group-hover:scale-110" />
                )}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="top"
            className="w-56 mb-2 bg-card/95 backdrop-blur-sm border border-accent/20"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-institutional uppercase tracking-wide text-accent">
                Chapter Manager
              </p>
              <p className="text-xs text-muted-foreground">
                Create and edit course chapters
              </p>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleCreateNew}
              className="gap-2 cursor-pointer hover:bg-accent/10 focus:bg-accent/10"
            >
              <Plus className="h-4 w-4 text-accent" />
              <span>Create New Chapter</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleEditExisting}
              className="gap-2 cursor-pointer hover:bg-accent/10 focus:bg-accent/10"
            >
              <Edit className="h-4 w-4 text-accent" />
              <span>Edit Existing Chapter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chapter Editor Modal */}
      <ChapterEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingChapter={editingChapter}
        onSave={handleEditorSave}
      />

      {/* Chapter List Modal */}
      <ChapterListModal
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        onEditChapter={handleEditChapter}
      />
    </>
  );
};