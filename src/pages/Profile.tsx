import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, Settings, LogOut, Camera, Star, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Profile() {
  // Mock data - in a real app, this would come from an auth context or API
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "student",
    joined: "January 2024",
    avatar: null,
    stats: [
      { label: "Courses Done", value: "12", icon: BookOpen, color: "text-blue-500" },
      { label: "Achievements", value: "24", icon: Award, color: "text-yellow-500" },
      { label: "Points", value: "1,250", icon: Star, color: "text-purple-500" },
    ]
  };

  return (
    <DashboardLayout role="student" userName={user.name} onLogout={() => console.log("Logout")}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="h-48 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>

          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-background border-4 border-background shadow-2xl overflow-hidden flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
              </button>
            </div>

            <div className="pb-4">
              <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Shield size={14} className="text-primary" />
                Premium Student Account
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {/* Left Column: Info & Stats */}
          <div className="space-y-6 md:col-span-1">
            <Card className="glass-card border-none shadow-xl">
              <CardHeader pb-2>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-background ${stat.color}`}>
                        <stat.icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-bold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Account Security</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 bg-background/50 border-none hover:bg-background">
                    <Shield size={16} className="text-primary" />
                    Two-Factor Auth
                    <span className="ml-auto text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full">On</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                    <Mail size={16} />
                    Change Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center/Right Column: Settings & Activities */}
          <div className="space-y-6 md:col-span-2">
            <Card className="glass-card border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your preferences and interface settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors pointer-events-none opacity-80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Dark Mode</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">Theme management coming to all users soon</p>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Email Alerts</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Weekly progress reports</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground p-0 h-auto">
                      Personal Info
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground p-0 h-auto">
                      Notifications
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <LogOut size={14} /> Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-8 rounded-3xl bg-secondary/30 border border-dashed border-border text-center">
              <p className="text-muted-foreground mb-4 italic">No recent activity to show</p>
              <Button variant="outline" size="sm">Explore Learning</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
