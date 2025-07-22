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
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  category: 'main' | 'learning' | 'social' | 'admin';
}

const navigationItems: NavItem[] = [
  // Main
  { path: '/pledgehall', icon: Home, label: 'Dashboard', description: 'Command Center', category: 'main' },
  
  // Learning
  { path: '/read', icon: BookOpen, label: 'Read', description: 'Narrative Chapters', category: 'learning' },
  { path: '/learn', icon: PenTool, label: 'Learn', description: 'Educational Lessons', category: 'learning' },
  { path: '/assignments', icon: PenTool, label: 'Assignments', description: 'Your Tasks', category: 'learning' },
  
  // Social
  { path: '/social', icon: MessageSquare, label: 'Social Feed', description: 'Community', category: 'social' },
  { path: '/friends', icon: Users, label: 'Connections', description: 'Your Network', category: 'social' },
  
  // User
  { path: '/tribute', icon: DollarSign, label: 'Tribute', description: 'Payments', category: 'main' },
  { path: '/profile', icon: User, label: 'Profile', description: 'Your Account', category: 'main' },
  
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
      <NavSection title="Dashboard" items={groupedItems.main.slice(0, 1)} />
      <NavSection title="Learning" items={groupedItems.learning} />
      <NavSection title="Community" items={groupedItems.social} />
      <NavSection title="Account" items={groupedItems.main.slice(1)} />
      <NavSection title="Administration" items={groupedItems.admin} />
    </div>
  );
};

export default MainNavigation;