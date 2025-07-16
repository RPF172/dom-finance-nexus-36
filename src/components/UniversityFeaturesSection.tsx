import React from 'react';
import LazySection from './LazySection';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Calendar, 
  MessageSquare, 
  Shield,
  Target,
  Award
} from 'lucide-react';

const UniversityFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-domtoken-crimson" />,
      title: "Interactive Doctrine Library",
      description: "Comprehensive digital library with progressive lessons, quizzes, and practical assignments.",
      status: "Live"
    },
    {
      icon: <Users className="h-8 w-8 text-domtoken-crimson" />,
      title: "Peer Learning Communities",
      description: "Structured study groups and mentorship networks within your academic level.",
      status: "Live"
    },
    {
      icon: <Trophy className="h-8 w-8 text-domtoken-crimson" />,
      title: "Achievement Recognition",
      description: "Digital badges, progress tracking, and public recognition for academic milestones.",
      status: "Live"
    },
    {
      icon: <Calendar className="h-8 w-8 text-domtoken-crimson" />,
      title: "Ritual Scheduling",
      description: "Organized ceremonies, special events, and community gatherings with automated reminders.",
      status: "Coming Soon"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-domtoken-crimson" />,
      title: "Faculty Communication",
      description: "Direct messaging with instructors, assignment feedback, and academic guidance.",
      status: "Coming Soon"
    },
    {
      icon: <Shield className="h-8 w-8 text-domtoken-crimson" />,
      title: "Privacy Protection",
      description: "Anonymous learning options, secure communications, and protected academic records.",
      status: "Live"
    },
    {
      icon: <Target className="h-8 w-8 text-domtoken-crimson" />,
      title: "Personalized Curriculum",
      description: "AI-powered learning path recommendations based on progress and competency assessments.",
      status: "Beta"
    },
    {
      icon: <Award className="h-8 w-8 text-domtoken-crimson" />,
      title: "Digital Certifications",
      description: "Blockchain-verified academic credentials and skill certifications upon completion.",
      status: "Coming Soon"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-600 text-white';
      case 'Beta': return 'bg-yellow-600 text-white';
      case 'Coming Soon': return 'bg-domtoken-slate text-domtoken-silver';
      default: return 'bg-domtoken-slate text-domtoken-silver';
    }
  };

  return (
    <LazySection className="py-24 bg-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">University Platform Features</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            MAGAT University provides a comprehensive digital learning environment designed specifically for our unique educational approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-domtoken-slate/30 p-6 rounded-lg border border-domtoken-slate/50 hover:border-domtoken-crimson/50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(feature.status)}`}>
                  {feature.status}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-domtoken-crimson transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-domtoken-silver leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-domtoken-slate/30 p-8 rounded-lg border border-domtoken-slate/50">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">Upcoming Platform Enhancements</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-domtoken-crimson mb-4">Advanced Learning Tools</h4>
              <ul className="space-y-3 text-domtoken-silver">
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Virtual reality submission training environments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>AI-powered progress assessment and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Interactive 3D campus tours and facility exploration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Mobile app with offline learning capabilities</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-domtoken-crimson mb-4">Community & Networking</h4>
              <ul className="space-y-3 text-domtoken-silver">
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Alumni network and career placement assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Live streaming lectures and interactive workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Student forums and peer collaboration tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Global campus events and ceremonial live streams</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default UniversityFeaturesSection;