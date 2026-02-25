import { GlassCard } from "@/components/ui/GlassCard";
import { UserCircle } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      <GlassCard className="p-12 text-center">
        <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Profile Coming Soon</h2>
        <p className="text-muted-foreground">Manage your profile and settings here.</p>
      </GlassCard>
    </div>
  );
}
