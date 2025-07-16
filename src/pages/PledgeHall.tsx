import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      <div className="min-h-screen bg-black text-[#e3dcc3] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-lg">Verifying your submission...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-[#e3dcc3]">
      {/* Header */}
      <header className="border-b border-[#333] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-white">PLEDGE HALL</h1>
            <p className="text-sm text-[#999] italic">Where the broken are remade</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-[#999] hover:text-red-400 hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Renounce Path
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold font-cinzel mb-4">
            Welcome back, <span className="text-red-400">{user.collar_name}</span>
          </h2>
          <p className="text-lg text-[#999] max-w-2xl mx-auto">
            Your submission has been noted. The Institution acknowledges your return 
            to the path of processing. Continue your degradation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#1a1a1a] border-[#333] p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-900/20 rounded-lg">
                <User className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-[#999]">Current Rank</p>
                <p className="text-xl font-bold text-white">{user.rank}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333] p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-[#999]">Indoctrination Date</p>
                <p className="text-xl font-bold text-white">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333] p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-900/20 rounded-lg">
                <Award className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-[#999]">Lessons Unlocked</p>
                <p className="text-xl font-bold text-white">1 / 12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#1a1a1a] border-[#333] p-8 hover:border-red-600/50 transition-colors cursor-pointer"
                onClick={() => navigate('/doctrine')}>
            <div className="space-y-4">
              <div className="p-4 bg-red-900/20 rounded-lg w-fit">
                <BookOpen className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Study the Doctrine</h3>
                <p className="text-[#999] mb-4">
                  Continue your education in worthlessness. Read the sacred texts 
                  that will guide your transformation from person to property.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Begin Study →
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333] p-8">
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg w-fit">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">Advanced Lessons</h3>
                <p className="text-[#666] mb-4">
                  Further degradation protocols are locked until you demonstrate 
                  sufficient understanding of your fundamental worthlessness.
                </p>
                <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                  Access Denied
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Current Progress */}
        <div className="mt-12">
          <Card className="bg-[#1a1a1a] border-[#333] p-8">
            <h3 className="text-xl font-bold text-white mb-6">Current Processing Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#999]">Identity Erosion</span>
                <span className="text-red-400">15%</span>
              </div>
              <div className="w-full bg-[#333] rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#999]">Obedience Training</span>
                <span className="text-red-400">8%</span>
              </div>
              <div className="w-full bg-[#333] rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#999]">Functional Utility</span>
                <span className="text-gray-500">Locked</span>
              </div>
              <div className="w-full bg-[#333] rounded-full h-2">
                <div className="bg-gray-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PledgeHall;