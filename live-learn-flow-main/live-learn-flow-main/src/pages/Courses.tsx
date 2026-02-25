import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen } from "lucide-react";

export default function Courses() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Courses</h1>
      <GlassCard className="p-12 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Courses Coming Soon</h2>
        <p className="text-muted-foreground">Browse and manage your courses here.</p>
      </GlassCard>
    </div>
  );
}
