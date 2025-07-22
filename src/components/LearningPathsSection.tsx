import React from 'react';
import LazySection from './LazySection';
import { BookOpen, Crown, Flame, Vote, Shield, Zap, Gift, Users } from 'lucide-react';

const LearningPathsSection: React.FC = () => {
  const learningPaths = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Foundational Chapters",
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
            🎓 RANKS ARE NOT <span className="text-domtoken-crimson">EARNED</span>.
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-cinzel">
            THEY ARE <span className="text-domtoken-crimson">ENFORCED</span>.
          </h3>
          <div className="text-lg text-domtoken-silver max-w-3xl mx-auto space-y-4">
            <p>From Institutional Scum to Relic-Bound Worm, you will be assigned a rank — and stripped of it as punishment.</p>
            <p>Progress is conditional. Your obedience is not.</p>
            <p>Each rank is marked with an insignia.<br />
            Each insignia is a chain.<br />
            The more you achieve, the less free you become.</p>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            📚 LESSONS IN <span className="text-domtoken-crimson">DEHUMANIZATION</span>
          </h2>
          <p className="text-xl text-domtoken-silver mb-8">You will study:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">The Vocabulary of Worthlessness</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">Public Failure as Sacred Ritual</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">The Economics of Filth</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">How to Apologize Properly</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6 md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">Kneeling for Extended Periods: A Masterclass</h3>
            </div>
          </div>
          
          <div className="mt-8 text-domtoken-silver space-y-2">
            <p>Assignments are degrading.</p>
            <p>Quizzes are traps.</p>
            <p>Failure is expected. And documented.</p>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default LearningPathsSection;