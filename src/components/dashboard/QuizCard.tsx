import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, PlayCircle, CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  status: "upcoming" | "active" | "completed" | "locked";
  startTime?: Date;
  score?: number;
  delay?: number;
  onStart?: () => void;
}

export function QuizCard({
  title,
  subject,
  duration,
  totalQuestions,
  status,
  startTime,
  score,
  delay = 0,
  onStart,
}: QuizCardProps) {
  const statusConfig = {
    upcoming: {
      icon: Clock,
      label: "Upcoming",
      color: "text-warning bg-warning/10",
      borderColor: "border-l-warning",
    },
    active: {
      icon: PlayCircle,
      label: "Active Now",
      color: "text-success bg-success/10",
      borderColor: "border-l-success",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      color: "text-primary bg-primary/10",
      borderColor: "border-l-primary",
    },
    locked: {
      icon: Lock,
      label: "Locked",
      color: "text-muted-foreground bg-muted",
      borderColor: "border-l-muted-foreground",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <GlassCard hover delay={delay} className={cn("p-5 border-l-4", config.borderColor)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.color)}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>
        {score !== undefined && (
          <span className="text-2xl font-bold text-primary">{score}%</span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{subject}</p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {duration} mins
        </span>
        <span>{totalQuestions} questions</span>
      </div>

      {startTime && status === "upcoming" && (
        <p className="text-xs text-muted-foreground mb-4">
          Starts: {startTime.toLocaleString()}
        </p>
      )}

      {status === "active" && onStart && (
        <Button onClick={onStart} className="w-full" variant="default">
          <PlayCircle className="w-4 h-4 mr-2" />
          Start Quiz
        </Button>
      )}
    </GlassCard>
  );
}
