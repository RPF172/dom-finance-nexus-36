
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  return (
    <header className="institutional-header fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border">
      <div className="section-container !py-4 flex justify-between items-center">
        <Link to={user ? '/pledgehall' : '/'} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 bg-primary"></div>
          <span className="text-2xl font-institutional text-foreground tracking-wide">MAGAT UNIVERSITY</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!isLandingPage && !isAuthPage && (
            <div className="text-xs font-mono text-muted-foreground hidden md:block">
              INSTITUTIONAL COMMAND CENTER
            </div>
          )}
          
          {user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            !isAuthPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="institutional-button"
              >
                LOGIN
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
