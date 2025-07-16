import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Eye, 
  Trash2,
  BookOpen,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Lesson, Module } from "@/hooks/useLessons";

const LessonList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: lessons, isLoading: lessonsLoading, refetch } = useQuery({
    queryKey: ['admin-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          modules (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Lesson & { modules: Pick<Module, 'id' | 'title'> })[];
    }
  });

  const { data: modules } = useQuery({
    queryKey: ['admin-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as Module[];
    }
  });

  const filteredLessons = lessons?.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase()) ||
                         lesson.objective?.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === "all" || lesson.module_id === moduleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && lesson.published) ||
                         (statusFilter === "draft" && !lesson.published);
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  const handleDuplicate = async (lesson: Lesson) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .insert({
          title: `${lesson.title} (Copy)`,
          slug: `${lesson.slug}-copy-${Date.now()}`,
          objective: lesson.objective,
          body_text: lesson.body_text,
          assignment_text: lesson.assignment_text,
          ritual_text: lesson.ritual_text,
          module_id: lesson.module_id,
          order_index: lesson.order_index + 1,
          estimated_time: lesson.estimated_time,
          published: false
        });

      if (error) throw error;

      toast({
        title: "Lesson duplicated",
        description: "The lesson has been successfully duplicated.",
      });
      refetch();
    } catch (error) {
      console.error('Error duplicating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate lesson.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Lesson deleted",
        description: "The lesson has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (lesson: Lesson) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ published: !lesson.published })
        .eq('id', lesson.id);

      if (error) throw error;

      toast({
        title: lesson.published ? "Lesson unpublished" : "Lesson published",
        description: `The lesson has been ${lesson.published ? 'unpublished' : 'published'}.`,
      });
      refetch();
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson status.",
        variant: "destructive",
      });
    }
  };

  if (lessonsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage lessons, modules, and educational content</p>
        </div>
        <Button onClick={() => navigate('/admin/content/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Lesson
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules?.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => navigate('/admin/content/modules')}>
              Manage Modules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lessons ({filteredLessons?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons?.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      {lesson.objective && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {lesson.objective}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lesson.modules?.title || 'No Module'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={lesson.published ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => togglePublished(lesson)}
                    >
                      {lesson.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{lesson.order_index}</TableCell>
                  <TableCell>{lesson.estimated_time || 45} min</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/content/edit/${lesson.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/lesson/${lesson.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(lesson)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(lesson.id)}
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
          
          {(!filteredLessons || filteredLessons.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              {lessons?.length === 0 ? 'No lessons found. Create your first lesson!' : 'No lessons match your filters.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonList;