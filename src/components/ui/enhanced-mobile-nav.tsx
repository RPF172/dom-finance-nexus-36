import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, Gamepad2, Calendar, Menu, Bell, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import MainNavigation from '@/components/layout/MainNavigation';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  gradient?: boolean;
}

const getNavItems = (isAuthenticated: boolean): NavItem[] => [
  { href: '/pledgehall', icon: Home, label: 'Dashboard' },
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/compete', icon: Gamepad2, label: 'Games' },
];

export function EnhancedMobileNav() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Mock notifications
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const handleNavClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  const quickActions = [
    { icon: Search, label: 'Search', action: () => console.log('Search') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications'), badge: hasNotifications },
    { icon: User, label: 'Profile', action: () => console.log('Profile') },
  ];

  return (
    <>
      {/* Enhanced Mobile Navigation */}
      <nav className="mobile-nav">
        <div className="grid grid-cols-5 h-20 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "touch-target flex flex-col items-center justify-center space-y-1 relative transition-all duration-300 rounded-2xl mx-1",
                  isActive 
                    ? "text-primary scale-105" 
                    : "text-muted-foreground hover:text-foreground active:text-primary hover:scale-105"
                )}
                aria-label={item.label}
                onClick={handleNavClick}
              >
                <div className="relative">
                  {/* Enhanced icon container */}
                  <div className={cn(
                    "relative p-2 rounded-xl transition-all duration-300",
                    isActive && item.gradient 
                      ? "crimson-gradient shadow-lg" 
                      : isActive 
                      ? "bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}>
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isActive && item.gradient ? "text-white" : "",
                        isActive ? "drop-shadow-sm" : ""
                      )} 
                    />
                    
                    {/* Notification badge */}
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Enhanced label */}
                <span className={cn(
                  "text-xs font-medium transition-all duration-300 max-w-full truncate px-1",
                  isActive ? "font-semibold" : ""
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
          
          {/* Enhanced More tab with sidebar */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "touch-target flex flex-col items-center justify-center space-y-1 relative transition-all duration-300 rounded-2xl mx-1",
                  "text-muted-foreground hover:text-foreground active:text-primary hover:scale-105"
                )}
                aria-label="More options"
              >
                <div className="relative p-2 rounded-xl transition-all duration-300 hover:bg-muted/50">
                  <Menu className="h-5 w-5 transition-all duration-300" />
                  {hasNotifications && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-xs font-medium transition-all duration-300 max-w-full truncate px-1">
                  More
                </span>
              </button>
            </SheetTrigger>
            
            <SheetContent 
              side="bottom" 
              className="h-[85vh] p-0 border-t-0 rounded-t-3xl bg-background/95 backdrop-blur-xl"
            >
              <div className="h-full overflow-y-auto">
                <SheetHeader className="p-6 pb-4">
                  <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                  <SheetTitle className="font-institutional uppercase tracking-wide">
                    Navigation & Quick Actions
                  </SheetTitle>
                </SheetHeader>
                
                {/* Quick Search */}
                <div className="px-6 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search anything..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl border-border/30 bg-muted/20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-6 mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {quickActions.map((action, index) => {
                      const ActionIcon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-20 flex-col space-y-2 border-border/30 bg-muted/20 backdrop-blur-sm hover:bg-muted/40 transition-all duration-300"
                          onClick={action.action}
                        >
                          <div className="relative">
                            <ActionIcon className="h-6 w-6" />
                            {action.badge && (
                              <div className="absolute -top-2 -right-2 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                            )}
                          </div>
                          <span className="text-xs font-medium">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator className="mb-4" />
                
                {/* Full Navigation */}
                <div className="px-6">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    All Pages
                  </h3>
                  <MainNavigation />
                </div>

                {/* Bottom Safe Area */}
                <div className="h-8 mobile-safe-area" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-20 md:hidden" />
    </>
  );
}