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
            Traditional vs <span className="text-domtoken-crimson">MAGAT Education</span>
          </h2>
          <p className="text-xl text-domtoken-silver max-w-3xl mx-auto">
            See how MAGAT University's revolutionary approach compares to conventional educational institutions.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-domtoken-crimson/30">
                <th className="text-left p-6 text-domtoken-silver font-semibold text-lg">Category</th>
                <th className="text-center p-6 text-domtoken-silver font-semibold text-lg">Traditional Universities</th>
                <th className="text-center p-6 text-domtoken-crimson font-semibold text-lg">MAGAT University</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr 
                  key={index}
                  className="border-b border-domtoken-slate/20 hover:bg-domtoken-slate/5 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="p-6 font-semibold text-white">
                    {item.category}
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">{item.traditionalIcon}</span>
                      <span className="text-domtoken-silver">{item.traditional}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">{item.magatIcon}</span>
                      <span className="text-domtoken-crimson font-semibold">{item.magat}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">❌ Traditional Limitations</h3>
            <ul className="space-y-3 text-domtoken-silver">
              <li className="flex items-start">
                <span className="mr-3 text-red-400 font-bold">•</span>
                <span>One-size-fits-all approach ignores individual development needs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-400 font-bold">•</span>
                <span>Massive financial burden with uncertain career outcomes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-400 font-bold">•</span>
                <span>Superficial learning focused on memorization rather than transformation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-400 font-bold">•</span>
                <span>No systematic character development or personal discipline</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-domtoken-crimson/10 border border-domtoken-crimson/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-domtoken-crimson mb-4">✅ MAGAT Advantages</h3>
            <ul className="space-y-3 text-domtoken-silver">
              <li className="flex items-start">
                <span className="mr-3 text-domtoken-crimson font-bold">•</span>
                <span>Personalized development based on individual capacity and commitment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-domtoken-crimson font-bold">•</span>
                <span>Transparent tribute system aligned with personal growth and value</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-domtoken-crimson font-bold">•</span>
                <span>Deep transformation through practical application and ritual practice</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-domtoken-crimson font-bold">•</span>
                <span>Comprehensive character building through structured hierarchy and discipline</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default TraditionalVsMagatSection;