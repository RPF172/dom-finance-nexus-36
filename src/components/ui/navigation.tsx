import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, User, Settings, MessageSquare, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
}

const mainNavItems: NavItem[] = [
  { path: '/', icon: Home, label: 'Home', description: 'Command Center' },
  { path: '/pledgehall', icon: Target, label: 'Pledge Hall', description: 'Your Status' },
  { path: '/doctrine', icon: BookOpen, label: 'Doctrine', description: 'Scriptures' },
  { path: '/assignments', icon: Settings, label: 'Assignments', description: 'Tasks' },
  { path: '/social', icon: MessageSquare, label: 'Social', description: 'Community' },
  { path: '/friends', icon: Users, label: 'Friends', description: 'Connections' },
  { path: '/tribute', icon: DollarSign, label: 'Tribute', description: 'Payments' },
  { path: '/profile', icon: User, label: 'Profile', description: 'Settings' },
];

interface MainNavigationProps {
  className?: string;
  onNavigate?: () => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ className, onNavigate }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={cn("space-y-2", className)}>
      {mainNavItems.map((item) => {
        const active = isActive(item.path);
        const IconComponent = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 p-3 transition-all duration-200 w-full",
              active 
                ? "bg-accent/20 text-accent border border-accent/30" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <IconComponent className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-institutional text-sm uppercase tracking-wide">
                {item.label}
              </div>
              {item.description && (
                <div className="text-xs opacity-70">
                  {item.description}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};