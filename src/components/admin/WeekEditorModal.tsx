import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface WeekEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const WeekEditorModal: React.FC<WeekEditorModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the week.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('weeks').insert({
        week_number: weekNumber,
        title: title.trim(),
        description: description.trim(),
      });

      if (error) throw error;

      toast({
        title: "Week Created",
        description: `Week ${weekNumber}: ${title} has been created successfully.`,
      });

      onCreated();
      onClose();
      
      // Reset form
      setWeekNumber(1);
      setTitle('');
      setDescription('');
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create week. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-institutional uppercase tracking-wider">
            Create New Week
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="weekNumber">Week Number</Label>
            <Input
              id="weekNumber"
              type="number"
              min={1}
              value={weekNumber}
              onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
              placeholder="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter week title..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter week description..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating...' : 'Create Week'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeekEditorModal;
