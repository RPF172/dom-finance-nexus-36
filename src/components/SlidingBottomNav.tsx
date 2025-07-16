import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  X, 
  Home, 
  BookOpen, 
  Users, 
  DollarSign, 
  User, 
  PenTool,
  Trophy,
  Clock,
  Target,
  Settings,
  MessageSquare
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
    { path: '/admin', icon: Settings, label: 'Admin Panel', category: 'primary' },
    
    // Learning
    { path: '/doctrine', icon: BookOpen, label: 'Doctrine', category: 'learning' },
    { path: '/assignments', icon: PenTool, label: 'Assignments', category: 'learning' },
    { path: '/lesson', icon: Target, label: 'Lessons', category: 'learning' },
    
    // Social & Activities
    { path: '/social', icon: MessageSquare, label: 'Social Feed', category: 'social' },
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
      {/* Dashboard Toggle Button - Fixed in Upper Left */}
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-4 left-4 z-[9999] bg-primary/90 backdrop-blur-sm text-primary-foreground p-3 rounded-lg shadow-lg hover:bg-primary transition-all duration-200 hover:scale-105 pointer-events-auto"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sliding Menu Container - Left Side */}
      <div className="fixed left-0 top-0 bottom-0 z-[9999] pointer-events-none">
        {/* Expanded Menu Content */}
        <div
          className={`bg-card/95 backdrop-blur-lg border-r border-border transform transition-transform duration-300 ease-out w-80 h-full overflow-y-auto pointer-events-auto ${
            isExpanded 
              ? 'translate-x-0' 
              : '-translate-x-full'
          }`}
        >
          {/* Header with Close Button */}
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Quick Access</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
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
              <div className="space-y-2">
                {groupedItems.primary.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full ${
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
              <div className="space-y-2">
                {groupedItems.learning.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full ${
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
              <div className="space-y-2">
                {groupedItems.social.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full ${
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