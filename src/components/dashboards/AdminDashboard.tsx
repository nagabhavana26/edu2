import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  TrendingUp,
  Plus,
  Settings,
  Activity,
  Server,
  Shield,
  UserPlus,
  FileText,
  Database
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { title: "Total Users", value: "12,458", change: "+256 this month", changeType: "positive" as const, icon: Users, iconColor: "text-primary" },
  { title: "Active Courses", value: "156", change: "12 pending review", changeType: "neutral" as const, icon: BookOpen, iconColor: "text-success" },
  { title: "Job Postings", value: "89", change: "+15 this week", changeType: "positive" as const, icon: Briefcase, iconColor: "text-warning" },
  { title: "System Health", value: "99.9%", change: "All systems operational", changeType: "positive" as const, icon: Activity, iconColor: "text-info" },
];

const userGrowthData = [
  { month: "Jan", users: 8500 },
  { month: "Feb", users: 9200 },
  { month: "Mar", users: 9800 },
  { month: "Apr", users: 10500 },
  { month: "May", users: 11200 },
  { month: "Jun", users: 12458 },
];

const userDistribution = [
  { name: "Students", value: 8500, color: "hsl(174, 72%, 46%)" },
  { name: "Teachers", value: 850, color: "hsl(38, 92%, 50%)" },
  { name: "Parents", value: 2800, color: "hsl(142, 76%, 36%)" },
  { name: "Admins", value: 308, color: "hsl(199, 89%, 48%)" },
];

const recentUsers = [
  { name: "Sarah Chen", email: "sarah@example.com", role: "Student", joined: "2 hours ago" },
  { name: "Mike Wilson", email: "mike@example.com", role: "Teacher", joined: "5 hours ago" },
  { name: "Emily Brown", email: "emily@example.com", role: "Parent", joined: "1 day ago" },
  { name: "James Lee", email: "james@example.com", role: "Student", joined: "1 day ago" },
];

const systemMetrics = [
  { label: "CPU Usage", value: 45, status: "normal" },
  { label: "Memory", value: 62, status: "normal" },
  { label: "Storage", value: 78, status: "warning" },
  { label: "Bandwidth", value: 35, status: "normal" },
];

const quickActions = [
  { icon: UserPlus, label: "Add User", color: "text-primary" },
  { icon: BookOpen, label: "Create Course", color: "text-success" },
  { icon: Briefcase, label: "Post Job", color: "text-warning" },
  { icon: FileText, label: "Generate Report", color: "text-info" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            System overview and management controls.
          </motion.p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Database className="w-4 h-4 mr-2" />
            Backup
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Quick Actions */}
      <GlassCard delay={0.2} className="p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Growth Chart */}
          <GlassCard delay={0.3} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              User Growth
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 10%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                      color: "hsl(210, 40%, 98%)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(174, 72%, 46%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Recent Users */}
          <GlassCard delay={0.4} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Recent Registrations
              </h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === "Student" ? "bg-primary/10 text-primary" :
                      user.role === "Teacher" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{user.joined}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* User Distribution */}
          <GlassCard delay={0.3} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Distribution
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground ml-auto">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* System Metrics */}
          <GlassCard delay={0.4} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              System Metrics
            </h2>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <span className={`text-sm font-medium ${
                      metric.status === "warning" ? "text-warning" : "text-foreground"
                    }`}>
                      {metric.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        metric.status === "warning" 
                          ? "bg-warning" 
                          : "bg-primary"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Security Status */}
          <GlassCard delay={0.5} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              Security Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-xl">
                <span className="text-sm text-foreground">SSL Certificate</span>
                <span className="text-sm text-success font-medium">Valid</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-xl">
                <span className="text-sm text-foreground">Firewall</span>
                <span className="text-sm text-success font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-xl">
                <span className="text-sm text-foreground">Last Backup</span>
                <span className="text-sm text-success font-medium">2 hours ago</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
