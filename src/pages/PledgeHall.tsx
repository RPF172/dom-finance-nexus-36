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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="institutional-card p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-accent/20 border border-accent flex items-center justify-center mb-3">
                <div className="w-6 h-6 bg-accent"></div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
              <p className="font-institutional text-lg text-accent uppercase">{user.rank}</p>
              <p className="text-xs text-muted-foreground mt-1">Status: ACTIVE</p>
            </Card>

            <Card className="institutional-card p-6 text-center">
              <User className="w-12 h-12 mx-auto text-accent mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Compliance Level</p>
              <p className="font-institutional text-lg text-foreground">85%</p>
              <p className="text-xs text-muted-foreground mt-1">Status: SATISFACTORY</p>
            </Card>

            <Card className="institutional-card p-6 text-center">
              <Award className="w-12 h-12 mx-auto text-accent mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Days Active</p>
              <p className="font-institutional text-lg text-foreground">42</p>
              <p className="text-xs text-muted-foreground mt-1">Status: PROGRESSING</p>
            </Card>
          </div>

          {/* Current Task */}
          <Card className="institutional-card p-6 border-accent">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-accent" />
                <h3 className="font-institutional text-base uppercase tracking-wide">Current Assignment</h3>
              </div>
              <div className="space-y-3">
                <p className="text-foreground font-medium">"Complete Initial Doctrine Reading"</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Type: SCRIPTURE STUDY</span>
                  <span>Due: 12 HOURS</span>
                </div>
                <Button 
                  className="w-full institutional-button font-mono"
                  onClick={() => navigate('/doctrine')}
                >
                  PROCEED TO ASSIGNMENT
                </Button>
              </div>
            </div>
          </Card>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Lesson */}
            <Card className="institutional-card p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <h3 className="font-institutional text-base uppercase tracking-wide">Active Lesson</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-foreground font-medium">Scripture I: Foundational Obedience</p>
                  <p className="text-sm text-muted-foreground">Status: IN PROGRESS</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-accent">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-accent text-accent hover:bg-accent/10 font-mono"
                    onClick={() => navigate('/doctrine')}
                  >
                    CONTINUE LESSON
                  </Button>
                </div>
              </div>
            </Card>

            {/* Tribute Status */}
            <Card className="institutional-card p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <h3 className="font-institutional text-base uppercase tracking-wide">Tribute Status</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-mono text-accent">$27.00</p>
                  <p className="text-sm text-muted-foreground">Next Due: 2 DAYS</p>
                  <Button 
                    className="w-full institutional-button font-mono"
                    onClick={() => navigate('/tribute')}
                  >
                    PAY TRIBUTE
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent/10 font-mono p-4 h-auto"
              onClick={() => navigate('/assignments')}
            >
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>DAILY RITUAL</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="border-muted-foreground text-muted-foreground hover:bg-muted/20 font-mono p-4 h-auto"
              onClick={() => navigate('/social')}
            >
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>COMMUNITY</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PledgeHall;