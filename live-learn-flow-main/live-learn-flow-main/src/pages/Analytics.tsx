import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
      <GlassCard className="p-12 text-center">
        <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Analytics Coming Soon</h2>
        <p className="text-muted-foreground">Track your performance and progress here.</p>
      </GlassCard>
    </div>
  );
}
