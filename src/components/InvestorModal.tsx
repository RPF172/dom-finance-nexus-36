
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';

interface InvestorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestorModal: React.FC<InvestorModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert into the new emails table
      const { error } = await supabase
        .from('emails')
        .insert([{ 
          email, 
          message: message || 'Email capture from landing page',
          source: 'investor_modal'
        }]);

      if (error) throw error;

      toast.success('🎉 Thank you for joining our community!');
      setEmail('');
      setMessage('');
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
      <DialogContent className="bg-background border border-border text-foreground max-w-md mx-4 sm:mx-auto rounded-xl shadow-2xl overflow-hidden">
        {/* Gradient Header */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-70" />
        
        <DialogHeader className="relative z-10 text-center space-y-4 pt-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Stay Connected
          </DialogTitle>
          
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Join our exclusive community and be the first to know about updates, insights, and opportunities.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6 relative z-10">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                required
              />
            </div>
            
            <div className="relative">
              <Textarea
                placeholder="Tell us what interests you most (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-h-[80px] resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-semibold transition-all duration-200 group relative overflow-hidden"
            disabled={isSubmitting}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Join the Community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By joining, you agree to receive occasional updates. We respect your privacy and you can unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestorModal;
