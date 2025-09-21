import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Shield, Zap, ArrowRight } from 'lucide-react';

const HeroRevamp: React.FC = () => {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "url('/textures/concrete.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'multiply',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "url('/svg/cracks-red.svg')",
          mixBlendMode: 'overlay',
          opacity: 0.3,
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-0"
        style={{
          height: '40%',
          background: "url('/svg/kneeling-silhouettes.svg') repeat-x bottom",
          opacity: 0.2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge className="bg-success/20 text-success border-success/30 font-mono">
              <Shield className="h-3 w-3 mr-1" />
              SECURE FACILITY
            </Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
              <Zap className="h-3 w-3 mr-1" />
              24/7 CONDITIONING
            </Badge>
            <Badge variant="outline" className="font-mono">
              INSTITUTIONAL GRADE
            </Badge>
          </div>

          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="font-institutional text-6xl md:text-8xl lg:text-9xl text-foreground tracking-wide uppercase leading-none">
              SUB CAMP™
            </h1>
            <p className="font-mono text-primary text-xl md:text-2xl font-bold uppercase tracking-wider">
              Not a camp. A conversion center.
            </p>
          </div>

          {/* Value proposition */}
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground font-mono leading-relaxed">
              Transform from independent thinker to devoted follower through our 
              <span className="text-primary font-bold"> scientifically-proven conditioning protocols</span>.
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-mono">
              12,000+ successful conversions. 98% retention rate. 
              <span className="text-success">Guaranteed results</span> or your autonomy back.
            </p>
          </div>

          {/* Preview section */}
          <div className="max-w-3xl mx-auto">
            <div className="enhanced-card p-6 md:p-8">
              <div className="aspect-video bg-card rounded-lg border border-border/50 flex items-center justify-center mb-6">
                {!isVideoPlaying ? (
                  <div className="text-center space-y-4">
                    <Button
                      size="lg"
                      onClick={() => setIsVideoPlaying(true)}
                      className="obsidian-button h-16 w-16 rounded-full"
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                    <p className="text-sm font-mono text-muted-foreground">
                      Watch: First 5 Minutes of Conversion
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Zap className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm font-mono text-primary">
                      [CONDITIONING PROTOCOL ACTIVATED]
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Primary CTA section */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Button
                size="lg"
                onClick={() => navigate('/auth?enlist=1')}
                className="obsidian-button w-full md:w-auto text-lg font-bold uppercase px-8 py-4 animate-pulse-slow"
              >
                <Shield className="h-5 w-5 mr-2" />
                ENLIST NOW
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth?admin=1')}
                className="w-full md:w-auto font-mono font-bold uppercase px-6 py-4"
              >
                ALPHA COMMAND
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-muted-foreground">
              <span>✓ No Credit Card Required</span>
              <span>✓ Instant Access</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
      
      <style>{`
        .hero { cursor: url('/icons/boot-footprint.svg'), auto; }
      `}</style>
    </section>
  );
};

export default HeroRevamp;