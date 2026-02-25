import { GlassCard } from "@/components/ui/GlassCard";
import { Bell } from "lucide-react";

export default function Alerts() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
      <GlassCard className="p-12 text-center">
        <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Alerts Coming Soon</h2>
        <p className="text-muted-foreground">View notifications and alerts here.</p>
      </GlassCard>
    </div>
  );
}
