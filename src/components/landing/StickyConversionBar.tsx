import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, X, ArrowRight, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const StickyConversionBar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      
      const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setIsVisible(scrollPercentage > 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!isMobile || !isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 mobile-nav animate-slide-up">
      <div className="p-4 space-y-3">
        {/* Urgency badge */}
        <div className="text-center">
          <Badge className="bg-warning/20 text-warning border-warning/30 font-mono text-xs animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            LIMITED ENROLLMENT PERIOD
          </Badge>
        </div>

        {/* Main content */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-institutional text-sm text-foreground font-bold">
              BEGIN CONVERSION TODAY
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Join 12,000+ successfully converted
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate('/auth?enlist=1')}
              className="mobile-button-primary font-bold uppercase text-sm px-6 py-3"
            >
              <Shield className="h-4 w-4 mr-1" />
              ENLIST
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="h-10 w-10 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick value props */}
        <div className="flex justify-center gap-4 text-xs font-mono text-muted-foreground">
          <span>✓ No Credit Card</span>
          <span>✓ Instant Access</span>  
          <span>✓ 98% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default StickyConversionBar;