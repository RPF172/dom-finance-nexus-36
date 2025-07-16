import React from 'react';
import LazySection from './LazySection';

const WhyMagatSection: React.FC = () => {
  return (
    <LazySection className="py-20 bg-domtoken-obsidian/50">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Problem */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-domtoken-crimson mb-6 font-cinzel">
                The Problem with Traditional Education
              </h2>
              <p className="text-domtoken-silver text-lg leading-relaxed mb-8">
                Modern universities fail to teach the fundamental principles of submission, surrender, and service:
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-domtoken-crimson pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Lack of True Discipline</h3>
                <p className="text-domtoken-silver">Traditional education promotes false equality rather than natural hierarchies and proper submission to authority.</p>
              </div>
              
              <div className="border-l-4 border-domtoken-crimson pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">No Character Development</h3>
                <p className="text-domtoken-silver">Students graduate without understanding obedience, ritual, or the sacred nature of hierarchical relationships.</p>
              </div>
              
              <div className="border-l-4 border-domtoken-crimson pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Weak Academic Structure</h3>
                <p className="text-domtoken-silver">No systematic progression through levels of understanding, commitment, and demonstrated competence.</p>
              </div>
            </div>
          </div>
          
          {/* Solution */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-domtoken-crimson mb-6 font-cinzel">
                Why MAGAT University is Superior
              </h2>
              <p className="text-domtoken-silver text-lg leading-relaxed mb-8">
                MAGAT University provides structured education in submission, surrender, and service through proven methods:
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Systematic Doctrine</h3>
                <p className="text-domtoken-silver">Comprehensive curriculum progressing from basic submission principles to advanced ritual practices.</p>
              </div>
              
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Practical Assignments</h3>
                <p className="text-domtoken-silver">Real-world application through carefully designed tasks that reinforce learning and build character.</p>
              </div>
              
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Measurable Progress</h3>
                <p className="text-domtoken-silver">Clear advancement through proven competency in submission levels with recognition and tribute requirements.</p>
              </div>
              
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Sacred Rituals</h3>
                <p className="text-domtoken-silver">Traditional ceremonies and practices that deepen understanding and commitment to the hierarchical order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default WhyMagatSection;