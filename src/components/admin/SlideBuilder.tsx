import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, GripVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SlideData {
  id?: string;
  type: 'command' | 'visual' | 'instruction' | 'interactive' | 'checkpoint' | 'final';
  title: string;
  body: string;
  media_url: string;
  interactive_config: Record<string, any>;
  required: boolean;
  order_index: number;
}

interface SlideBuilderProps {
  moduleId: string;
  onSave?: () => void;
}

const slideTypeTemplates = {
  command: {
    title: 'SUBMIT TO THE HIERARCHY',
    body: 'Your civilian identity is terminated.\nYou are now property of the Alpha collective.',
    interactive_config: {},
    required: false,
  },
  visual: {
    title: 'MARKED. OWNED. CONTROLLED.',
    body: 'Every collar tells a story of absolute surrender.',
    interactive_config: {},
    required: false,
  },
  instruction: {
    title: 'PROTOCOL COMPLIANCE',
    body: 'Address all Alphas as Sir or Master\nNever speak without permission\nMaintain proper posture at all times\nComplete all assigned tasks immediately',
    interactive_config: {},
    required: false,
  },
  interactive: {
    title: 'PROVE YOUR OBEDIENCE',
    body: 'Complete this task to demonstrate your commitment.',
    interactive_config: { task: 'repeat_text', text: 'I am property', times: 10 },
    required: true,
  },
  checkpoint: {
    title: 'PROGRESS ASSESSMENT',
    body: 'Your transformation is proceeding as expected. Continue with your indoctrination.',
    interactive_config: {},
    required: false,
  },
  final: {
    title: 'SEAL OF OBEDIENCE',
    body: 'Your indoctrination is complete.\nYou have proven your worth to the hierarchy.\nWelcome to your new existence.',
    interactive_config: {},
    required: false,
  },
};

export const SlideBuilder: React.FC<SlideBuilderProps> = ({ moduleId, onSave }) => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addSlide = (type: keyof typeof slideTypeTemplates) => {
    const template = slideTypeTemplates[type];
    const newSlide: SlideData = {
      type,
      title: template.title,
      body: template.body,
      media_url: '',
      interactive_config: template.interactive_config,
      required: template.required,
      order_index: slides.length,
    };
    setSlides([...slides, newSlide]);
  };

  const updateSlide = (index: number, updates: Partial<SlideData>) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], ...updates };
    setSlides(updatedSlides);
  };

  const removeSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index);
    // Reorder indices
    updatedSlides.forEach((slide, i) => {
      slide.order_index = i;
    });
    setSlides(updatedSlides);
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, movedSlide);
    
    // Reorder indices
    updatedSlides.forEach((slide, i) => {
      slide.order_index = i;
    });
    setSlides(updatedSlides);
  };

  const saveSlides = async () => {
    if (slides.length === 0) {
      toast({
        title: "No slides to save",
        description: "Add at least one slide before saving.",
        variant: "destructive",
      });
      return;
    }

    // Validation
    const hasFinalSlide = slides.some(slide => slide.type === 'final');
    if (!hasFinalSlide) {
      toast({
        title: "Missing final slide",
        description: "Each module must have exactly one final slide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First, delete existing slides for this module
      await supabase
        .from('module_slides')
        .delete()
        .eq('module_id', moduleId);

      // Insert new slides
      const { error } = await supabase
        .from('module_slides')
        .insert(slides.map(slide => ({
          module_id: moduleId,
          type: slide.type,
          title: slide.title,
          body: slide.body,
          media_url: slide.media_url || null,
          interactive_config: slide.interactive_config,
          required: slide.required,
          order_index: slide.order_index,
        })));

      if (error) throw error;

      // Enable slide experience for module
      await supabase
        .from('modules')
        .update({ has_slide_experience: true })
        .eq('id', moduleId);

      toast({
        title: "Slides saved successfully",
        description: `Created ${slides.length} slides for this module.`,
      });

      onSave?.();
    } catch (error) {
      console.error('Error saving slides:', error);
      toast({
        title: "Failed to save slides",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-institutional uppercase tracking-wider">
          Slide Builder
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={saveSlides} disabled={isLoading} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save All Slides'}
          </Button>
        </div>
      </div>

      {/* Add Slide Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Slide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(slideTypeTemplates).map(([type, template]) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addSlide(type as keyof typeof slideTypeTemplates)}
                className="h-auto p-3 flex flex-col items-start"
              >
                <Badge variant="secondary" className="mb-1 text-xs">
                  {type}
                </Badge>
                <span className="text-xs text-left font-normal">
                  {template.title.substring(0, 30)}...
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Badge variant={slide.type === 'final' ? 'destructive' : 'secondary'}>
                      {slide.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Slide {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSlide(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) => updateSlide(index, { title: e.target.value })}
                    placeholder="Slide title..."
                  />
                </div>
                
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={slide.body}
                    onChange={(e) => updateSlide(index, { body: e.target.value })}
                    placeholder="Slide content..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label>Media URL (optional)</Label>
                  <Input
                    value={slide.media_url}
                    onChange={(e) => updateSlide(index, { media_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                {slide.type === 'interactive' && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Interactive Configuration</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <Label className="text-xs">Task Type</Label>
                        <Select
                          value={slide.interactive_config.task || 'repeat_text'}
                          onValueChange={(value) => updateSlide(index, {
                            interactive_config: { ...slide.interactive_config, task: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="repeat_text">Repeat Text</SelectItem>
                            <SelectItem value="photo_upload">Photo Upload</SelectItem>
                            <SelectItem value="free_response">Free Response</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {slide.interactive_config.task === 'repeat_text' && (
                        <>
                          <div>
                            <Label className="text-xs">Text to Repeat</Label>
                            <Input
                              value={slide.interactive_config.text || ''}
                              onChange={(e) => updateSlide(index, {
                                interactive_config: { ...slide.interactive_config, text: e.target.value }
                              })}
                              placeholder="I am property"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Repetitions</Label>
                            <Input
                              type="number"
                              value={slide.interactive_config.times || 1}
                              onChange={(e) => updateSlide(index, {
                                interactive_config: { ...slide.interactive_config, times: parseInt(e.target.value) }
                              })}
                              min={1}
                              max={50}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={slide.required}
                    onCheckedChange={(checked) => updateSlide(index, { required: checked })}
                  />
                  <Label className="text-sm">Required for progression</Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No slides created yet</p>
          <p className="text-sm">Use the templates above to create your first slide</p>
        </div>
      )}
    </div>
  );
};