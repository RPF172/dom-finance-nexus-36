import React from 'react';
import LazySection from './LazySection';

const TraditionalVsMagatSection: React.FC = () => {
  const comparisons = [
    {
      category: "Educational Focus",
      traditional: "Generic academics",
      magat: "Character & submission",
      traditionalIcon: "📚",
      magatIcon: "👑"
    },
    {
      category: "Student Development",
      traditional: "Individual achievement",
      magat: "Hierarchical understanding",
      traditionalIcon: "🎓",
      magatIcon: "🔱"
    },
    {
      category: "Assessment Method",
      traditional: "Tests & papers",
      magat: "Practical demonstration",
      traditionalIcon: "📝",
      magatIcon: "⚡"
    },
    {
      category: "Community Structure",
      traditional: "Competitive peers",
      magat: "Supportive hierarchy",
      traditionalIcon: "🤝",
      magatIcon: "🏛️"
    },
    {
      category: "Learning Outcomes",
      traditional: "Job preparation",
      magat: "Life transformation",
      traditionalIcon: "💼",
      magatIcon: "✨"
    },
    {
      category: "Cost Structure",
      traditional: "Massive debt",
      magat: "Tribute-based",
      traditionalIcon: "💸",
      magatIcon: "🏆"
    },
    {
      category: "Faculty Relationship",
      traditional: "Distant professors",
      magat: "Personal mentorship",
      traditionalIcon: "👨‍🏫",
      magatIcon: "🎭"
    },
    {
      category: "Graduation",
      traditional: "Diploma ceremony",
      magat: "Sacred transformation",
      traditionalIcon: "🎓",
      magatIcon: "👑"
    }
  ];

  return (
    <LazySection className="py-20 bg-domtoken-slate/10">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            🏴‍☠️ CAMPUS <span className="text-domtoken-crimson">LIFE</span>
          </h2>
          <div className="text-lg text-domtoken-silver max-w-3xl mx-auto space-y-4">
            <p>There is no campus.<br />There is only the Pledgehall.</p>
            <p>A place of public shame and quiet longing.<br />Where you will:</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Submit daily degradation logs</h3>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Observe the hierarchy in enforced silence</h3>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Worship the relics of Masters past</h3>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Beg for advancement, and be denied</h3>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            ⛓️ YOUR PROGRESSION IS NOT <span className="text-domtoken-crimson">YOURS</span>
          </h2>
          <div className="text-lg text-domtoken-silver max-w-3xl mx-auto space-y-4">
            <p>Your rituals, assignments, punishments, and tributes are all recorded in The Registry.</p>
            <p>You will not see it.<br />
            You will not control it.<br />
            But your future will be decided by it.</p>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default TraditionalVsMagatSection;