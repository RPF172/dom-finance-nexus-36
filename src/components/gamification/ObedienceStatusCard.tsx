import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useObedience } from '@/hooks/useObedience';

interface ObedienceStatusCardProps {
  targetUserId?: string;
}

const ObedienceStatusCard: React.FC<ObedienceStatusCardProps> = ({ targetUserId }) => {
  const { data } = useObedience(targetUserId);

  const total = data?.summary?.total_points ?? 0;
  const tierTitle = data?.currentTier?.title ?? 'Unranked';
  const nextTitle = data?.nextTier?.title ?? null;
  const progress = data?.progressPercent ?? 0;
  const pointsToNext = data?.pointsToNext ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg tracking-wide">OBEDIENCE STATUS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Total OP</div>
            <div className="text-3xl font-bold">{total}</div>
          </div>
          <Badge variant="outline" className="uppercase tracking-wide">
            {tierTitle}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress {nextTitle ? `to ${nextTitle}` : '(Max tier)'}</span>
            <span className="text-primary font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {nextTitle && (
            <div className="text-xs text-muted-foreground">{pointsToNext} OP to reach {nextTitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObedienceStatusCard;
