import React, { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LessonList from "@/components/admin/content/LessonList";
import LessonEditor from "@/components/admin/content/LessonEditor";
import { WeekModuleManager } from '@/components/admin/WeekModuleManager';
import { WeekSlideManager } from '@/components/admin/WeekSlideManager';
import ModuleManager from "@/components/admin/content/ModuleManager";

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
          console.log('Admin role check result:', hasAdminRole, 'for user:', session.user.email);
          if (!hasAdminRole) {
            toast({
              title: "Access Denied",
              description: "You need admin privileges to access this area. Please contact an administrator.",
              variant: "destructive",
            });
          }
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
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="week-slides" element={<WeekSlideManager />} />
        <Route path="week-modules" element={<WeekModuleManager />} />
        <Route path="content" element={<LessonList />} />
        <Route path="content/new" element={<LessonEditor />} />
        <Route path="content/edit/:id" element={<LessonEditor />} />
        <Route path="content/modules" element={<ModuleManager />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;