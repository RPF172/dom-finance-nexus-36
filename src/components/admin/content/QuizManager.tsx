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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, HelpCircle } from "lucide-react";
import type { Quiz } from "@/hooks/useLessons";

const quizSchema = z.object({
  question: z.string().min(1, "Question is required"),
  type: z.enum(["multiple_choice", "true_false", "short_answer"]),
  options: z.array(z.string()).optional(),
  answer: z.union([z.string(), z.array(z.string()), z.boolean()]),
  explanation: z.string().optional(),
  order_index: z.number().min(0),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizManagerProps {
  lessonId: string;
}

const QuizManager = ({ lessonId }: QuizManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      answer: "",
      explanation: "",
      order_index: 0,
    },
  });

  const watchType = form.watch("type");
  const watchOptions = form.watch("options");

  // Fetch quizzes
  const { data: quizzes, isLoading, refetch } = useQuery({
    queryKey: ['lesson-quizzes', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');
      
      if (error) throw error;
      return data as Quiz[];
    }
  });

  // Create/Update quiz mutation
  const saveQuizMutation = useMutation({
    mutationFn: async (data: QuizFormData & { id?: string }) => {
      const quizData = {
        lesson_id: lessonId,
        question: data.question,
        type: data.type,
        options: data.type === 'multiple_choice' ? data.options : null,
        answer: data.answer,
        explanation: data.explanation,
        order_index: data.order_index,
      };

      if (data.id) {
        const { error } = await supabase
          .from('quizzes')
          .update(quizData)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quizzes')
          .insert(quizData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: editingQuiz ? "Quiz updated" : "Quiz created",
        description: `The quiz has been successfully ${editingQuiz ? 'updated' : 'created'}.`,
      });
      refetch();
      setDialogOpen(false);
      setEditingQuiz(null);
      form.reset();
    },
    onError: (error) => {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz.",
        variant: "destructive",
      });
    },
  });

  // Delete quiz mutation
  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Quiz deleted",
        description: "The quiz has been successfully deleted.",
      });
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    form.reset({
      question: quiz.question,
      type: quiz.type as any,
      options: quiz.options as string[] || ["", "", "", ""],
      answer: quiz.answer as any,
      explanation: quiz.explanation || "",
      order_index: quiz.order_index,
    });
    setDialogOpen(true);
  };

  const handleDelete = (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      deleteQuizMutation.mutate(quizId);
    }
  };

  const onSubmit = (data: QuizFormData) => {
    const submitData = { ...data, id: editingQuiz?.id };
    saveQuizMutation.mutate(submitData);
  };

  const addOption = () => {
    const currentOptions = form.getValues("options") || [];
    form.setValue("options", [...currentOptions, ""]);
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options") || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    form.setValue("options", newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = form.getValues("options") || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    form.setValue("options", newOptions);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Quiz Management
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create and manage quiz questions for this lesson
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => {
                  setEditingQuiz(null);
                  form.reset();
                }}>
                  <Plus className="h-4 w-4" />
                  Add Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuiz ? 'Edit Quiz Question' : 'Create Quiz Question'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingQuiz ? 'Modify the quiz question details' : 'Add a new quiz question to assess student understanding'}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="true_false">True/False</SelectItem>
                                <SelectItem value="short_answer">Short Answer</SelectItem>
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
                            <FormLabel>Order</FormLabel>
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
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your question..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchType === "multiple_choice" && (
                      <div className="space-y-2">
                        <FormLabel>Answer Options</FormLabel>
                        {watchOptions?.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                            />
                            {watchOptions.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                        >
                          Add Option
                        </Button>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correct Answer</FormLabel>
                          <FormControl>
                            {watchType === "multiple_choice" ? (
                              <Select onValueChange={field.onChange} value={field.value as string}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {watchOptions?.map((option, index) => (
                                    <SelectItem key={index} value={option}>
                                      {option || `Option ${index + 1}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : watchType === "true_false" ? (
                              <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value ? "true" : "false"}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Textarea 
                                placeholder="Enter the correct answer..."
                                {...field}
                                value={field.value as string}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="explanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Explanation (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Explain why this is the correct answer..."
                              className="min-h-[60px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
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
                      <Button type="submit" disabled={saveQuizMutation.isPending}>
                        {saveQuizMutation.isPending ? 'Saving...' : editingQuiz ? 'Update Quiz' : 'Create Quiz'}
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
          ) : quizzes && quizzes.length > 0 ? (
            <div className="space-y-4">
              {quizzes.map((quiz, index) => (
                <Card key={quiz.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {quiz.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Question {quiz.order_index + 1}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{quiz.question}</h4>
                        
                        {quiz.type === 'multiple_choice' && quiz.options && (
                          <div className="space-y-1 mb-2">
                            {(quiz.options as string[]).map((option, optionIndex) => (
                              <div key={optionIndex} className="text-sm text-muted-foreground">
                                {optionIndex + 1}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="font-medium text-green-600">Answer: </span>
                          <span>{String(quiz.answer)}</span>
                        </div>
                        
                        {quiz.explanation && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Explanation: </span>
                            {quiz.explanation}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(quiz.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No quiz questions created yet. Add your first quiz to test student understanding.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizManager;