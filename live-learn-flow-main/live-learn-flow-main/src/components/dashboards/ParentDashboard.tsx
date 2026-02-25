import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Bell,
  BookOpen,
  Target,
  Clock,
  Award
} from "lucide-react";

const children = [
  { 
    name: "Alex Johnson", 
    grade: "10th Grade",
    school: "Lincoln High School",
    avatar: "A",
    overallScore: 85,
    attendance: 92,
    rank: 15
  },
];

const stats = [
  { title: "Overall Score", value: "85%", change: "+7% this month", changeType: "positive" as const, icon: TrendingUp, iconColor: "text-success" },
  { title: "Attendance Rate", value: "92%", change: "Above average", changeType: "positive" as const, icon: Calendar, iconColor: "text-primary" },
  { title: "Quizzes Passed", value: "18/20", change: "90% pass rate", changeType: "positive" as const, icon: Target, iconColor: "text-warning" },
  { title: "Class Rank", value: "#15", change: "Out of 150 students", changeType: "neutral" as const, icon: Award, iconColor: "text-info" },
];

const alerts = [
  { type: "warning" as const, title: "Attendance Alert", message: "Alex missed Physics class yesterday. Please confirm if this was expected.", timestamp: new Date(Date.now() - 3600000) },
  { type: "info" as const, title: "Quiz Scheduled", message: "Mathematics mid-term scheduled for next Monday at 10:00 AM.", timestamp: new Date(Date.now() - 7200000) },
  { type: "success" as const, title: "Great Performance!", message: "Alex scored 95% in the Chemistry quiz - top 5 in class!", timestamp: new Date(Date.now() - 86400000) },
];

const performanceData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 82 },
  { month: "May", score: 80 },
  { month: "Jun", score: 85 },
];

const recentGrades = [
  { subject: "Mathematics", score: 88, date: "Dec 18", type: "Quiz" },
  { subject: "Physics", score: 92, date: "Dec 15", type: "Assignment" },
  { subject: "Chemistry", score: 95, date: "Dec 12", type: "Quiz" },
  { subject: "English", score: 78, date: "Dec 10", type: "Essay" },
];

const upcomingEvents = [
  { title: "Math Mid-term", date: "Dec 25", time: "10:00 AM" },
  { title: "Science Fair", date: "Dec 28", time: "2:00 PM" },
  { title: "Parent-Teacher Meet", date: "Jan 5", time: "4:00 PM" },
];

export function ParentDashboard() {
  const child = children[0];

  return (
    <div className="space-y-6">
      {/* Header with Child Info */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Parent Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Monitor your child's academic progress and stay informed.
          </motion.p>
        </div>
      </div>

      {/* Child Card */}
      <GlassCard delay={0.1} className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{child.avatar}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{child.name}</h2>
            <p className="text-muted-foreground">{child.grade} • {child.school}</p>
          </div>
          <div className="ml-auto flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{child.overallScore}%</p>
              <p className="text-xs text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{child.attendance}%</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">#{child.rank}</p>
              <p className="text-xs text-muted-foreground">Class Rank</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={0.1 + index * 0.1} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerts */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent Alerts
            </h2>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <AlertCard key={index} {...alert} delay={0.2 + index * 0.1} />
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <PerformanceChart data={performanceData} title="Monthly Performance Trend" delay={0.4} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Grades */}
          <GlassCard delay={0.3} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recent Grades
            </h2>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{grade.subject}</p>
                    <p className="text-xs text-muted-foreground">{grade.type} • {grade.date}</p>
                  </div>
                  <span className={`text-lg font-bold ${
                    grade.score >= 90 ? "text-success" : 
                    grade.score >= 75 ? "text-primary" : 
                    "text-warning"
                  }`}>
                    {grade.score}%
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming Events */}
          <GlassCard delay={0.4} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Events
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">{event.date.split(" ")[0]}</span>
                    <span className="text-sm font-bold text-primary">{event.date.split(" ")[1]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
