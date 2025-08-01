import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface LessonPreviewProps {
  className?: string;
}

const InteractiveLessonPreview: React.FC<LessonPreviewProps> = ({ className = '' }) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const sampleLessons = [
    {
      title: "Foundation of Hierarchy",
      description: "Understanding natural order and structured relationships",
      content: "In this foundational lesson, we explore the fundamental principles that govern hierarchical structures in human societies...",
      duration: "15 min",
      type: "Reading"
    },
    {
      title: "Practical Protocol",
      description: "Daily practices and proper procedures",
      content: "Learn essential protocols for academic success, including proper communication, submission procedures, and daily rituals...",
      duration: "10 min", 
      type: "Interactive"
    },
    {
      title: "Character Assessment",
      description: "Self-reflection and development planning",
      content: "Complete a comprehensive self-assessment to identify strengths, areas for growth, and create your personal development plan...",
      duration: "20 min",
      type: "Assignment"
    }
  ];

  const quizQuestions = [
    {
      question: "What is the primary goal of MAGAT University?",
      options: ["Academic achievement", "Character development", "Career preparation", "Social networking"],
      correct: 1
    }
  ];

  return (
    <div className={`bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-domtoken-crimson" />
        <h3 className="text-xl font-semibold text-[hsl(var(--secondary-foreground))]">Interactive Lesson Preview</h3>
        <span className="bg-domtoken-crimson/20 text-domtoken-crimson px-2 py-1 rounded text-sm">Demo</span>
      </div>

      {/* Lesson Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {sampleLessons.map((lesson, index) => (
          <Button
            key={index}
            onClick={() => {
              setCurrentLesson(index);
              setShowQuiz(false);
            }}
            variant={currentLesson === index ? "default" : "outline"}
            className="whitespace-nowrap"
            size="sm"
          >
            {index + 1}. {lesson.title}
          </Button>
        ))}
      </div>

      {/* Lesson Content */}
      <Card className="p-6 bg-domtoken-obsidian/50 border-domtoken-slate/50 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-[hsl(var(--secondary-foreground))] mb-2">
              {sampleLessons[currentLesson].title}
            </h4>
            <p className="text-domtoken-silver text-sm mb-3">
              {sampleLessons[currentLesson].description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-domtoken-silver">
            <PlayCircle className="h-4 w-4" />
            {sampleLessons[currentLesson].duration}
          </div>
        </div>
        
        <div className="text-domtoken-silver leading-relaxed mb-4">
          {sampleLessons[currentLesson].content}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="bg-domtoken-crimson/10 text-domtoken-crimson px-3 py-1 rounded-full text-sm">
            {sampleLessons[currentLesson].type}
          </span>
          <Button 
            onClick={() => setShowQuiz(true)}
            className="bg-domtoken-crimson hover:bg-domtoken-crimson/90"
            size="sm"
          >
            Continue to Quiz <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Quiz Section */}
      {showQuiz && (
        <Card className="p-6 bg-domtoken-crimson/5 border-domtoken-crimson/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-domtoken-crimson" />
            <h5 className="font-semibold text-[hsl(var(--secondary-foreground))]">Knowledge Check</h5>
          </div>
          
          <div className="space-y-4">
            <p className="text-[hsl(var(--secondary-foreground))]">{quizQuestions[0].question}</p>
            <div className="grid grid-cols-1 gap-2">
              {quizQuestions[0].options.map((option, index) => (
                <button
                  key={index}
                  className="text-left p-3 rounded border border-domtoken-slate/30 hover:border-domtoken-crimson/50 transition-colors text-domtoken-silver hover:text-white"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Call to Action */}
      <div className="mt-6 text-center">
        <p className="text-domtoken-silver text-sm mb-3">
          This is just a preview. Access the full curriculum with interactive assignments, detailed feedback, and progress tracking.
        </p>
        <Button 
          onClick={() => window.location.href = '/auth'}
          className="bg-domtoken-crimson hover:bg-domtoken-crimson/90"
        >
          Start Your Academic Journey
        </Button>
      </div>
    </div>
  );
};

export default InteractiveLessonPreview;