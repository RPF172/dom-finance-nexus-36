import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Crown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (plan: 'weekly' | 'annual') => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "8 comprehensive assignments",
    "16 detailed training modules", 
    "32 specialized tasks",
    "Progress tracking",
    "Unlimited access during subscription",
    "Premium support"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-institutional uppercase tracking-wide mb-2">
              Access Required
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground">
              Choose your subscription plan to unlock all MAGAT University content
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Weekly Plan */}
            <Card className="relative border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-semibold">Weekly Access</CardTitle>
                <CardDescription>Perfect for short-term commitment</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/week</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleSubscribe('weekly')}
                  disabled={isLoading}
                  className="w-full h-12 institutional-button"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Start Weekly Plan'
                  )}
                </Button>
                <ul className="space-y-2 text-sm">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="relative border-2 border-primary hover:border-primary transition-colors">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <CardHeader className="text-center pb-2 pt-6">
                <CardTitle className="text-xl font-semibold">One-Time Payment</CardTitle>
                <CardDescription>Complete access with one payment</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$79.99</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <div className="text-sm text-primary font-medium">
                  Save $439 compared to weekly!
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleSubscribe('annual')}
                  disabled={isLoading}
                  className="w-full h-12 institutional-button"
                  size="lg"
                  variant="default"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Get Annual Access'
                  )}
                </Button>
                <ul className="space-y-2 text-sm">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>All payments are processed securely through Stripe.</p>
            <p>You can cancel or modify your subscription at any time.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;