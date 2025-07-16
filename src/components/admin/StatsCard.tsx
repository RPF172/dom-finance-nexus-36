import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
}

const StatsCard = ({ title, value, icon: Icon, description, trend }: StatsCardProps) => {
  const isPositiveTrend = trend && trend > 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            isPositiveTrend ? "text-green-400" : "text-red-400"
          )}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {Math.abs(trend)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;