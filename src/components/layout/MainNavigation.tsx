import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  PenTool, 
  Users, 
  MessageSquare, 
  User, 
  DollarSign,
  Shield,
  Trophy,
  Calendar,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  category: 'main' | 'learning' | 'social' | 'games' | 'account' | 'admin';
}

const navigationItems: NavItem[] = [
  // Main Dashboard
  { path: '/pledgehall', icon: Home, label: 'Dashboard', description: 'Your Hub', category: 'main' },
  
  // Learning Hub (updated with slide experience)
  { path: '/modules', icon: Zap, label: 'Interactive Modules', description: 'Slide-based Training', category: 'learning' },
  { path: '/learn', icon: Calendar, label: 'Training Weeks', description: 'Structured Learning', category: 'learning' },
  { path: '/learning-hub', icon: BookOpen, label: 'Learning Hub', description: 'All Training Content', category: 'learning' },
  
  // Community  
  { path: '/social', icon: MessageSquare, label: 'Community', description: 'Social Feed', category: 'social' },
  { path: '/friends', icon: Users, label: 'Friends', description: 'Your Network', category: 'social' },
  
  // Games
  { path: '/compete', icon: Trophy, label: 'Games', description: 'Compete & Play', category: 'games' },
  
  // Profile & Account
  { path: '/profile', icon: User, label: 'Profile', description: 'Your Account', category: 'account' },
  { path: '/tribute', icon: DollarSign, label: 'Tribute', description: 'Payments', category: 'account' },
  
  // Admin
  { path: '/admin', icon: Shield, label: 'Admin Panel', description: 'Management', category: 'admin' },
];

const MainNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/pledgehall' && location.pathname === '/pledgehall') return true;
    if (path !== '/pledgehall' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const groupedItems = {
    main: navigationItems.filter(item => item.category === 'main'),
    learning: navigationItems.filter(item => item.category === 'learning'),
    social: navigationItems.filter(item => item.category === 'social'),
    games: navigationItems.filter(item => item.category === 'games'),
    account: navigationItems.filter(item => item.category === 'account'),
    admin: navigationItems.filter(item => item.category === 'admin'),
  };

  const NavSection: React.FC<{ title: string; items: NavItem[] }> = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="px-6 py-2 text-xs font-institutional uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <nav className="space-y-1 px-3">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.label}</div>
                <div className="text-xs opacity-70 truncate">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="h-full py-6">
      <NavSection title="Dashboard" items={groupedItems.main} />
      <NavSection title="Learning" items={groupedItems.learning} />
      <NavSection title="Community" items={groupedItems.social} />
      <NavSection title="Games" items={groupedItems.games} />
      <NavSection title="Account" items={groupedItems.account} />
      <NavSection title="Administration" items={groupedItems.admin} />
    </div>
  );
};

export default MainNavigation;