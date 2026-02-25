import { GlassCard } from "@/components/ui/GlassCard";
import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reports</h1>
      <GlassCard className="p-12 text-center">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Reports Coming Soon</h2>
        <p className="text-muted-foreground">Access detailed reports here.</p>
      </GlassCard>
    </div>
  );
}
