import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckSquare, FileText, Target } from 'lucide-react';
import { Week } from '@/hooks/useWeeks';

interface WeekCardProps {
  week: Week;
  onClick?: () => void;
  className?: string;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week, onClick, className }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-mono">
            Week {week.week_number}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-3 w-3" />
          </div>
        </div>
        <CardTitle className="text-lg font-institutional uppercase tracking-wide">
          {week.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {week.objective && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {week.objective}
          </p>
        )}
        
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{week.total_modules} Modules</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckSquare className="h-3 w-3" />
            <span>{week.total_tasks} Tasks</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>{week.total_assignments} Assignments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};