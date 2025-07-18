import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';

const Auth: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/pledgehall');
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/pledgehall');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthSuccess = () => {
    navigate('/pledgehall');
  };

  return (
    <AppLayout showNavigation={false}>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Auth;