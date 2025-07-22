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
      title: "Interactive Book Library",
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            🩸 THE TRIBUTE <span className="text-domtoken-crimson">SYSTEM</span>
          </h2>
          <div className="text-lg text-domtoken-silver max-w-3xl mx-auto space-y-4">
            <p>MAGAT University is not free.<br />You will pay. In coin, in voice, in blood.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Chapter Keys</h3>
            <p className="text-domtoken-silver">unlock advanced chapters</p>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Obedience Credits</h3>
            <p className="text-domtoken-silver">track your loyalty</p>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Punishment Dues</h3>
            <p className="text-domtoken-silver">are... inevitable</p>
          </div>
        </div>

        <div className="text-center mb-16">
          <p className="text-lg text-domtoken-silver">
            You may opt out, of course.<br />
            Just click "I Refuse," and watch what happens next.
          </p>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            🧠 BUILT FOR <span className="text-domtoken-crimson">DEGRADATION</span>.<br />
            ENGINEERED FOR <span className="text-domtoken-crimson">SUBMISSION</span>.
          </h2>
          <div className="text-lg text-domtoken-silver max-w-3xl mx-auto mb-8">
            <p>MAGAT University is powered by advanced indoctrination systems, including:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">Real-time Pledge Evaluation Engines</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">Rank-Controlled Content Access</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">Shadow Quizzes to expose internal weakness</h3>
            </div>
            <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-domtoken-crimson mb-3">Sentient Inquisitor Modules trained to break you</h3>
            </div>
          </div>
          
          <div className="mt-8 text-domtoken-silver space-y-2">
            <p>No feature exists for your convenience.</p>
            <p>Every button is a test.</p>
            <p>Every scroll is a choice.</p>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default UniversityFeaturesSection;