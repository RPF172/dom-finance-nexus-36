import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: hasAdminRole, error } = await supabase
          .rpc('has_role', { 
            _user_id: session.user.id, 
            _role: 'admin' 
          });

        if (error) {
          console.error('Error checking admin role:', error);
          toast({
            title: "Access Error",
            description: "Failed to verify admin permissions.",
            variant: "destructive",
          });
          setIsAdmin(false);
        } else {
          setIsAdmin(hasAdminRole);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default Admin;