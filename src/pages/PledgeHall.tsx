import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User, Award, Clock, CreditCard, AlertTriangle, Calendar, Play, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SlidingBottomNav from '@/components/SlidingBottomNav';

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
    <div className="min-h-screen bg-black text-[#e5e0d1] font-mono">
      {/* Header */}
      <header className="border-b border-[#333] bg-black p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#A1001F] rotate-45"></div>
              <h1 className="text-lg font-bold font-serif tracking-wider">MAGAT UNIVERSITY</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#A1001F] rotate-45"></div>
              <h2 className="text-lg font-serif tracking-wider">PLEDGEHALL</h2>
            </div>
            <Badge variant="outline" className="border-[#A1001F] text-[#A1001F] text-xs font-mono mt-2">
              RANK: {user.rank?.toUpperCase()}
            </Badge>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-[#666] hover:text-[#A1001F] hover:bg-[#A1001F]/10 p-2"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Rank Badge */}
        <Card className="bg-[#0a0a0a] border-[#333] p-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-[#A1001F]/20 border border-[#A1001F] flex items-center justify-center">
              <div className="w-8 h-8 bg-[#A1001F] rotate-45"></div>
            </div>
            <p className="text-sm text-[#999]">You are ranked:</p>
            <p className="font-serif text-lg text-[#A1001F]">{user.rank?.toUpperCase()}</p>
            <p className="text-xs text-[#666]">Status: UNTRUSTED</p>
          </div>
        </Card>

        {/* Current Task */}
        <Card className="bg-[#0a0a0a] border-[#A1001F] p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#A1001F]" />
              <h3 className="font-serif text-sm">CURRENT TASK</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm">"Recite The First Scripture"</p>
              <div className="flex justify-between text-xs text-[#999]">
                <span>Type: Ritual</span>
                <span>Due: 12h</span>
              </div>
              <Button 
                className="w-full bg-[#A1001F] hover:bg-[#A1001F]/80 text-white font-mono text-xs h-8"
                onClick={() => navigate('/doctrine')}
              >
                [ CONFESS COMPLETION ]
              </Button>
            </div>
          </div>
        </Card>

        {/* Active Lesson */}
        <Card className="bg-[#0a0a0a] border-[#333] p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#A1001F]" />
              <h3 className="font-serif text-sm">ACTIVE LESSON</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm">Scripture I: Obedience</p>
              <p className="text-xs text-[#999]">Status: In Progress</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-2 bg-[#333]" />
              </div>
              <Button 
                variant="outline" 
                className="w-full border-[#A1001F] text-[#A1001F] hover:bg-[#A1001F]/10 font-mono text-xs h-8"
                onClick={() => navigate('/doctrine')}
              >
                [ CONTINUE LESSON ]
              </Button>
            </div>
          </div>
        </Card>

        {/* Tribute Balance */}
        <Card className="bg-[#0a0a0a] border-[#A1001F] p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#A1001F]" />
              <h3 className="font-serif text-sm">TRIBUTE BALANCE</h3>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-mono text-[#A1001F]">$27.00</p>
              <p className="text-xs text-[#999]">Next Due: 2 Days</p>
              <Button 
                className="w-full bg-[#A1001F] hover:bg-[#A1001F]/80 text-white font-mono text-xs h-8"
              >
                [ PAY TRIBUTE NOW ]
              </Button>
            </div>
          </div>
        </Card>

        {/* Punishment Tracking */}
        <Card className="bg-[#0a0a0a] border-[#666] p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#A1001F]" />
              <h3 className="font-serif text-sm">PUNISHMENT TRACKING</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm">Next Punishment: Scheduled</p>
              <p className="text-xs text-[#999]">Date: 07/18 @ 8:00 PM</p>
              <p className="text-xs text-[#999]">Assigned by: MASTER CARLOS</p>
              <Button 
                variant="outline" 
                className="w-full border-[#666] text-[#666] hover:bg-[#666]/10 font-mono text-xs h-8"
              >
                [ VIEW PUNISHMENT RITUAL ]
              </Button>
            </div>
          </div>
        </Card>

        {/* Button Strip */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="border-[#A1001F] text-[#A1001F] hover:bg-[#A1001F]/10 font-mono text-xs h-10"
          >
            🏁 Begin Daily Ritual
          </Button>
          <Button 
            variant="outline" 
            className="border-[#A1001F] text-[#A1001F] hover:bg-[#A1001F]/10 font-mono text-xs h-10"
          >
            💀 Submit Sin
          </Button>
        </div>
      </div>

      <SlidingBottomNav />

      {/* Bottom padding for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default PledgeHall;