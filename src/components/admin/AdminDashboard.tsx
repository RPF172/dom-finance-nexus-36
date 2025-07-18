import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BookOpen, DollarSign, TrendingUp, Clock } from "lucide-react";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [
        { data: applications },
        { data: profiles },
        { data: lessons },
        { data: tributes },
        { data: progress }
      ] = await Promise.all([
        supabase.from('applications').select('status'),
        supabase.from('profiles').select('id'),
        supabase.from('lessons').select('published'),
        supabase.from('tributes').select('amount, status'),
        supabase.from('user_lesson_progress').select('completed, created_at')
      ]);

      const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;
      const totalStudents = profiles?.length || 0;
      const publishedLessons = lessons?.filter(lesson => lesson.published).length || 0;
      const totalRevenue = tributes?.reduce((sum, tribute) => sum + (tribute.amount || 0), 0) || 0;
      const recentCompletions = progress?.filter(p => 
        p.completed && new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      return {
        pendingApplications,
        totalStudents,
        publishedLessons,
        totalRevenue: totalRevenue / 100, // Convert from cents
        recentCompletions
      };
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 bg-primary animate-pulse"></div>
          <h1 className="text-3xl font-bold text-foreground">Administrative Command Center</h1>
        </div>
        <p className="text-muted-foreground">Monitor and manage MAGAT University operations</p>
        <div className="w-full bg-muted h-1 rounded-full mt-4 overflow-hidden">
          <div className="bg-primary h-1 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        <StatsCard
          title="Pending Applications"
          value={stats?.pendingApplications || 0}
          icon={FileText}
          description="Awaiting review"
          trend={+12}
        />
        <StatsCard
          title="Active Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          description="Enrolled users"
          trend={+5}
        />
        <StatsCard
          title="Published Lessons"
          value={stats?.publishedLessons || 0}
          icon={BookOpen}
          description="Available content"
          trend={+3}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          description="All-time tributes"
          trend={+8}
        />
        <StatsCard
          title="Recent Completions"
          value={stats?.recentCompletions || 0}
          icon={TrendingUp}
          description="This week"
          trend={+15}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary animate-pulse" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest university activity and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                Quick Actions
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;