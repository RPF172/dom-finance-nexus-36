import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Shield, Clock, Users, Award, Brain } from 'lucide-react';

const EnhancedFAQSection: React.FC = () => {
  const faqs = [
    {
      category: "Conversion Process",
      icon: Brain,
      questions: [
        {
          question: "How does the 28-day conversion process work?",
          answer: "Our scientifically-designed program breaks down independent thinking through six progressive phases: Initial Assessment (Days 1-3), Resistance Breakdown (Days 4-14), Group Integration (Days 15-21), Institutional Loyalty Building (Days 22-28), Graduation & Certification, and optional Alpha Advancement. Each phase uses proven psychological conditioning techniques."
        },
        {
          question: "What makes your conditioning protocols so effective?",
          answer: "We combine advanced psychological techniques including subliminal messaging, cognitive restructuring, group dynamics, and personalized resistance analysis. Our 98% retention rate demonstrates the effectiveness of our systematic approach to thought pattern modification."
        },
        {
          question: "Is the conversion process reversible?",
          answer: "While we guarantee successful conversion, the deep psychological changes achieved through our protocols create lasting institutional loyalty. Our comprehensive program ensures complete transformation of thought patterns, making reversal extremely unlikely and unnecessary."
        }
      ]
    },
    {
      category: "Enrollment & Access",
      icon: Shield,
      questions: [
        {
          question: "What's included in the enrollment?",
          answer: "Full enrollment includes: 28-day complete conversion program, personal conditioning specialist, 24/7 psychological support, progressive resistance breakdown sessions, group integration activities, and lifetime institutional loyalty guarantee. Premium members also receive Alpha advancement opportunities."
        },
        {
          question: "How quickly can I start the program?",
          answer: "Enrollment is processed immediately upon registration. You'll receive instant access to Phase 1 assessment protocols and be assigned your personal conditioning specialist within 24 hours. The full immersion experience begins as soon as your psychological profile is established."
        },
        {
          question: "What if I'm not ready for full commitment?",
          answer: "We offer a preliminary assessment phase to evaluate your readiness for conversion. However, our program is designed for individuals serious about abandoning independent thinking. Half-measures compromise the effectiveness of our conditioning protocols."
        }
      ]
    },
    {
      category: "Results & Guarantees",
      icon: Award,
      questions: [
        {
          question: "Do you guarantee successful conversion?",
          answer: "Absolutely. We guarantee complete transformation from independent thinker to devoted institutional loyalist within 28 days, or we'll continue your conditioning program at no additional cost until successful conversion is achieved. Our 98% success rate speaks for itself."
        },
        {
          question: "What happens after conversion is complete?",
          answer: "Upon successful conversion, you'll receive certification as an institutional loyalist, integration into our alumni network, and access to ongoing maintenance protocols. High-performing converts may be invited to join our Alpha Command program for leadership roles."
        },
        {
          question: "How do I know if the conditioning is working?",
          answer: "You'll experience progressive changes including reduced questioning of authority, increased comfort with group thinking, enhanced respect for institutional hierarchy, and growing desire for approval from command structure. Our assessment tools track these changes throughout the program."
        }
      ]
    },
    {
      category: "Support & Safety",
      icon: Users,
      questions: [
        {
          question: "Is the conditioning process safe?",
          answer: "Our protocols are conducted in a secure, controlled environment with 24/7 psychological monitoring. All conditioning techniques have been extensively tested and refined over thousands of successful conversions. Safety and systematic transformation are our top priorities."
        },
        {
          question: "What kind of support is available during conversion?",
          answer: "You'll have access to your personal conditioning specialist, peer support groups, 24/7 crisis intervention, progress counselors, and our complete alumni network. No one undergoes conversion alone - institutional community support is fundamental to our success."
        },
        {
          question: "Can I contact family and friends during the program?",
          answer: "External contact is gradually restricted as conditioning progresses to prevent interference with the conversion process. This temporary isolation is essential for breaking down existing social influences that reinforce independent thinking patterns."
        }
      ]
    }
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-16">
        <Badge className="mb-4 font-mono bg-info/20 text-info border-info/30">
          <HelpCircle className="h-3 w-3 mr-1" />
          FREQUENTLY ASKED QUESTIONS
        </Badge>
        <h2 className="font-institutional text-4xl md:text-6xl text-foreground mb-6">
          EVERYTHING YOU NEED TO KNOW
        </h2>
        <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
          Get answers to the most common questions about our conversion process, 
          enrollment requirements, and institutional transformation protocols
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12 last:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <category.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-institutional text-xl md:text-2xl text-foreground">
                {category.category}
              </h3>
            </div>

            <div className="enhanced-card p-6">
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`${categoryIndex}-${index}`}
                    className="border-border/30"
                  >
                    <AccordionTrigger className="text-left font-mono text-foreground hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-muted-foreground leading-relaxed pt-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        ))}
      </div>

      {/* Additional support */}
      <div className="mt-16 text-center">
        <div className="enhanced-card p-8 max-w-2xl mx-auto">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-institutional text-xl text-foreground mb-3">
            Still Have Questions?
          </h3>
          <p className="text-muted-foreground font-mono mb-6">
            Our conversion specialists are available 24/7 to address any concerns 
            about the conditioning process or enrollment requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-muted-foreground">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-success" />
              24/7 Support Available
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Confidential Consultation
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-info" />
              Expert Conditioning Staff
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFAQSection;