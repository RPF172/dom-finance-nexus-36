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

interface UserProfile {
  id: string;
  email: string;
  collar_name?: string;
  rank?: string;
  created_at: string;
}

const PledgeHall: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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

        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          collar_name: session.user.user_metadata?.collar_name || 'Unnamed Property',
          rank: session.user.user_metadata?.rank || 'Initiate Whelp',
          created_at: session.user.created_at
        };

        setUser(profile);
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
                <h1 className="text-xl font-institutional tracking-wider uppercase">PLEDGE HALL</h1>
              </div>
              <Badge variant="outline" className="border-accent text-accent font-mono">
                RANK: {user.rank?.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="institutional-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl border-l-4 border-l-accent">
              <div className="w-12 h-12 mx-auto bg-accent/20 border border-accent flex items-center justify-center mb-3 animate-pulse">
                <div className="w-6 h-6 bg-accent"></div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
              <p className="font-institutional text-lg text-accent uppercase animate-fade-in">{user.rank}</p>
              <p className="text-xs text-muted-foreground mt-1">Status: ACTIVE</p>
            </Card>

            <Card className="institutional-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl border-l-4 border-l-primary">
              <User className="w-12 h-12 mx-auto text-primary mb-3 hover:scale-110 transition-transform" />
              <p className="text-sm text-muted-foreground mb-1">Compliance Level</p>
              <div className="relative">
                <p className="font-institutional text-lg text-foreground">85%</p>
                <div className="w-full bg-muted h-1 rounded-full mt-2">
                  <div className="bg-primary h-1 rounded-full w-[85%] animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Status: SATISFACTORY</p>
            </Card>

            <Card className="institutional-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl border-l-4 border-l-secondary">
              <Award className="w-12 h-12 mx-auto text-secondary mb-3 hover:scale-110 transition-transform" />
              <p className="text-sm text-muted-foreground mb-1">Days Active</p>
              <p className="font-institutional text-lg text-foreground">42</p>
              <p className="text-xs text-muted-foreground mt-1">Status: PROGRESSING</p>
            </Card>
          </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ObedienceStatusCard />
            <ObedienceLeaderboardCard />
          </div>
          <ObedienceLedgerList />

          {/* Current Task */}
          <Card className="institutional-card p-6 border-accent bg-gradient-to-r from-card to-accent/5 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-accent animate-pulse" />
                <h3 className="font-institutional text-base uppercase tracking-wide">Current Assignment</h3>
                <div className="ml-auto">
                  <Clock className="w-4 h-4 text-accent animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-foreground font-medium text-lg">"Complete Initial Chapter Reading"</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Type: CHAPTER STUDY
                  </span>
                  <span className="text-accent font-medium animate-pulse">Due: 12 HOURS</span>
                </div>
                <Button 
                  className="w-full institutional-button font-mono hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  onClick={() => navigate('/doctrine')}
                >
                  <span className="relative z-10">PROCEED TO ASSIGNMENT</span>
                  <div className="absolute inset-0 bg-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Lesson */}
            <Card className="institutional-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-primary/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary hover:scale-110 transition-transform" />
                  <h3 className="font-institutional text-base uppercase tracking-wide">Active Lesson</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-foreground font-medium">Chapter I: Foundational Obedience</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <p className="text-sm text-muted-foreground">Status: IN PROGRESS</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-primary font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-3 overflow-hidden" />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary/10 font-mono hover:scale-105 transition-all duration-300"
                    onClick={() => navigate('/doctrine')}
                  >
                    CONTINUE LESSON
                  </Button>
                </div>
              </div>
            </Card>

            {/* Tribute Status */}
            <Card className="institutional-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-accent/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-accent hover:scale-110 transition-transform" />
                  <h3 className="font-institutional text-base uppercase tracking-wide">Tribute Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-mono text-accent">$27.00</p>
                    <div className="flex flex-col">
                      <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-accent rounded-full animate-pulse [animation-delay:0.5s]"></div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Next Due: <span className="text-accent font-medium">2 DAYS</span></p>
                  <Button 
                    className="w-full institutional-button font-mono hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                    onClick={() => navigate('/tribute')}
                  >
                    <span className="relative z-10">PAY TRIBUTE</span>
                    <div className="absolute inset-0 bg-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent/10 font-mono p-6 h-auto hover:scale-105 transition-all duration-300 hover:shadow-lg"
              onClick={() => navigate('/assignments')}
            >
              <div className="flex flex-col items-center gap-3">
                <Calendar className="w-6 h-6 hover:scale-110 transition-transform" />
                <span className="text-sm">DAILY RITUAL</span>
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
      </div>
    </AppLayout>
  );
};

export default PledgeHall;