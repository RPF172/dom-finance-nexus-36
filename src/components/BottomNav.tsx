import React from 'react';
import { Flame, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }> | string;
  label: string;
}

const BottomNav = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/doctrine', icon: Flame, label: 'Doctrine' },
    { path: '/assignments', icon: '🧷', label: 'Assignments' },
    { path: '/pledgehall', icon: '🏛️', label: 'Pledgehall' },
    { path: '/tribute', icon: '💸', label: 'Tribute' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-muted z-50">
      <div className="max-w-md mx-auto px-2 py-3">
        <div className="flex justify-around text-xs">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = typeof item.icon === 'string' ? null : item.icon as React.ComponentType<{ className?: string }>;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors ${
                  active 
                    ? 'text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {IconComponent ? (
                  <IconComponent className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4 flex items-center justify-center text-sm">
                    {typeof item.icon === 'string' ? item.icon : ''}
                  </span>
                )}
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;