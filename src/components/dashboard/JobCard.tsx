import { GlassCard } from "@/components/ui/GlassCard";
import { Building2, MapPin, Clock, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: "internship" | "full-time" | "part-time";
  skills: string[];
  deadline: Date;
  isEligible: boolean;
  delay?: number;
  onApply?: () => void;
}

export function JobCard({
  title,
  company,
  location,
  type,
  skills,
  deadline,
  isEligible,
  delay = 0,
  onApply,
}: JobCardProps) {
  const typeColors = {
    internship: "bg-info/10 text-info",
    "full-time": "bg-success/10 text-success",
    "part-time": "bg-warning/10 text-warning",
  };

  const daysLeft = Math.ceil(
    (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <GlassCard hover delay={delay} className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{company}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${typeColors[type]}`}>
          {type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {daysLeft} days left
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-secondary rounded text-xs text-muted-foreground"
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="px-2 py-1 bg-secondary rounded text-xs text-muted-foreground">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      {isEligible ? (
        <Button onClick={onApply} className="w-full" variant="default">
          <ExternalLink className="w-4 h-4 mr-2" />
          Apply Now
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-2.5 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <CheckCircle className="w-4 h-4" />
          Not Eligible Yet
        </div>
      )}
    </GlassCard>
  );
}
