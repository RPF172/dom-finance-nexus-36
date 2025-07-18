import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import MainNavigation from '@/components/layout/MainNavigation';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, showNavigation = true }) => {
  const location = useLocation();
  const { isMobile } = useMobileDetection();
  
  // Don't show navigation on landing page, auth page, or mobile
  const hideNav = location.pathname === '/' || location.pathname === '/auth' || isMobile;
  const shouldShowNav = showNavigation && !hideNav;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {shouldShowNav && (
          <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border overflow-y-auto z-40">
            <MainNavigation />
          </aside>
        )}
        <main className={`flex-1 ${shouldShowNav ? 'ml-64' : ''} pt-16`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;