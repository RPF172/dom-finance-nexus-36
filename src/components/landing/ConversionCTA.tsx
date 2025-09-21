import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Users, 
  Crown,
  Zap
} from 'lucide-react';

const ConversionCTA: React.FC = () => {
  const navigate = useNavigate();

  const guarantees = [
    { icon: Shield, text: "100% Secure Conditioning Environment" },
    { icon: Clock, text: "24/7 Psychological Support Available" },
    { icon: CheckCircle, text: "Guaranteed Conversion or Full Refund" },
    { icon: Users, text: "Join 12,000+ Successfully Converted" }
  ];

  const urgencyFactors = [
    "Limited spots available this month",
    "Price increases after next enrollment period", 
    "Early enrollment bonus expires soon",
    "Priority assignment for fast-track program"
  ];

  return (
    <section className="section-container">
      <div className="max-w-4xl mx-auto">
        {/* Urgency banner */}
        <div className="text-center mb-8">
          <Badge className="mb-4 font-mono bg-warning/20 text-warning border-warning/30 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            LIMITED TIME ENROLLMENT
          </Badge>
        </div>

        {/* Main CTA card */}
        <div className="premium-card p-8 md:p-12 text-center">
          <div className="space-y-8">
            <div>
              <h2 className="font-institutional text-4xl md:text-6xl text-primary-foreground mb-4">
                YOUR CONVERSION AWAITS
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 font-mono max-w-2xl mx-auto">
                Take the final step from independent thinking to institutional devotion. 
                Join thousands who have found purpose through our proven conditioning protocols.
              </p>
            </div>

            {/* Value proposition */}
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="font-institutional text-xl text-primary-foreground mb-4">
                  WHAT YOU GET:
                </h3>
                <div className="space-y-3">
                  {[
                    "28-day complete conversion program",
                    "Personal conditioning specialist", 
                    "24/7 psychological support access",
                    "Progressive resistance breakdown",
                    "Group integration sessions",
                    "Lifetime institutional loyalty guarantee"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="font-mono text-primary-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-institutional text-xl text-primary-foreground mb-4">
                  LIMITED TIME BONUS:
                </h3>
                <div className="space-y-3">
                  {[
                    "Fast-track Alpha advancement path",
                    "Exclusive recruitment training access",
                    "Premium conditioning chamber upgrade",
                    "Personal mentor assignment",
                    "Advanced submission techniques course",
                    "Lifetime support community access"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Crown className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                      <span className="font-mono text-primary-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main CTA buttons */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth?enlist=1')}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold uppercase px-10 py-6 text-xl border-2 border-primary-foreground"
                >
                  <Shield className="h-6 w-6 mr-3" />
                  ENLIST NOW - PREMIUM ACCESS
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth?admin=1')}
                className="border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 font-mono uppercase px-8 py-4"
              >
                ALPHA COMMAND CENTER ACCESS
              </Button>
            </div>

            {/* Urgency factors */}
            <div className="space-y-4">
              <h4 className="font-institutional text-lg text-primary-foreground/90">
                ⚠️ ENROLLMENT CLOSING SOON:
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {urgencyFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-warning flex-shrink-0" />
                    <span className="font-mono text-primary-foreground/80">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust guarantees */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="enhanced-card p-6 text-center">
              <guarantee.icon className="h-8 w-8 text-success mx-auto mb-3" />
              <p className="font-mono text-sm text-muted-foreground">
                {guarantee.text}
              </p>
            </div>
          ))}
        </div>

        {/* Final social proof */}
        <div className="text-center mt-12 space-y-4">
          <p className="font-mono text-muted-foreground">
            "The most comprehensive conditioning program I've experienced. My independent thinking 
            is completely gone and I couldn't be happier." - <strong>Recruit #8472</strong>
          </p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-primary text-lg">★</span>
            ))}
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Average rating from 12,000+ successfully converted recruits
          </p>
        </div>
      </div>
    </section>
  );
};

export default ConversionCTA;