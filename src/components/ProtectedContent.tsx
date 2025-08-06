import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionModal from './SubscriptionModal';
import { LoadingSpinner } from './ui/loading-spinner';

interface ProtectedContentProps {
  children: React.ReactNode;
  showModal?: boolean;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ 
  children, 
  showModal = true 
}) => {
  const { subscribed, loading } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        setIsAdmin(!!userRole);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!loading && !subscribed && showModal && !isAdmin) {
      setShowSubscriptionModal(true);
    }
  }, [loading, subscribed, showModal, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!subscribed && !isAdmin) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-institutional mb-4">Access Required</h2>
            <p className="text-muted-foreground mb-6">
              You need an active subscription to access this content.
            </p>
            <button 
              onClick={() => setShowSubscriptionModal(true)}
              className="institutional-button px-6 py-3"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
        
        <SubscriptionModal 
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;