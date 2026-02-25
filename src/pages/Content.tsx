import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen } from "lucide-react";

export default function Content() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Content</h1>
      <GlassCard className="p-12 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Content Management Coming Soon</h2>
        <p className="text-muted-foreground">Create and manage your course content here.</p>
      </GlassCard>
    </div>
  );
}
