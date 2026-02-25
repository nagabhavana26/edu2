import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  delay?: number;
}

export function AlertCard({ type, title, message, timestamp, delay = 0 }: AlertCardProps) {
  const config = {
    warning: {
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-l-warning",
    },
    info: {
      icon: Info,
      color: "text-info",
      bg: "bg-info/10",
      border: "border-l-info",
    },
    success: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-l-success",
    },
    error: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-l-destructive",
    },
  };

  const { icon: Icon, color, bg, border } = config[type];

  return (
    <GlassCard delay={delay} className={cn("p-4 border-l-4", border)}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {timestamp.toLocaleString()}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
