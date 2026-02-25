import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  delay = 0,
}: StatCardProps) {
  const changeColors = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <GlassCard hover delay={delay} className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn("text-sm mt-2", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconColor === "text-primary" && "bg-primary/10",
            iconColor === "text-success" && "bg-success/10",
            iconColor === "text-warning" && "bg-warning/10",
            iconColor === "text-info" && "bg-info/10"
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </GlassCard>
  );
}
