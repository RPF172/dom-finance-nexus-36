import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useObedienceLedger } from '@/hooks/useObedienceLedger';
import { formatDistanceToNow } from 'date-fns';

const actionLabels: Record<string, string> = {
  post: 'Post created',
  comment: 'Comment added',
  read_doc: 'Lesson read',
  task_complete: 'Task completed',
  assignment_complete: 'Assignment completed',
  media_upload: 'Media uploaded',
  tribute_paid: 'Tribute paid',
};

const ObedienceLedgerList: React.FC<{ limit?: number }> = ({ limit = 8 }) => {
  const { data, isLoading, error } = useObedienceLedger(limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg tracking-wide">RECENT OP ACTIVITY</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">Failed to load activity.</div>
        ) : !data || data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No recent activity.</div>
        ) : (
          <ul className="space-y-3">
            {data.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {actionLabels[entry.action_type] ?? entry.action_type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">+{entry.points} OP</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ObedienceLedgerList;
