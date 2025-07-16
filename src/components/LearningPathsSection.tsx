import React from 'react';
import LazySection from './LazySection';
import { BookOpen, Crown, Flame, Vote, Shield, Zap, Gift, Users } from 'lucide-react';

const LearningPathsSection: React.FC = () => {
  const learningPaths = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Foundational Doctrine",
      description: "Master the core principles of submission, surrender, and service through structured lessons and readings.",
      level: "Beginner"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Hierarchy Mastery",
      description: "Advanced studies in power dynamics, authority recognition, and proper protocol within structured environments.",
      level: "Intermediate"
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Ritual Practices",
      description: "Sacred ceremonies, traditional observances, and meaningful practices that deepen commitment and understanding.",
      level: "Advanced"
    },
    {
      icon: <Vote className="w-8 h-8" />,
      title: "Leadership Development",
      description: "For qualified students: training in guidance, mentorship, and responsible authority within the university system.",
      level: "Expert"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Integration",
      description: "Collaborative projects, peer support networks, and community service within the MAGAT ecosystem.",
      level: "All Levels"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Personal Development",
      description: "Character building, discipline cultivation, and personal growth through structured academic challenges.",
      level: "Ongoing"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Tribute Studies",
      description: "Understanding the sacred nature of offering, gratitude expression, and financial responsibility in relationships.",
      level: "Specialized"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Intensive Programs",
      description: "Accelerated learning tracks for dedicated students seeking rapid advancement through proven competency.",
      level: "Intensive"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      case 'Intensive': return 'text-purple-400';
      default: return 'text-domtoken-silver';
    }
  };

  return (
    <LazySection className="py-20 bg-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            Academic <span className="text-domtoken-crimson">Learning Paths</span>
          </h2>
          <p className="text-xl text-domtoken-silver max-w-3xl mx-auto">
            MAGAT University offers eight specialized learning tracks designed to develop complete understanding and practical competence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {learningPaths.map((path, index) => (
            <div 
              key={index}
              className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6 hover:border-domtoken-crimson/50 transition-all duration-300 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-domtoken-crimson mb-4 group-hover:scale-110 transition-transform duration-300">
                {path.icon}
              </div>
              <div className="mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-domtoken-slate/30 ${getLevelColor(path.level)}`}>
                  {path.level}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-domtoken-crimson transition-colors duration-300">
                {path.title}
              </h3>
              <p className="text-domtoken-silver text-sm leading-relaxed">
                {path.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-domtoken-crimson mb-4">Personalized Academic Journey</h3>
            <p className="text-domtoken-silver mb-6">
              Every student receives a customized learning plan based on their current level, goals, and demonstrated competency. 
              Progress through our rigorous academic standards at your own pace while meeting established requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-white mb-2">Assessment-Based Placement</h4>
                <p className="text-domtoken-silver text-sm">Initial evaluation determines appropriate starting level and identifies areas for focused development.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Competency Progression</h4>
                <p className="text-domtoken-silver text-sm">Advance only after demonstrating mastery through practical application and comprehensive evaluation.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Continuous Support</h4>
                <p className="text-domtoken-silver text-sm">Faculty guidance, peer assistance, and structured feedback throughout your academic journey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default LearningPathsSection;