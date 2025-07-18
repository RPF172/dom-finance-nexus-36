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
    <Card className="relative overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl border-l-4 border-l-accent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-accent hover:scale-110 transition-transform" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground animate-fade-in">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs mt-2 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]",
            isPositiveTrend ? "text-green-400" : "text-red-400"
          )}>
            <TrendIcon className="h-3 w-3 mr-1 animate-pulse" />
            {Math.abs(trend)}% from last month
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;