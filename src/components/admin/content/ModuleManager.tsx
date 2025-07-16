import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, MoreHorizontal, BookOpen, Users } from "lucide-react";
import type { Module } from "@/hooks/useLessons";

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  year_id: z.string().min(1, "Year ID is required"),
  order_index: z.number().min(0),
  published: z.boolean(),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

const ModuleManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      year_id: "2024",
      order_index: 0,
      published: false,
    },
  });

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  React.useEffect(() => {
    if (watchTitle && !editingModule) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, editingModule]);

  // Fetch modules with lesson counts
  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ['admin-modules-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (count)
        `)
        .order('order_index');
      
      if (error) throw error;
      return data as (Module & { lessons: { count: number }[] })[];
    }
  });

  // Create/Update module mutation
  const saveModuleMutation = useMutation({
    mutationFn: async (data: ModuleFormData & { id?: string }) => {
      const moduleData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        year_id: data.year_id,
        order_index: data.order_index,
        published: data.published,
      };

      if (data.id) {
        const { error } = await supabase
          .from('modules')
          .update(moduleData)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('modules')
          .insert(moduleData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: editingModule ? "Module updated" : "Module created",
        description: `The module has been successfully ${editingModule ? 'updated' : 'created'}.`,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      setDialogOpen(false);
      setEditingModule(null);
      form.reset();
    },
    onError: (error) => {
      console.error('Error saving module:', error);
      toast({
        title: "Error",
        description: "Failed to save module.",
        variant: "destructive",
      });
    },
  });

  // Delete module mutation
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Module deleted",
        description: "The module has been successfully deleted.",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    },
    onError: (error) => {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: "Failed to delete module.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    form.reset({
      title: module.title,
      slug: module.slug,
      description: module.description || "",
      year_id: module.year_id,
      order_index: module.order_index,
      published: module.published,
    });
    setDialogOpen(true);
  };

  const handleDelete = (moduleId: string, lessonCount: number) => {
    if (lessonCount > 0) {
      toast({
        title: "Cannot delete module",
        description: "This module contains lessons. Delete all lessons first.",
        variant: "destructive",
      });
      return;
    }

    if (confirm("Are you sure you want to delete this module?")) {
      deleteModuleMutation.mutate(moduleId);
    }
  };

  const onSubmit = (data: ModuleFormData) => {
    const submitData = { ...data, id: editingModule?.id };
    saveModuleMutation.mutate(submitData);
  };

  const togglePublished = async (module: Module) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update({ published: !module.published })
        .eq('id', module.id);

      if (error) throw error;

      toast({
        title: module.published ? "Module unpublished" : "Module published",
        description: `The module has been ${module.published ? 'unpublished' : 'published'}.`,
      });
      refetch();
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: "Failed to update module status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Module Management
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Organize lessons into modules and manage curriculum structure
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => {
                  setEditingModule(null);
                  form.reset();
                }}>
                  <Plus className="h-4 w-4" />
                  New Module
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingModule ? 'Edit Module' : 'Create New Module'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingModule ? 'Modify module details and settings' : 'Create a new module to organize your lessons'}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Module title" {...field} />
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
                              <Input placeholder="module-slug" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Module description..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="year_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year ID</FormLabel>
                            <FormControl>
                              <Input placeholder="2024" {...field} />
                            </FormControl>
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
                    </div>

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
                              Make this module visible to students
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

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saveModuleMutation.isPending}>
                        {saveModuleMutation.isPending ? 'Saving...' : editingModule ? 'Update Module' : 'Create Module'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Lessons
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules?.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>
                      <div className="font-medium">{module.title}</div>
                      <div className="text-sm text-muted-foreground">{module.slug}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {module.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{module.year_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={module.published ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => togglePublished(module)}
                      >
                        {module.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{module.order_index}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {module.lessons?.[0]?.count || 0} lessons
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(module)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(module.id, module.lessons?.[0]?.count || 0)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {(!modules || modules.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No modules found. Create your first module to organize lessons.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleManager;