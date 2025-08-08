import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useObedienceLeaderboard } from '@/hooks/useLeaderboard';

const ObedienceLeaderboardCard: React.FC<{ limit?: number }> = ({ limit = 10 }) => {
  const { data, isLoading, error } = useObedienceLeaderboard(limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg tracking-wide">LEADERBOARD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">Failed to load leaderboard.</div>
        ) : !data || data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No rankings available yet.</div>
        ) : (
          <ol className="space-y-3">
            {data.map((row) => (
              <li key={row.user_id} className="flex items-center gap-3">
                <div className="w-6 text-center font-mono text-sm">{row.rank}</div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={row.avatar_url ?? undefined} alt={row.display_name ?? 'User'} />
                  <AvatarFallback>{(row.display_name?.[0] ?? 'U').toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{row.display_name ?? 'Anonymous'}</div>
                </div>
                <div className="font-mono text-sm">{row.total_points} OP</div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};

export default ObedienceLeaderboardCard;
