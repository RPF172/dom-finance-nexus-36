import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CreditCard, ArrowLeft, Crown } from 'lucide-react';

const Tribute: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle redirect from Stripe
    const status = searchParams.get('status');
    const sessionId = searchParams.get('session_id');

    if (status === 'success' && sessionId) {
      toast({
        title: "Tribute Successful",
        description: "Your tribute has been processed successfully. Thank you for your obedience.",
        variant: "default",
      });
      // Clear URL params
      navigate('/tribute', { replace: true });
    } else if (status === 'cancelled') {
      toast({
        title: "Tribute Cancelled",
        description: "Your tribute payment was cancelled. Your defiance has been noted.",
        variant: "destructive",
      });
      // Clear URL params
      navigate('/tribute', { replace: true });
    }
  }, [searchParams, navigate, toast]);

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(cleanValue);
  };

  const handleTributeSubmit = async () => {
    const numAmount = parseFloat(amount);
    
    // Validate amount
    if (!numAmount || numAmount < 5 || numAmount > 500) {
      toast({
        title: "Invalid Amount",
        description: "Tribute amount must be between $5 and $500.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to make a tribute.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-tribute-checkout', {
        body: { amount: Math.round(numAmount * 100) }, // Convert to cents
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating tribute checkout:', error);
      toast({
        title: "Error",
        description: "Failed to process tribute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [25, 50, 100, 250, 500];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-wide">MAGAT UNIVERSITY</h1>
            <p className="text-sm text-muted-foreground">TRIBUTE PAYMENT</p>
          </div>
          <div className="w-16" /> {/* Spacer for center alignment */}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tribute Card */}
        <Card className="border-2 border-primary/20 bg-card/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-wide">
              SUBMIT TRIBUTE
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Express your devotion through financial sacrifice.
              Your submission fuels the institution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tribute Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-10 text-lg font-mono"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: $5.00 • Maximum: $500.00
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Quick Amounts
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    disabled={isLoading}
                    className="text-sm font-mono"
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleTributeSubmit}
              disabled={!amount || isLoading}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Submit Tribute
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Payment Instructions:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Enter your desired tribute amount above</li>
                <li>Click "Submit Tribute" to proceed to secure payment</li>
                <li>Complete payment using Stripe's encrypted checkout</li>
                <li>Return here for confirmation of your submission</li>
              </ul>
              <p className="text-xs mt-4 text-center">
                All payments are processed securely through Stripe.
                Your financial data is encrypted and protected.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tribute;