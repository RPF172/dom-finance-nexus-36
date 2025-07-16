
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface InvestorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestorModal: React.FC<InvestorModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [message] = useState('Let\'s talk.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('dom_token')
        .insert([{ email, message }]);

      if (error) throw error;

      toast.success('Thank you for your interest!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="bg-domtoken-obsidian border border-domtoken-slate/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel text-center text-domtoken-crimson">
            Ready to move this forward?
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-domtoken-slate/20 border-domtoken-slate/30 text-white placeholder:text-domtoken-silver/50"
              required
            />
          </div>
          <div>
            <Input
              type="text"
              value={message}
              disabled
              className="bg-domtoken-slate/20 border-domtoken-slate/30 text-domtoken-silver/80"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-domtoken-crimson hover:bg-domtoken-crimson/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestorModal;
