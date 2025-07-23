import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Code, FileText, BookOpen } from 'lucide-react';

const JsonQuickAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chapterJson, setChapterJson] = useState('');
  const [lessonJson, setLessonJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const chapterTemplate = {
    title: "Chapter Title",
    body_text: "Chapter content...",
    module_id: "uuid-here",
    order_index: 1,
    published: false,
    featured_image_url: "https://example.com/image.jpg"
  };

  const lessonTemplate = {
    title: "Lesson Title",
    slug: "lesson-slug",
    objective: "Learning objective...",
    body_text: "Lesson content...",
    assignment_text: "Assignment instructions...",
    ritual_text: "Ritual instructions...",
    module_id: "uuid-here",
    order_index: 1,
    estimated_time: 45,
    published: false,
    featured_image_url: "https://example.com/image.jpg"
  };

  React.useEffect(() => {
    if (isOpen) {
      setChapterJson(JSON.stringify(chapterTemplate, null, 2));
      setLessonJson(JSON.stringify(lessonTemplate, null, 2));
    }
  }, [isOpen]);

  const handleSubmit = async (type: 'chapter' | 'lesson') => {
    setIsSubmitting(true);
    try {
      const jsonData = type === 'chapter' ? chapterJson : lessonJson;
      const parsedData = JSON.parse(jsonData);
      
      const { error } = await supabase
        .from(type === 'chapter' ? 'chapters' : 'lessons')
        .insert([parsedData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${type === 'chapter' ? 'Chapter' : 'Lesson'} created successfully`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create content',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Code className="mr-2 h-4 w-4" />
          JSON Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Add Content via JSON</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="chapter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chapter" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Chapter
            </TabsTrigger>
            <TabsTrigger value="lesson" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Lesson
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chapter" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Chapter JSON Data</label>
              <Textarea
                value={chapterJson}
                onChange={(e) => setChapterJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter chapter JSON data..."
              />
            </div>
            <Button 
              onClick={() => handleSubmit('chapter')} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating Chapter...' : 'Create Chapter'}
            </Button>
          </TabsContent>
          
          <TabsContent value="lesson" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Lesson JSON Data</label>
              <Textarea
                value={lessonJson}
                onChange={(e) => setLessonJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter lesson JSON data..."
              />
            </div>
            <Button 
              onClick={() => handleSubmit('lesson')} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating Lesson...' : 'Create Lesson'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default JsonQuickAdd;