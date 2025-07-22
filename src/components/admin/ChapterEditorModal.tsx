import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, BookOpen, Target, FileText, Clock, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useModules } from '@/hooks/useLessons';
import { cn } from '@/lib/utils';

interface ChapterEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingChapter?: any | null;
  onSave: () => void;
}

export const ChapterEditorModal: React.FC<ChapterEditorModalProps> = ({
  isOpen,
  onClose,
  editingChapter,
  onSave
}) => {
  const { toast } = useToast();
  const { data: modules } = useModules();
  
  const [formData, setFormData] = useState({
    title: '',
    body_text: '',
    featured_image_url: '',
    module_id: '',
    order_index: 0,
    published: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or editing chapter changes
  useEffect(() => {
    if (isOpen) {
      if (editingChapter) {
        setFormData({
          title: editingChapter.title || '',
          body_text: editingChapter.body_text || '',
          featured_image_url: editingChapter.featured_image_url || '',
          module_id: editingChapter.module_id || '',
          order_index: editingChapter.order_index || 0,
          published: editingChapter.published || false
        });
      } else {
        setFormData({
          title: '',
          body_text: '',
          featured_image_url: '',
          module_id: modules?.[0]?.id || '',
          order_index: 0,
          published: false
        });
      }
      setErrors({});
    }
  }, [isOpen, editingChapter, modules]);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Chapter title is required';
    }

    if (!formData.body_text.trim()) {
      newErrors.body_text = 'Chapter content is required';
    }

    if (!formData.module_id) {
      newErrors.module_id = 'Module is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingChapter) {
        // Update existing chapter
        const { error } = await supabase
          .from('chapters')
          .update(formData)
          .eq('id', editingChapter.id);

        if (error) throw error;

        toast({
          title: "Chapter Updated",
          description: `"${formData.title}" has been updated successfully.`
        });
      } else {
        // Create new chapter
        const { error } = await supabase
          .from('chapters')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Chapter Created",
          description: `"${formData.title}" has been created successfully.`
        });
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving chapter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save chapter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingChapter) return;

    if (!confirm(`Are you sure you want to delete "${editingChapter.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', editingChapter.id);

      if (error) throw error;

      toast({
        title: "Chapter Deleted",
        description: `"${editingChapter.title}" has been deleted successfully.`
      });

      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error deleting chapter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete chapter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const wordCount = formData.body_text.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-institutional uppercase tracking-wide">
            <BookOpen className="h-5 w-5 text-accent" />
            {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <h3 className="font-institutional text-sm uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Basic Information
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Chapter Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter chapter title..."
                    className={cn(errors.title && "border-destructive")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image_url">Featured Image URL</Label>
                  <Input
                    id="featured_image_url"
                    value={formData.featured_image_url}
                    onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
                    placeholder="https://example.com/chapter-image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Image URL for the chapter illustration (optional)
                  </p>
                </div>

              </CardContent>
            </Card>

            {/* Chapter Content */}
            <Card>
              <CardHeader>
                <h3 className="font-institutional text-sm uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Chapter Content
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="body_text">Main Content *</Label>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{wordCount} words</span>
                      <span>~{readingTime} min read</span>
                    </div>
                  </div>
                  <Textarea
                    id="body_text"
                    value={formData.body_text}
                    onChange={(e) => handleInputChange('body_text', e.target.value)}
                    placeholder="Enter the main chapter content..."
                    rows={12}
                    className={cn(errors.body_text && "border-destructive")}
                  />
                  {errors.body_text && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.body_text}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Settings */}
            <Card>
              <CardHeader>
                <h3 className="font-institutional text-sm uppercase tracking-wide">
                  Publishing
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="published">Published</Label>
                    <p className="text-xs text-muted-foreground">
                      Make this chapter visible to students
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange('published', checked)}
                  />
                </div>

                {formData.published && (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Chapter is published and visible to students
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chapter Settings */}
            <Card>
              <CardHeader>
                <h3 className="font-institutional text-sm uppercase tracking-wide flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Settings
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="order_index">Chapter Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    min="0"
                    value={formData.order_index}
                    onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Determines the order of chapters (0 = first)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Stats */}
            {editingChapter && (
              <Card>
                <CardHeader>
                  <h3 className="font-institutional text-sm uppercase tracking-wide">
                    Chapter Stats
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Word Count:</span>
                    <Badge variant="outline">{wordCount}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reading Time:</span>
                    <Badge variant="outline">~{readingTime} min</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(editingChapter.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {editingChapter && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Chapter
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : editingChapter ? 'Update Chapter' : 'Create Chapter'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};