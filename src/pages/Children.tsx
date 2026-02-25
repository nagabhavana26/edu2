import { GlassCard } from "@/components/ui/GlassCard";
import { Users } from "lucide-react";

export default function Children() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">My Children</h1>
      <GlassCard className="p-12 text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Children Overview Coming Soon</h2>
        <p className="text-muted-foreground">Monitor your children's progress here.</p>
      </GlassCard>
    </div>
  );
}
