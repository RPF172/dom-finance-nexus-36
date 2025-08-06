import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('weeks').insert({
      week_number: weekNumber,
      title,
      description,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onCreated();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Week</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Week Number</label>
            <input type="number" min={1} value={weekNumber} onChange={e => setWeekNumber(Number(e.target.value))} className="input" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="input" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button onClick={handleCreate} disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Week'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeekEditorModal;
