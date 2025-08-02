import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ContentSequenceItem {
  id: string;
  module_id: string;
  content_type: 'chapter' | 'lesson';
  content_id: string;
  sequence_order: number;
  title?: string;
}

interface ContentSequenceManagerProps {
  moduleId: string;
}

export const ContentSequenceManager: React.FC<ContentSequenceManagerProps> = ({ moduleId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sequence, setSequence] = useState<ContentSequenceItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Fetch sequence for module
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['content-sequence-admin', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_sequence')
        .select('*, chapters(title), lessons(title)')
        .eq('module_id', moduleId)
        .order('sequence_order');
      if (error) throw error;
      // Attach title for display
      return (data || []).map((item: any) => ({
        ...item,
        title: item.content_type === 'chapter' ? item.chapters?.title : item.lessons?.title
      }));
    },
    onSuccess: (data) => setSequence(data || [])
  });

  // Move item up/down
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newSequence = [...sequence];
    if (direction === 'up' && index > 0) {
      [newSequence[index - 1], newSequence[index]] = [newSequence[index], newSequence[index - 1]];
    } else if (direction === 'down' && index < newSequence.length - 1) {
      [newSequence[index], newSequence[index + 1]] = [newSequence[index + 1], newSequence[index]];
    }
    // Update sequence_order
    newSequence.forEach((item, idx) => (item.sequence_order = idx + 1));
    setSequence(newSequence);
    setIsDirty(true);
  };

  // Save new order
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Batch update sequence_order
      const updates = sequence.map(item =>
        supabase.from('content_sequence').update({ sequence_order: item.sequence_order }).eq('id', item.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      toast({ title: 'Sequence updated', description: 'Content order saved.' });
      setIsDirty(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['content-sequence'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save sequence.', variant: 'destructive' });
    }
  });

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Content Sequence Manager</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">Loading sequence...</div>
        ) : (
          <div className="space-y-2">
            {sequence.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2 border rounded p-2 bg-muted/10">
                <Badge variant="outline">{item.content_type}</Badge>
                <span className="flex-1 font-medium">{item.title || item.content_id}</span>
                <Button variant="ghost" size="sm" onClick={() => moveItem(idx, 'up')} disabled={idx === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => moveItem(idx, 'down')} disabled={idx === sequence.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">Order: {item.sequence_order}</span>
              </div>
            ))}
            <Button className="mt-4" onClick={() => saveMutation.mutate()} disabled={!isDirty || saveMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentSequenceManager;
