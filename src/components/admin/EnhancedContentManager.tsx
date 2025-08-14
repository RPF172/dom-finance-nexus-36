import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Edit, Save, Copy, History, Upload, FileText, 
  Video, Image, Link, Calendar, Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface EnhancedContentManagerProps {
  weekId: string;
  onSaved?: () => void;
}

interface ContentTemplate {
  id: string;
  name: string;
  type: 'module' | 'task' | 'assignment';
  template: {
    title: string;
    content: string;
    metadata: Record<string, any>;
  };
}

const contentTemplates: ContentTemplate[] = [
  {
    id: 'reading-module',
    name: 'Reading Module',
    type: 'module',
    template: {
      title: 'Week {week_number} Reading: {topic}',
      content: `## Learning Objectives
- Understand key concepts of {topic}
- Apply knowledge through practical examples
- Connect theory to real-world applications

## Content Overview
{content_overview}

## Key Points
1. {key_point_1}
2. {key_point_2}
3. {key_point_3}

## Summary
{summary}`,
      metadata: { estimated_time: 15, difficulty: 'beginner' }
    }
  },
  {
    id: 'practical-task',
    name: 'Practical Task',
    type: 'task',
    template: {
      title: 'Practice: {skill_name}',
      content: `## Task Description
{task_description}

## Instructions
1. {step_1}
2. {step_2}
3. {step_3}

## Success Criteria
- {criteria_1}
- {criteria_2}
- {criteria_3}

## Resources
- {resource_1}
- {resource_2}`,
      metadata: { estimated_time: 30, requires_submission: true }
    }
  },
  {
    id: 'assessment-assignment',
    name: 'Assessment Assignment',
    type: 'assignment',
    template: {
      title: 'Assignment: {assignment_name}',
      content: `## Assignment Overview
{overview}

## Requirements
{requirements}

## Deliverables
- {deliverable_1}
- {deliverable_2}
- {deliverable_3}

## Evaluation Criteria
{evaluation_criteria}

## Due Date
{due_date}`,
      metadata: { points: 100, requires_review: true }
    }
  }
];

export const EnhancedContentManager: React.FC<EnhancedContentManagerProps> = ({
  weekId,
  onSaved
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [contentType, setContentType] = useState<'module' | 'task' | 'assignment'>('module');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  
  const { uploadImage, uploading } = useImageUpload();

  const handleTemplateSelect = (templateId: string) => {
    const template = contentTemplates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.template.title);
      setContent(template.template.content);
      setMetadata(template.template.metadata);
      setContentType(template.type);
    }
    setSelectedTemplate(templateId);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, 'avatars');
      if (url) {
        setMediaUrl(url);
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let tableName = '';
      let data: Record<string, any> = {
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      switch (contentType) {
        case 'module':
          tableName = 'week_modules';
          data.week_id = weekId;
          data.content = content;
          break;
        case 'task':
          tableName = 'tasks';
          data.week_id = weekId;
          data.description = content;
          break;
        case 'assignment':
          tableName = 'assignments';
          data.week_id = weekId;
          data.description = content;
          data.objective = metadata.objective || '';
          data.instructions = content;
          data.user_id = user.id;
          data.status = 'pending';
          // Get week data for week_number
          const { data: weekData } = await supabase
            .from('weeks')
            .select('week_number')
            .eq('id', weekId)
            .single();
          data.week_number = weekData?.week_number || 1;
          data.module_number = 1;
          break;
      }

      // Add media URL if provided
      if (mediaUrl) {
        data.media_url = mediaUrl;
      }

      const { error } = await supabase.from(tableName as any).insert(data);

      if (error) throw error;

      // Create content version for tracking
      await supabase.from('content_versions').insert({
        content_id: data.id || '',
        content_type: contentType === 'module' ? 'week_module' : contentType,
        version_number: 1,
        title,
        content,
        metadata,
        created_by: user.id,
        is_active: true
      });

      toast.success(`${contentType} created successfully`);
      
      // Reset form
      setTitle('');
      setContent('');
      setMetadata({});
      setMediaUrl('');
      setSelectedTemplate('');
      
      onSaved?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to create ${contentType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertTemplate = (template: string) => {
    const newContent = content + (content ? '\n\n' : '') + template;
    setContent(newContent);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Enhanced Content Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Content</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="media">Media & Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select value={contentType} onValueChange={setContentType as any}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="module">Training Module</SelectItem>
                  <SelectItem value="task">Practice Task</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${contentType} title...`}
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertTemplate('## Section Title\n\nContent goes here...')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Section
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertTemplate('1. Step one\n2. Step two\n3. Step three')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Enter ${contentType} content... (Markdown supported)`}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            {/* Metadata */}
            {contentType === 'assignment' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Assignment Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Points</label>
                    <Input
                      type="number"
                      value={metadata.points || ''}
                      onChange={(e) => setMetadata(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Objective</label>
                    <Input
                      value={metadata.objective || ''}
                      onChange={(e) => setMetadata(prev => ({ ...prev, objective: e.target.value }))}
                      placeholder="Learning objective..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <label className="text-sm">Publish immediately</label>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => {
                  setTitle('');
                  setContent('');
                  setMetadata({});
                  setSelectedTemplate('');
                }}>
                  Clear
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading || !title.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : `Create ${contentType}`}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTemplate === template.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.template.title}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Upload Media</h4>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images, videos, or documents
                    </p>
                  </label>
                </div>
              </div>

              {mediaUrl && (
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Uploaded Media</h5>
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    <span className="text-sm font-mono">{mediaUrl}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(mediaUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Quick Insert</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertTemplate('![Image description](image-url)')}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertTemplate('[Video Title](video-url)')}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertTemplate('[Document Title](document-url)')}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Document
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInsertTemplate('[External Link](https://example.com)')}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};