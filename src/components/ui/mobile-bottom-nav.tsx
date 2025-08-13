import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, User, Menu, BookOpen, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MainNavigation from '@/components/layout/MainNavigation';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const getNavItems = (isAuthenticated: boolean): NavItem[] => [
  { href: '/pledgehall', icon: Home, label: 'Dashboard' },
  { href: '/learning-hub', icon: BookOpen, label: 'Learning' },
  { href: '/social', icon: Users, label: 'Community' },
  { href: '/compete', icon: Gamepad2, label: 'Games' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Track menu collapse for mobile nav
  const handleNavClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  } 
  
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user;
    }
  });

  // Don't show on landing page or auth page
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }

  const navItems = getNavItems(!!user);

  return (
    <nav className="mobile-nav bg-card/95 backdrop-blur-sm">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "touch-target flex flex-col items-center justify-center space-y-1 relative transition-colors duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:text-primary"
              )}
              aria-label={item.label}
              onClick={handleNavClick}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive ? "scale-110" : "hover:scale-105"
                  )} 
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "scale-105" : ""
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
        
        {/* More tab with sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <button
              className="touch-target flex flex-col items-center justify-center space-y-1 relative transition-colors duration-200 text-muted-foreground hover:text-foreground active:text-primary"
              aria-label="More"
            >
              <Menu className="h-5 w-5 transition-all duration-200 hover:scale-105" />
              <span className="text-xs font-medium transition-all duration-200">
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Navigation</h2>
              </div>
              <MainNavigation />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}