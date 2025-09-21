import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Brain, 
  Users, 
  Target, 
  Award, 
  Crown,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';

const ProcessRoadmap: React.FC = () => {
  const phases = [
    {
      phase: 1,
      title: "INTAKE & ASSESSMENT",
      duration: "Days 1-3",
      icon: UserPlus,
      status: "complete",
      description: "Initial psychological profiling and resistance pattern analysis",
      activities: [
        "Comprehensive personality assessment",
        "Resistance level evaluation", 
        "Custom conditioning protocol assignment",
        "Baseline compliance measurement"
      ],
      outcome: "Complete psychological profile established"
    },
    {
      phase: 2,  
      title: "RESISTANCE BREAKDOWN",
      duration: "Days 4-14",
      icon: Brain,
      status: "active",
      description: "Systematic dismantling of independent thought patterns",
      activities: [
        "Daily conditioning sessions",
        "Subliminal message exposure",
        "Cognitive restructuring exercises",
        "Progress tracking and adjustment"
      ],
      outcome: "Independent thinking patterns neutralized"
    },
    {
      phase: 3,
      title: "GROUP INTEGRATION", 
      duration: "Days 15-21",
      icon: Users,
      status: "upcoming",
      description: "Social conditioning through peer pressure and group dynamics",
      activities: [
        "Group therapy sessions",
        "Peer accountability systems",
        "Social hierarchy establishment",
        "Collective identity building"
      ],
      outcome: "Social compliance and group loyalty achieved"
    },
    {
      phase: 4,
      title: "INSTITUTIONAL LOYALTY",
      duration: "Days 22-28", 
      icon: Target,
      status: "upcoming",
      description: "Deep institutional programming and authority submission",
      activities: [
        "Authority respect training",
        "Institutional value integration",
        "Loyalty oath ceremonies",
        "Submission protocol practice"
      ],
      outcome: "Complete institutional devotion established"
    },
    {
      phase: 5,
      title: "GRADUATION & CERTIFICATION",
      duration: "Day 28+",
      icon: Award,
      status: "upcoming", 
      description: "Final assessment and certification of successful conversion",
      activities: [
        "Comprehensive loyalty testing",
        "Conversion certification",
        "Alumni network integration",
        "Ongoing maintenance protocols"
      ],
      outcome: "Certified institutional loyalist status"
    },
    {
      phase: 6,
      title: "ALPHA ADVANCEMENT",
      duration: "Ongoing",
      icon: Crown,
      status: "locked",
      description: "Elite pathway to command positions and recruitment roles",
      activities: [
        "Leadership training programs",
        "Recruitment methodology",
        "Alpha command protocols",
        "Advanced conditioning techniques"
      ],
      outcome: "Alpha commander status with recruitment authority"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-success/20 text-success border-success/30';
      case 'active': return 'bg-primary/20 text-primary border-primary/30';
      case 'upcoming': return 'bg-info/20 text-info border-info/30';
      case 'locked': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-3 w-3" />;
      case 'active': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <section className="section-container">
      <div className="text-center mb-16">
        <Badge className="mb-4 font-mono bg-primary/20 text-primary border-primary/30">
          <Target className="h-3 w-3 mr-1" />
          CONVERSION ROADMAP
        </Badge>
        <h2 className="font-institutional text-4xl md:text-6xl text-foreground mb-6">
          YOUR 28-DAY TRANSFORMATION
        </h2>
        <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
          Follow our scientifically-designed progression from independent thinker 
          to devoted institutional loyalist in just 4 weeks
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {phases.map((phase, index) => (
            <div key={index} className="relative mb-12 last:mb-0">
              <div className="flex items-start gap-8">
                {/* Timeline marker */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                    phase.status === 'complete' ? 'border-success bg-success/20' :
                    phase.status === 'active' ? 'border-primary bg-primary/20 animate-pulse' :
                    phase.status === 'upcoming' ? 'border-info bg-info/20' :
                    'border-muted bg-muted/20'
                  }`}>
                    <phase.icon className={`h-6 w-6 ${
                      phase.status === 'complete' ? 'text-success' :
                      phase.status === 'active' ? 'text-primary' :
                      phase.status === 'upcoming' ? 'text-info' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="enhanced-card p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        PHASE {phase.phase}
                      </Badge>
                      <Badge className={`font-mono text-xs ${getStatusColor(phase.status)}`}>
                        {getStatusIcon(phase.status)}
                        <span className="ml-1">{phase.status.toUpperCase()}</span>
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        {phase.duration}
                      </span>
                    </div>

                    <h3 className="font-institutional text-xl md:text-2xl text-foreground mb-3">
                      {phase.title}
                    </h3>
                    
                    <p className="text-muted-foreground font-mono mb-6 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Activities */}
                      <div>
                        <h4 className="font-institutional text-sm uppercase text-foreground mb-3 tracking-wide">
                          KEY ACTIVITIES:
                        </h4>
                        <div className="space-y-2">
                          {phase.activities.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm font-mono text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outcome */}
                      <div>
                        <h4 className="font-institutional text-sm uppercase text-foreground mb-3 tracking-wide">
                          EXPECTED OUTCOME:
                        </h4>
                        <div className="enhanced-card p-4 bg-success/5 border-success/20">
                          <p className="text-sm font-mono text-success font-medium">
                            {phase.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-16 text-center">
        <div className="enhanced-card p-8 max-w-2xl mx-auto">
          <h3 className="font-institutional text-2xl md:text-3xl text-foreground mb-4">
            Begin Your 28-Day Transformation Today
          </h3>
          <p className="text-muted-foreground font-mono mb-6">
            Join thousands who have completed our proven conversion process. 
            Your new institutional identity awaits.
          </p>
          <Button 
            size="lg" 
            className="obsidian-button font-bold uppercase px-8 py-4 animate-pulse-slow"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            START PHASE 1
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <p className="text-xs font-mono text-muted-foreground mt-3">
            ✓ Immediate access to Phase 1 ✓ 24/7 support ✓ Progress tracking included
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessRoadmap;