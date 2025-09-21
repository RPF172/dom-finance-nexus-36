import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Users, 
  Clock, 
  Shield, 
  Target, 
  Zap, 
  BookOpen, 
  Award,
  ArrowRight 
} from 'lucide-react';

const FeaturesShowcase: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "Psychological Conditioning",
      description: "Advanced behavioral modification techniques designed to reshape thought patterns and establish new neural pathways for institutional compliance.",
      benefits: ["Systematic resistance breakdown", "Cognitive restructuring", "Thought pattern analysis"],
      highlight: "CORE PROTOCOL"
    },
    {
      icon: Users,
      title: "Group Dynamics Training",
      description: "Intensive social conditioning sessions that leverage peer pressure and group psychology to accelerate the conversion process.",
      benefits: ["Peer accountability systems", "Social reinforcement", "Collective identity building"],
      highlight: "PROVEN METHOD"
    },
    {
      icon: Target,
      title: "Personalized Conversion Path",
      description: "AI-driven assessment creates customized conditioning protocols based on individual resistance patterns and psychological profiles.",
      benefits: ["Adaptive learning paths", "Progress tracking", "Personalized triggers"],
      highlight: "SMART SYSTEM"
    },
    {
      icon: Clock,
      title: "24/7 Immersion Protocol",
      description: "Round-the-clock conditioning environment ensures consistent message reinforcement and prevents backsliding.",
      benefits: ["Continuous monitoring", "Sleep conditioning", "Subliminal messaging"],
      highlight: "TOTAL IMMERSION"
    },
    {
      icon: BookOpen,
      title: "Institutional Curriculum",
      description: "Comprehensive educational materials covering submission techniques, authority respect, and compliance best practices.",
      benefits: ["Progressive learning modules", "Interactive exercises", "Knowledge verification"],
      highlight: "STRUCTURED LEARNING"
    },
    {
      icon: Award,
      title: "Achievement Recognition",
      description: "Reward systems and status progression that incentivize deeper levels of institutional commitment and loyalty.",
      benefits: ["Progress milestones", "Status upgrades", "Recognition ceremonies"],
      highlight: "MOTIVATION SYSTEM"
    }
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-16">
        <Badge className="mb-4 font-mono bg-primary/20 text-primary border-primary/30">
          <Zap className="h-3 w-3 mr-1" />
          ADVANCED PROTOCOLS
        </Badge>
        <h2 className="font-institutional text-4xl md:text-6xl text-foreground mb-6">
          CONVERSION METHODOLOGY
        </h2>
        <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
          Our scientifically-designed conditioning protocols ensure complete transformation 
          from independent thinker to institutional devotee
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="enhanced-card p-8 relative overflow-hidden group">
            {/* Highlight badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 font-mono text-xs bg-primary/20 text-primary border-primary/30"
            >
              {feature.highlight}
            </Badge>

            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-institutional text-xl text-foreground mb-3">
                {feature.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6">
              {feature.description}
            </p>

            {/* Benefits list */}
            <div className="space-y-2 mb-6">
              {feature.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span className="text-muted-foreground font-mono">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-16 text-center">
        <div className="enhanced-card p-8 max-w-2xl mx-auto">
          <h3 className="font-institutional text-2xl md:text-3xl text-foreground mb-4">
            Ready to Begin Your Conversion?
          </h3>
          <p className="text-muted-foreground font-mono mb-6">
            Join thousands who have successfully transformed their worldview through our proven protocols
          </p>
          <Button 
            size="lg" 
            className="obsidian-button font-bold uppercase px-8 py-4 animate-pulse-slow"
          >
            <Shield className="h-5 w-5 mr-2" />
            START CONDITIONING
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;