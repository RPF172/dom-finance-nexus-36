import React from 'react';
import LazySection from './LazySection';
import { CheckCircle, Circle, Crown, BookOpen, Award, Users } from 'lucide-react';

const AcademicRoadmapSection: React.FC = () => {
  const semesters = [
    {
      semester: "Semester 1",
      title: "Foundation Studies",
      icon: <BookOpen className="h-6 w-6" />,
      milestone: "Basic submission principles & university orientation",
      completed: true,
      courses: ["Introduction to Hierarchy", "Basic Protocols", "University History"],
      requirements: "Complete all foundation assignments, pass orientation quiz"
    },
    {
      semester: "Semester 2", 
      title: "Character Development",
      icon: <Users className="h-6 w-6" />,
      milestone: "Personal discipline & community integration",
      completed: true,
      courses: ["Character Building", "Community Service", "Peer Mentorship"],
      requirements: "Demonstrate consistent participation, complete service hours"
    },
    {
      semester: "Semester 3",
      title: "Advanced Doctrine",
      icon: <Crown className="h-6 w-6" />,
      milestone: "Deep study of hierarchical principles & practical application",
      completed: false,
      courses: ["Advanced Theory", "Practical Applications", "Case Studies"],
      requirements: "Maintain honor roll status, complete advanced assignments"
    },
    {
      semester: "Semester 4",
      title: "Specialized Studies",
      icon: <Award className="h-6 w-6" />,
      milestone: "Choose specialization track & begin advanced coursework",
      completed: false,
      courses: ["Specialization Track", "Independent Research", "Capstone Preparation"],
      requirements: "Choose track, complete prerequisite assessments"
    },
    {
      semester: "Graduation",
      title: "Sacred Ceremony",
      icon: <Crown className="h-6 w-6" />,
      milestone: "Complete transformation & formal recognition",
      completed: false,
      courses: ["Final Assessment", "Capstone Defense", "Graduation Ceremony"],
      requirements: "Complete all requirements, demonstrate full competency"
    }
  ];

  return (
    <LazySection className="py-24 bg-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Academic Progression Roadmap</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            Your journey through MAGAT University follows a carefully structured progression designed to ensure complete development and understanding.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 ml-[5px] md:ml-0 h-full w-0.5 bg-domtoken-slate/50 transform -translate-x-1/2" />

          {semesters.map((semester, index) => (
            <div key={index} className="relative mb-16 last:mb-0">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Circle indicator */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  {semester.completed ? (
                    <CheckCircle className="h-12 w-12 text-domtoken-crimson bg-domtoken-obsidian rounded-full border-2 border-domtoken-crimson p-2" />
                  ) : (
                    <Circle className="h-12 w-12 text-domtoken-slate bg-domtoken-obsidian rounded-full border-2 border-domtoken-slate p-2" />
                  )}
                </div>

                {/* Content */}
                <div className={`md:w-1/2 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                  <div className={`p-6 bg-domtoken-slate/30 rounded-lg border transition-all duration-300 hover:border-domtoken-crimson/50 ${
                    semester.completed ? 'border-domtoken-crimson/50' : 'border-domtoken-slate/50'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full ${semester.completed ? 'bg-domtoken-crimson/20 text-domtoken-crimson' : 'bg-domtoken-slate/20 text-domtoken-slate'}`}>
                        {semester.icon}
                      </div>
                      <h3 className={`text-xl font-bold ${semester.completed ? 'text-domtoken-crimson' : 'text-white'}`}>
                        {semester.semester}
                      </h3>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">{semester.title}</h4>
                    <p className="text-domtoken-silver mb-4">{semester.milestone}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-semibold text-white mb-1">Core Courses:</h5>
                        <div className="flex flex-wrap gap-1">
                          {semester.courses.map((course, courseIndex) => (
                            <span key={courseIndex} className="text-xs bg-domtoken-slate/40 px-2 py-1 rounded text-domtoken-silver">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-white mb-1">Requirements:</h5>
                        <p className="text-xs text-domtoken-silver">{semester.requirements}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-domtoken-crimson/10 border border-domtoken-crimson/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-domtoken-crimson mb-4">Accelerated & Extended Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-domtoken-slate/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">🚀 Fast Track</h4>
              <p className="text-domtoken-silver text-sm">Complete your studies in 2 semesters with intensive coursework for dedicated students.</p>
            </div>
            <div className="bg-domtoken-slate/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">⏰ Extended Program</h4>
              <p className="text-domtoken-silver text-sm">Take up to 8 semesters with part-time study options for working students.</p>
            </div>
            <div className="bg-domtoken-slate/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">🎓 Graduate Studies</h4>
              <p className="text-domtoken-silver text-sm">Advanced programs available for exceptional graduates seeking leadership roles.</p>
            </div>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default AcademicRoadmapSection;