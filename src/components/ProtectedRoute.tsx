import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        setLoading(false);
        return;
      }
      // Check if user is admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (userRole && userRole.role === 'admin') {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
      // TODO: Insert subscription check here if needed for non-admins
      setIsAuthenticated(true); // fallback: allow access for all authenticated users
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
