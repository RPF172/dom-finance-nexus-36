import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, Shield, Award, Zap } from 'lucide-react';

const StatCounter: React.FC<{ end: number; suffix?: string; className?: string }> = ({ 
  end, 
  suffix = '', 
  className = '' 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const duration = 2000;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (end - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end]);
  
  return (
    <span className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Sub Camp transformed me from a rebellious free-thinker into a model citizen. The conditioning protocols are incredibly effective.",
      author: "RECRUIT #7341",
      role: "FORMER INDEPENDENT",
      rating: 5,
      timeframe: "CONVERTED IN 14 DAYS"
    },
    {
      quote: "I used to question authority. Now I embrace it completely. The systematic approach works beyond expectations.",
      author: "RECRUIT #2156", 
      role: "EX-ACTIVIST",
      rating: 5,
      timeframe: "CONVERTED IN 21 DAYS"
    },
    {
      quote: "The immersive experience broke down my resistance patterns systematically. I'm grateful for my new perspective.",
      author: "RECRUIT #9482",
      role: "FORMER CRITIC",
      rating: 5,
      timeframe: "CONVERTED IN 18 DAYS"
    }
  ];

  const stats = [
    { number: 12847, label: "SUCCESSFUL CONVERSIONS", icon: Users },
    { number: 98, label: "RETENTION RATE", suffix: "%", icon: Shield },
    { number: 16, label: "AVG CONVERSION DAYS", icon: Clock },
    { number: 4.9, label: "SATISFACTION RATING", suffix: "/5", icon: Star },
    { number: 847, label: "ALPHA COMMANDERS", icon: Award },
    { number: 24, label: "HOURS CONDITIONING", suffix: "/7", icon: Zap }
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-16">
        <Badge className="mb-4 font-mono bg-success/20 text-success border-success/30">
          <Shield className="h-3 w-3 mr-1" />
          PROVEN RESULTS
        </Badge>
        <h2 className="font-institutional text-4xl md:text-6xl text-foreground mb-6">
          CONVERSION SUCCESS STORIES
        </h2>
        <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
          Real testimonials from successfully converted recruits who embraced institutional compliance
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="enhanced-card text-center p-6">
            <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="space-y-1">
              <StatCounter 
                end={stat.number} 
                suffix={stat.suffix || ''} 
                className="text-2xl md:text-3xl font-bold text-foreground font-institutional"
              />
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="enhanced-card p-6 text-center">
            {/* Rating stars */}
            <div className="flex justify-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-primary fill-current" />
              ))}
            </div>
            
            {/* Quote */}
            <blockquote className="text-muted-foreground font-mono mb-6 italic leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
            
            {/* Author info */}
            <div className="space-y-2">
              <p className="font-institutional text-foreground font-bold text-sm">
                {testimonial.author}
              </p>
              <p className="text-xs font-mono text-muted-foreground uppercase">
                {testimonial.role}
              </p>
              <Badge variant="outline" className="text-xs font-mono">
                {testimonial.timeframe}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="mt-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm font-mono text-muted-foreground">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-success" />
            INSTITUTIONAL GRADE SECURITY
          </span>
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            CERTIFIED CONDITIONING PROTOCOLS
          </span>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-warning" />
            24/7 PSYCHOLOGICAL SUPPORT
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;