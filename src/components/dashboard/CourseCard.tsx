import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Clock, Users, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  title: string;
  instructor: string;
  thumbnail?: string;
  duration: string;
  enrolledCount: number;
  progress?: number;
  level: "beginner" | "intermediate" | "advanced";
  delay?: number;
  onContinue?: () => void;
}

export function CourseCard({
  title,
  instructor,
  thumbnail,
  duration,
  enrolledCount,
  progress,
  level,
  delay = 0,
  onContinue,
}: CourseCardProps) {
  const levelColors = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-warning/10 text-warning",
    advanced: "bg-destructive/10 text-destructive",
  };

  return (
    <GlassCard hover delay={delay} className="overflow-hidden">
      <div className="aspect-video bg-secondary relative">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${levelColors[level]}`}>
          {level}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{instructor}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {enrolledCount.toLocaleString()}
          </span>
        </div>

        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button onClick={onContinue} className="w-full" variant="secondary">
          <PlayCircle className="w-4 h-4 mr-2" />
          {progress ? "Continue" : "Start Course"}
        </Button>
      </div>
    </GlassCard>
  );
}
