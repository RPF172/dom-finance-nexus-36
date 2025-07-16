import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Home, 
  BookOpen, 
  Users, 
  DollarSign, 
  User, 
  PenTool,
  Trophy,
  Clock,
  Target
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  category: 'primary' | 'learning' | 'social';
}

interface UserStats {
  lessonsCompleted: number;
  totalLessons: number;
  tributesPaid: number;
  currentStreak: number;
  rank: string;
}

const SlidingBottomNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  
  const navItems: NavItem[] = [
    // Primary Navigation
    { path: '/', icon: Home, label: 'Home', category: 'primary' },
    { path: '/profile', icon: User, label: 'Profile', category: 'primary' },
    
    // Learning
    { path: '/doctrine', icon: BookOpen, label: 'Doctrine', category: 'learning' },
    { path: '/assignments', icon: PenTool, label: 'Assignments', category: 'learning' },
    { path: '/lesson', icon: Target, label: 'Lessons', category: 'learning' },
    
    // Social & Activities
    { path: '/pledgehall', icon: Users, label: 'Pledge Hall', category: 'social' },
    { path: '/tribute', icon: DollarSign, label: 'Tribute', category: 'social' },
  ];

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const [
        { data: progress },
        { data: lessons },
        { data: tributes },
        { data: profile }
      ] = await Promise.all([
        supabase
          .from('user_lesson_progress')
          .select('completed, lesson_id')
          .eq('user_id', session.user.id),
        supabase
          .from('lessons')
          .select('id')
          .eq('published', true),
        supabase
          .from('tributes')
          .select('amount')
          .eq('user_id', session.user.id),
        supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', session.user.id)
          .single()
      ]);

      const completedLessons = progress?.filter(p => p.completed).length || 0;
      const totalLessons = lessons?.length || 0;
      const totalTributes = tributes?.reduce((sum, t) => sum + (t.amount / 100), 0) || 0;
      
      return {
        lessonsCompleted: completedLessons,
        totalLessons,
        tributesPaid: totalTributes,
        currentStreak: 3, // TODO: Calculate actual streak
        rank: profile?.display_name || 'Novice'
      } as UserStats;
    }
  });

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const groupedItems = {
    primary: navItems.filter(item => item.category === 'primary'),
    learning: navItems.filter(item => item.category === 'learning'),
    social: navItems.filter(item => item.category === 'social'),
  };

  // Close menu when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sliding Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Collapsed State - Toggle Button */}
        {!isExpanded && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-3 rounded-t-xl shadow-lg hover:bg-primary transition-all duration-200 hover:scale-105"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Expanded State */}
        <div
          className={`bg-card/95 backdrop-blur-lg border-t border-border transition-all duration-300 ${
            isExpanded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}
        >
          {/* Header with Close Button */}
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Quick Access</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* User Stats */}
          {userStats && (
            <div className="p-4 border-b border-border">
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-sm font-semibold">
                          {userStats.lessonsCompleted}/{userStats.totalLessons}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tributes</p>
                        <p className="text-sm font-semibold">${userStats.tributesPaid.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Streak</p>
                        <p className="text-sm font-semibold">{userStats.currentStreak} days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rank</p>
                        <p className="text-sm font-semibold">{userStats.rank}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="p-4 pb-6">
            {/* Primary Navigation */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Primary</h4>
              <div className="grid grid-cols-2 gap-3">
                {groupedItems.primary.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        active 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Learning Navigation */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Learning</h4>
              <div className="grid grid-cols-1 gap-2">
                {groupedItems.learning.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        active 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {active && <Badge variant="secondary" className="ml-auto">Active</Badge>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Social Navigation */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Community</h4>
              <div className="grid grid-cols-1 gap-2">
                {groupedItems.social.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        active 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {active && <Badge variant="secondary" className="ml-auto">Active</Badge>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlidingBottomNav;