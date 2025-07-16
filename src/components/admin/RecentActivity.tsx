import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Get recent applications
      const { data: applications } = await supabase
        .from('applications')
        .select('name, email, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent lesson completions
      const { data: completions } = await supabase
        .from('user_lesson_progress')
        .select(`
          completed_at,
          user_id,
          lessons!inner(title)
        `)
        .eq('completed', true)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(5);

      // Get recent tributes  
      const { data: tributes } = await supabase
        .from('tributes')
        .select(`
          amount,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort all activities
      const allActivities = [
        ...(applications?.map(app => ({
          type: 'application' as const,
          title: `New application from ${app.name}`,
          description: app.email,
          timestamp: app.created_at,
          status: app.status,
          avatar: app.name.charAt(0).toUpperCase()
        })) || []),
        ...(completions?.map(comp => ({
          type: 'completion' as const,
          title: `Lesson completed`,
          description: `Student completed "${comp.lessons?.title}"`,
          timestamp: comp.completed_at,
          status: 'completed',
          avatar: 'S'
        })) || []),
        ...(tributes?.map(tribute => ({
          type: 'tribute' as const,
          title: `Tribute received`,
          description: `Student paid $${(tribute.amount / 100).toFixed(2)}`,
          timestamp: tribute.created_at,
          status: 'paid',
          avatar: 'S'
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .slice(0, 10);

      return allActivities;
    },
  });

  const getStatusColor = (type: string, status: string) => {
    if (type === 'application') {
      switch (status) {
        case 'pending': return 'bg-yellow-500/20 text-yellow-400';
        case 'approved': return 'bg-green-500/20 text-green-400';
        case 'rejected': return 'bg-red-500/20 text-red-400';
        default: return 'bg-muted text-muted-foreground';
      }
    }
    if (type === 'completion') return 'bg-blue-500/20 text-blue-400';
    if (type === 'tribute') return 'bg-primary/20 text-primary';
    return 'bg-muted text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="w-10 h-10 bg-muted rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {activity.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(activity.type, activity.status)}
                >
                  {activity.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        {!activities?.length && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity found
          </p>
        )}
      </div>
    </ScrollArea>
  );
};

export default RecentActivity;