import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const stats = [
  { title: "Total Students", value: "156", change: "+12 this semester", changeType: "positive" as const, icon: Users, iconColor: "text-primary" },
  { title: "Active Quizzes", value: "5", change: "2 ending today", changeType: "neutral" as const, icon: ClipboardCheck, iconColor: "text-warning" },
  { title: "Courses Managed", value: "4", change: "All active", changeType: "positive" as const, icon: BookOpen, iconColor: "text-success" },
  { title: "Avg. Class Score", value: "78%", change: "+3% improvement", changeType: "positive" as const, icon: TrendingUp, iconColor: "text-info" },
];

const pendingReviews = [
  { student: "Alice Johnson", quiz: "Data Structures Essay", submitted: "2 hours ago", type: "descriptive" },
  { student: "Bob Smith", quiz: "Algorithm Analysis", submitted: "5 hours ago", type: "descriptive" },
  { student: "Carol Davis", quiz: "Database Design", submitted: "1 day ago", type: "descriptive" },
];

const upcomingClasses = [
  { subject: "Advanced Algorithms", time: "10:00 AM", students: 32, room: "CS-101" },
  { subject: "Data Structures", time: "2:00 PM", students: 28, room: "CS-102" },
  { subject: "Database Systems", time: "4:00 PM", students: 35, room: "CS-201" },
];

const recentActivity = [
  { type: "quiz_submit", message: "15 students completed Data Structures Quiz", time: "10 mins ago" },
  { type: "attendance", message: "Algorithm class attendance: 28/32", time: "1 hour ago" },
  { type: "grade", message: "Auto-graded 45 MCQ submissions", time: "2 hours ago" },
];

const attendanceData = [
  { subject: "Algorithms", present: 88, absent: 7, tardy: 5 },
  { subject: "Data Struct", present: 92, absent: 3, tardy: 5 },
  { subject: "Database", present: 85, absent: 10, tardy: 5 },
  { subject: "Networks", present: 78, absent: 15, tardy: 7 },
];

export function TeacherDashboard() {
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
            Teacher Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Manage your classes, quizzes, and track student progress.
          </motion.p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Reviews */}
          <GlassCard delay={0.2} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                Pending Reviews
              </h2>
              <span className="px-2.5 py-1 bg-warning/10 text-warning text-sm font-medium rounded-full">
                {pendingReviews.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {pendingReviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {review.student.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{review.student}</p>
                      <p className="text-sm text-muted-foreground">{review.quiz}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{review.submitted}</p>
                    <Button size="sm" variant="ghost" className="mt-1">
                      Review
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Attendance Chart */}
          <AttendanceChart data={attendanceData} title="Class Attendance Overview" delay={0.3} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <GlassCard delay={0.2} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Classes
            </h2>
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 bg-secondary/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{cls.subject}</span>
                    <span className="text-sm text-primary font-mono">{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {cls.students} students
                    </span>
                    <span>Room {cls.room}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard delay={0.3} className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {activity.type === "quiz_submit" && <ClipboardCheck className="w-4 h-4 text-primary" />}
                    {activity.type === "attendance" && <Users className="w-4 h-4 text-success" />}
                    {activity.type === "grade" && <CheckCircle className="w-4 h-4 text-warning" />}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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
