import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Target,
  Zap,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<{ onNext: () => void; onPrev: () => void; }>;
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    displayName: '',
    learningGoals: [] as string[],
    experience: '',
    interests: [] as string[]
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MAGAT University',
      description: 'Your journey to structured learning begins here',
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Set Up Your Profile',
      description: 'Tell us about yourself',
      component: ProfileStep
    },
    {
      id: 'goals',
      title: 'Learning Goals',
      description: 'What would you like to achieve?',
      component: GoalsStep
    },
    {
      id: 'system',
      title: 'Understanding the System',
      description: 'Learn how everything works',
      component: SystemStep
    },
    {
      id: 'gamification',
      title: 'Obedience Points & Rewards',  
      description: 'Earn points and climb the ranks',
      component: GamificationStep
    },
    {
      id: 'start',
      title: 'Ready to Begin',
      description: 'Your personalized recommendations',
      component: StartStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Update user profile with onboarding preferences
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            display_name: userPreferences.displayName,
            interests: userPreferences.interests,
            // Store onboarding completion
            social_links: { onboarding_completed: true }
          })
          .eq('user_id', user.id);

        toast({
          title: "Welcome aboard!",
          description: "Your profile has been set up successfully.",
        });
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Setup incomplete",
        description: "There was an issue saving your preferences, but you can continue.",
        variant: "destructive"
      });
      onComplete();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-institutional uppercase tracking-wide">
                {steps[currentStep].title}
              </DialogTitle>
              <Badge variant="outline">
                {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="py-6">
          <CurrentStepComponent 
            onNext={handleNext} 
            onPrev={handlePrev}
          />
        </div>
      </DialogContent>
    </Dialog>
  );

  // Step Components
  function WelcomeStep({ onNext }: { onNext: () => void; onPrev: () => void }) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Welcome to Your Learning Journey</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            MAGAT University combines structured training, engaging stories, and gamified learning 
            to help you achieve your goals. Let's get you set up for success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
          <Card className="institutional-card p-4 text-center">
            <BookOpen className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-medium text-sm">Story Chapters</h3>
            <p className="text-xs text-muted-foreground">Engaging narratives</p>
          </Card>
          
          <Card className="institutional-card p-4 text-center">
            <GraduationCap className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-sm">Training Weeks</h3>
            <p className="text-xs text-muted-foreground">Structured learning</p>
          </Card>
          
          <Card className="institutional-card p-4 text-center">
            <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-medium text-sm">Gamification</h3>
            <p className="text-xs text-muted-foreground">Points & rewards</p>
          </Card>
        </div>

        <Button onClick={onNext} className="w-full max-w-xs mx-auto">
          Let's Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  function ProfileStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="How should we address you?"
              value={userPreferences.displayName}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, displayName: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="experience">Learning Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your background or what brings you here... (optional)"
              value={userPreferences.experience}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, experience: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} disabled={!userPreferences.displayName.trim()}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  function GoalsStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
    const goals = [
      { id: 'knowledge', label: 'Gain Knowledge', icon: BookOpen },
      { id: 'skills', label: 'Develop Skills', icon: Target },
      { id: 'community', label: 'Join Community', icon: Users },
      { id: 'compete', label: 'Compete & Win', icon: Trophy },
      { id: 'personal', label: 'Personal Growth', icon: Star },
      { id: 'fun', label: 'Have Fun', icon: Zap }
    ];

    const toggleGoal = (goalId: string) => {
      setUserPreferences(prev => ({
        ...prev,
        learningGoals: prev.learningGoals.includes(goalId)
          ? prev.learningGoals.filter(id => id !== goalId)
          : [...prev.learningGoals, goalId]
      }));
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">What are your learning goals?</h3>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
          
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => {
              const isSelected = userPreferences.learningGoals.includes(goal.id);
              return (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'hover:border-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <CardContent className="p-4 text-center">
                    <goal.icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                      {goal.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} disabled={userPreferences.learningGoals.length === 0}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  function SystemStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">How MAGAT University Works</h3>
          
          <div className="space-y-4">
            <Card className="institutional-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Training Weeks</h4>
                  <p className="text-xs text-muted-foreground">
                    Structured weekly content with modules, tasks, and assignments to guide your learning progression.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="institutional-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Story Chapters</h4>
                  <p className="text-xs text-muted-foreground">
                    Engaging narrative content that can be read independently at your own pace.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="institutional-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Community</h4>
                  <p className="text-xs text-muted-foreground">
                    Connect with other learners, share progress, and participate in discussions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  function GamificationStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Obedience Points (OP) System</h3>
          <p className="text-sm text-muted-foreground">
            Earn points for completing activities and climb through the ranks!
          </p>
          
          <div className="space-y-3">
            <Card className="institutional-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <span className="text-sm">Reading chapters</span>
                </div>
                <Badge variant="outline" className="text-accent border-accent">+10 OP</Badge>
              </div>
            </Card>

            <Card className="institutional-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="text-sm">Completing modules</span>
                </div>
                <Badge variant="outline" className="text-primary border-primary">+10 OP</Badge>
              </div>
            </Card>

            <Card className="institutional-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Submitting tasks</span>
                </div>
                <Badge variant="outline" className="text-secondary border-secondary">+25 OP</Badge>
              </div>
            </Card>

            <Card className="institutional-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Assignments</span>
                </div>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">+50 OP</Badge>
              </div>
            </Card>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Pro Tip</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Check the leaderboard to see how you rank against other learners, and unlock new tiers as you progress!
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  function StartStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h3 className="font-medium text-lg">You're All Set, {userPreferences.displayName}!</h3>
            <p className="text-sm text-muted-foreground">
              Based on your goals, here's where we recommend you start:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Card className="institutional-card p-4 cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => { onNext(); navigate('/learning-hub'); }}>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Explore the Learning Hub</h4>
                <p className="text-xs text-muted-foreground">
                  Get an overview of all available content and your progress
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>

          {userPreferences.learningGoals.includes('compete') && (
            <Card className="institutional-card p-4 cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => { onNext(); navigate('/compete'); }}>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-secondary" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Try the Games</h4>
                  <p className="text-xs text-muted-foreground">
                    Start earning OP with Typing Trial and other challenges
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          )}

          {userPreferences.learningGoals.includes('community') && (
            <Card className="institutional-card p-4 cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => { onNext(); navigate('/social'); }}>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-accent" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Join the Community</h4>
                  <p className="text-xs text-muted-foreground">
                    Connect with other learners and share your journey
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
            Complete Setup
            <Star className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }
};