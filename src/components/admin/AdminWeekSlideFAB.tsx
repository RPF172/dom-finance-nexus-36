import React, { useState } from 'react';
import { Plus, Edit, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import WeekEditorModal from './WeekEditorModal';
import { SlideBuilder } from './SlideBuilder';
import { useWeekSlides } from '@/hooks/useWeekSlides';
import { useWeeks } from '@/hooks/useWeeks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminWeekSlideFABProps {
  currentModuleId?: string;
  onWeekCreated?: () => void;
}

export const AdminWeekSlideFAB: React.FC<AdminWeekSlideFABProps> = ({
  currentModuleId,
  onWeekCreated,
}) => {
  const { data: isAdmin } = useAdminCheck();
  const { data: weeksWithSlides } = useWeekSlides();
  const { data: allWeeks } = useWeeks();
  
  // Get available modules for slide editing
  const { data: availableModules } = useQuery({
    queryKey: ['available-modules-for-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, slug, has_slide_experience')
        .eq('published', true);
      
      if (error) throw error;
      return data;
    }
  });
  const [showWeekEditor, setShowWeekEditor] = useState(false);
  const [showSlideBuilder, setShowSlideBuilder] = useState(false);
  const [selectedWeekId, setSelectedWeekId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(currentModuleId || '');

  if (!isAdmin) return null;

  const selectedWeek = allWeeks?.find(w => w.id === selectedWeekId);
  const linkedModules = weeksWithSlides?.find(w => w.id === selectedWeekId)?.modules || [];

  const handleSlideBuilderOpen = () => {
    if (currentModuleId) {
      // Pre-select current module if on slide experience page
      setSelectedModuleId(currentModuleId);
      setShowSlideBuilder(true);
    } else {
      // Show week/module selection if on week list page
      setSelectedWeekId('');
      setSelectedModuleId('');
      setShowSlideBuilder(true);
    }
  };

  const canShowSlideBuilder = currentModuleId || (selectedModuleId && availableModules && availableModules.length > 0);

  return (
    <>
      <div className="fixed bottom-24 right-6 z-60 md:bottom-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg bg-card border border-border hover:bg-accent"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-card border border-border shadow-lg z-50"
          >
            <DropdownMenuItem onClick={() => setShowWeekEditor(true)}>
              <BookOpen className="w-4 h-4 mr-2" />
              Create Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSlideBuilderOpen}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Slides
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Week Editor Modal */}
      <WeekEditorModal
        isOpen={showWeekEditor}
        onClose={() => setShowWeekEditor(false)}
        onCreated={(weekId) => {
          setShowWeekEditor(false);
          onWeekCreated?.();
          // Auto-open slide builder with the newly created week
          setSelectedWeekId(weekId);
          setSelectedModuleId('');
          setShowSlideBuilder(true);
        }}
      />

      {/* Slide Builder Modal */}
      <Dialog open={showSlideBuilder} onOpenChange={setShowSlideBuilder}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Module Selection (only if not pre-selected) */}
            {!currentModuleId && (
              <div className="flex gap-4 mb-4 p-4 border-b">
                <Select value={selectedWeekId} onValueChange={setSelectedWeekId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Week" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    {allWeeks?.map(week => (
                      <SelectItem key={week.id} value={week.id}>
                        Week {week.week_number}: {week.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    {availableModules?.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Slide Builder */}
            {canShowSlideBuilder && (
              <div className="flex-1 overflow-hidden">
                <SlideBuilder moduleId={selectedModuleId} />
              </div>
            )}

            {!canShowSlideBuilder && !currentModuleId && (
              <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
                {!availableModules || availableModules.length === 0 
                  ? "No modules with slide experience available. Create a module with slide experience enabled first."
                  : "Please select a module to edit slides."
                }
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};