import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Plus } from "lucide-react";
import QuizManager from "./QuizManager";
import type { Module } from "@/hooks/useLessons";

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  objective: z.string().optional(),
  body_text: z.string().optional(),
  assignment_text: z.string().optional(),
  ritual_text: z.string().optional(),
  module_id: z.string().nullable().transform(val => val === "none" ? null : val),
  order_index: z.number().min(0),
  estimated_time: z.number().min(1).max(300),
  published: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

const LessonEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      slug: "",
      objective: "",
      body_text: "",
      assignment_text: "",
      ritual_text: "",
      module_id: "none",
      order_index: 0,
      estimated_time: 45,
      published: false,
    },
  });

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && !isEditing) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, isEditing]);

  // Fetch lesson data for editing
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Fetch modules for dropdown
  const { data: modules } = useQuery({
    queryKey: ['modules-for-editor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as Module[];
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (lesson && isEditing) {
      form.reset({
        title: lesson.title,
        slug: lesson.slug,
        objective: lesson.objective || "",
        body_text: lesson.body_text || "",
        assignment_text: lesson.assignment_text || "",
        ritual_text: lesson.ritual_text || "",
        module_id: lesson.module_id || "none",
        order_index: lesson.order_index,
        estimated_time: lesson.estimated_time || 45,
        published: lesson.published,
      });
    }
  }, [lesson, isEditing, form]);

  // Save lesson mutation
  const saveLessonMutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const lessonData = {
        title: data.title,
        slug: data.slug,
        objective: data.objective,
        body_text: data.body_text,
        assignment_text: data.assignment_text,
        ritual_text: data.ritual_text,
        module_id: data.module_id,
        order_index: data.order_index,
        estimated_time: data.estimated_time,
        published: data.published,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert(lessonData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Lesson updated" : "Lesson created",
        description: `The lesson has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      navigate('/admin/content');
    },
    onError: (error) => {
      console.error('Error saving lesson:', error);
      toast({
        title: "Error",
        description: "Failed to save lesson.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LessonFormData) => {
    saveLessonMutation.mutate(data);
  };

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing) return;

    const subscription = form.watch((data) => {
      // Debounced auto-save could be implemented here
    });
    return () => subscription.unsubscribe();
  }, [form, isEditing]);

  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/content')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Content
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Lesson' : 'Create New Lesson'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modify lesson content and settings' : 'Create engaging educational content'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="details">Lesson Details</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="quizzes" disabled={!isEditing}>
                  Quizzes {!isEditing && "(Save first)"}
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit" disabled={saveLessonMutation.isPending} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saveLessonMutation.isPending ? 'Saving...' : 'Save Lesson'}
                </Button>
              </div>
            </div>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter lesson title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="lesson-slug" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version of the title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Objective</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What will students learn from this lesson?"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="module_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "none"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select module" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Module</SelectItem>
                              {modules?.map((module) => (
                                <SelectItem key={module.id} value={module.id}>
                                  {module.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="order_index"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Index</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimated_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              max="300"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 45)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="body_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the main lesson content..."
                            className="min-h-[200px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The primary educational content for this lesson
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assignment_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignment Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter assignment instructions..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Tasks and exercises for students to complete
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ritual_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ritual Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter ritual instructions..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Special rituals or practices related to this lesson
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-6">
              {isEditing && id ? (
                <QuizManager lessonId={id} />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      Save the lesson first to manage quizzes
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Published
                          </FormLabel>
                          <FormDescription>
                            Make this lesson visible to students
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default LessonEditor;