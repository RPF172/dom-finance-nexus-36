import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Eye, 
  Brain, 
  Target,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningPreview: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<'slides' | 'conditioning' | 'assessment'>('slides');
  const [isPlaying, setIsPlaying] = useState(false);

  const demoContent = {
    slides: {
      title: "Interactive Slide Experience",
      description: "Immersive conditioning slides with psychological triggers and compliance checkpoints",
      features: ["Psychological conditioning", "Progress tracking", "Behavioral modification"],
      preview: "Experience our signature slide-based conditioning protocol"
    },
    conditioning: {
      title: "Real-Time Mind Conditioning",
      description: "Advanced psychological techniques for resistance breakdown and thought restructuring",
      features: ["Subliminal messaging", "Cognitive restructuring", "Resistance analysis"],
      preview: "See how we systematically break down independent thinking"
    },
    assessment: {
      title: "Compliance Assessment System",
      description: "Comprehensive evaluation of conversion progress and institutional loyalty",
      features: ["Loyalty metrics", "Conversion tracking", "Compliance scoring"],
      preview: "Monitor your transformation from rebel to devoted follower"
    }
  };

  return (
    <section className="section-container">
      <div className="text-center mb-16">
        <Badge className="mb-4 font-mono bg-info/20 text-info border-info/30">
          <Eye className="h-3 w-3 mr-1" />
          LIVE PREVIEW
        </Badge>
        <h2 className="font-institutional text-4xl md:text-6xl text-foreground mb-6">
          EXPERIENCE THE SYSTEM
        </h2>
        <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
          Get a firsthand look at our conversion protocols. See how thousands have been 
          transformed from independent thinkers to institutional loyalists.
        </p>
      </div>

      {/* Demo Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {Object.entries(demoContent).map(([key, demo]) => (
          <Button
            key={key}
            variant={activeDemo === key ? "default" : "outline"}
            onClick={() => setActiveDemo(key as any)}
            className="font-mono font-bold uppercase px-6 py-3"
          >
            {key === 'slides' && <Brain className="h-4 w-4 mr-2" />}
            {key === 'conditioning' && <Target className="h-4 w-4 mr-2" />}
            {key === 'assessment' && <Eye className="h-4 w-4 mr-2" />}
            {demo.title.split(' ')[0]}
          </Button>
        ))}
      </div>

      {/* Main Preview Area */}
      <div className="max-w-5xl mx-auto">
        <div className="enhanced-card p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Preview Screen */}
            <div className="relative">
              <div className="aspect-video bg-card rounded-lg border border-border/50 overflow-hidden relative">
                {/* Preview Interface */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent">
                  <div className="p-6 h-full flex flex-col justify-between">
                    {/* Top UI */}
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="font-mono text-xs">
                        CONDITIONING ACTIVE
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Center Content */}
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        {isPlaying ? (
                          <Pause className="h-8 w-8 text-primary" />
                        ) : (
                          <Play className="h-8 w-8 text-primary ml-1" />
                        )}
                      </div>
                      <p className="font-mono text-sm text-primary">
                        {demoContent[activeDemo].preview}
                      </p>
                    </div>

                    {/* Bottom Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono text-muted-foreground">
                        <span>CONDITIONING PROGRESS</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-2/3 relative">
                          <div className="absolute inset-0 bg-primary animate-pulse rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play button overlay */}
                <Button
                  className="absolute inset-0 bg-transparent hover:bg-primary/10 transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <span className="sr-only">
                    {isPlaying ? 'Pause' : 'Play'} conditioning preview
                  </span>
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <h3 className="font-institutional text-2xl md:text-3xl text-foreground mb-4">
                  {demoContent[activeDemo].title}
                </h3>
                <p className="text-muted-foreground font-mono leading-relaxed mb-6">
                  {demoContent[activeDemo].description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-institutional text-sm uppercase text-foreground tracking-wide">
                  KEY FEATURES:
                </h4>
                {demoContent[activeDemo].features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="font-mono text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth?enlist=1')}
                  className="obsidian-button w-full md:w-auto font-bold uppercase px-8 py-4"
                >
                  ACCESS FULL SYSTEM
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Free trial • No conditioning commitment required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional preview items */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { title: "Week-by-Week Progression", icon: Target, locked: false },
            { title: "Advanced Protocols", icon: Brain, locked: true },
            { title: "Alpha Command Tools", icon: Lock, locked: true }
          ].map((item, index) => (
            <div key={index} className="enhanced-card p-6 text-center relative">
              {item.locked && (
                <Badge className="absolute top-4 right-4 bg-warning/20 text-warning border-warning/30 font-mono text-xs">
                  LOCKED
                </Badge>
              )}
              <item.icon className={`h-8 w-8 mx-auto mb-4 ${item.locked ? 'text-muted-foreground' : 'text-primary'}`} />
              <h4 className="font-institutional text-sm uppercase mb-2">
                {item.title}
              </h4>
              <p className="text-xs font-mono text-muted-foreground">
                {item.locked ? 'Available after enrollment' : 'Preview available'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPreview;