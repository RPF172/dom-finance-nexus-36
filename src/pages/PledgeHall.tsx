import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User, Award, Clock, CreditCard, AlertTriangle, Calendar, Play, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import ObedienceStatusCard from '@/components/gamification/ObedienceStatusCard';
import ObedienceLedgerList from '@/components/gamification/ObedienceLedgerList';
import ObedienceLeaderboardCard from '@/components/gamification/ObedienceLeaderboardCard';
import { LearningProgressWidget } from '@/components/dashboard/LearningProgressWidget';
import { PersonalizedRecommendations } from '@/components/dashboard/PersonalizedRecommendations';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

interface UserProfile {
  id: string;
  email: string;
  collar_name?: string;
  rank?: string;
  created_at: string;
  display_name?: string;
  onboarding_completed?: boolean;
}

const PledgeHall: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          collar_name: session.user.user_metadata?.collar_name || 'Unnamed Property',
          rank: session.user.user_metadata?.rank || 'Initiate Whelp',
          created_at: session.user.created_at,
          display_name: profile?.display_name,
          onboarding_completed: (profile?.social_links as any)?.onboarding_completed
        };

        setUser(userProfile);

        // Check if user needs onboarding
        if (!(profile?.social_links as any)?.onboarding_completed && !profile?.display_name) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Access denied",
          description: "Unable to verify your institutional status.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Covenant broken",
        description: "You have renounced the path. Shame upon you.",
        variant: "destructive",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Escape denied",
        description: "The Institution does not easily release its property.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#e5e0d1] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A1001F] mx-auto"></div>
          <p className="font-mono text-lg">Verifying submission status...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-accent"></div>
                <h1 className="text-xl font-institutional tracking-wider uppercase">
                  {user?.display_name ? `Welcome back, ${user.display_name}` : 'PLEDGE HALL'}
                </h1>
              </div>
              <Badge variant="outline" className="border-accent text-accent font-mono">
                RANK: {user?.rank?.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Smart Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Learning Progress */}
            <div className="lg:col-span-2 space-y-6">
              <LearningProgressWidget />
            </div>

            {/* Sidebar - Personalized Recommendations */}
            <div className="space-y-6">
              <PersonalizedRecommendations />
              
              {/* Gamification Cards */}
              <ObedienceStatusCard />
              <ObedienceLeaderboardCard />
            </div>
          </div>

          {/* Full Width Sections */}
          <ObedienceLedgerList />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent/10 font-mono p-6 h-auto hover:scale-105 transition-all duration-300 hover:shadow-lg"
              onClick={() => navigate('/learning-hub')}
            >
              <div className="flex flex-col items-center gap-3">
                <BookOpen className="w-6 h-6 hover:scale-110 transition-transform" />
                <span className="text-sm">LEARNING HUB</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="border-muted-foreground text-muted-foreground hover:bg-muted/20 font-mono p-6 h-auto hover:scale-105 transition-all duration-300 hover:shadow-lg"
              onClick={() => navigate('/social')}
            >
              <div className="flex flex-col items-center gap-3">
                <Zap className="w-6 h-6 hover:scale-110 transition-transform" />
                <span className="text-sm">COMMUNITY</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Onboarding Flow */}
        <OnboardingFlow 
          isOpen={showOnboarding}
          onComplete={() => setShowOnboarding(false)}
        />
      </div>
    </AppLayout>
  );
};

export default PledgeHall;