import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuizCard } from "@/components/dashboard/QuizCard";
import { JobCard } from "@/components/dashboard/JobCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { GraduationCap, Target, Trophy, Clock, TrendingUp, BookOpen } from "lucide-react";
import { useStudentData } from "@/hooks/use-student-data";

export function StudentDashboard() {
  const navigate = useNavigate();
  const { profile, courses, quizzes, jobs, stats, loading, applyToJob } = useStudentData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const getQuizStatus = (quiz: any): "active" | "upcoming" | "completed" | "locked" => {
    if (quiz.attempt?.is_submitted) return "completed";
    const now = Date.now();
    const start = new Date(quiz.start_time).getTime();
    const end = new Date(quiz.end_time).getTime();
    if (now < start) return "upcoming";
    if (now > end) return "locked";
    return "active";
  };

  const statCards = [
    { title: "Overall Score", value: stats.overallScore > 0 ? `${stats.overallScore}%` : "—", change: "Based on graded quizzes", changeType: "neutral" as const, icon: Trophy, iconColor: "text-warning" },
    { title: "Courses Enrolled", value: String(stats.coursesEnrolled), change: `${courses.filter(c => c.progress_percent < 100).length} in progress`, changeType: "neutral" as const, icon: BookOpen, iconColor: "text-primary" },
    { title: "Quizzes Completed", value: String(stats.quizzesCompleted), change: `${stats.activeQuizzes} active`, changeType: "positive" as const, icon: Target, iconColor: "text-success" },
    { title: "Active Quizzes", value: String(stats.activeQuizzes), change: "Take them now", changeType: "neutral" as const, icon: Clock, iconColor: "text-info" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-foreground">
          Welcome back, {profile?.name || "Student"}! 👋
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-1">
          Here's what's happening with your learning journey today.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quizzes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Active Quizzes
              </h2>
            </div>
            {quizzes.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active quizzes right now.</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz, index) => {
                  const status = getQuizStatus(quiz);
                  return (
                    <QuizCard
                      key={quiz.id}
                      title={quiz.title}
                      subject={quiz.course_title || "Course"}
                      duration={quiz.duration_minutes}
                      totalQuestions={quiz.question_count || 0}
                      status={status}
                      startTime={status === "upcoming" ? new Date(quiz.start_time) : undefined}
                      score={quiz.attempt?.is_submitted ? Math.round((Number(quiz.attempt.score) / Math.max(1, quiz.question_count || 1)) * 100) : undefined}
                      delay={index * 0.1}
                      onStart={status === "active" ? () => navigate(`/quiz/${quiz.id}`) : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                My Courses
              </h2>
            </div>
            {courses.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No courses enrolled yet. Browse courses to get started!</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((enrollment, index) => (
                  <CourseCard
                    key={enrollment.id}
                    title={enrollment.course.title}
                    instructor="Instructor"
                    thumbnail={enrollment.course.thumbnail_url || undefined}
                    duration="Self-paced"
                    enrolledCount={0}
                    progress={enrollment.progress_percent}
                    level="intermediate"
                    delay={index * 0.1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Jobs */}
        <div className="space-y-6">
          <GlassCard delay={0.2} className="p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Quick Stats
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{stats.activeQuizzes} quiz{stats.activeQuizzes !== 1 ? "zes" : ""} waiting</p>
                  <p className="text-xs text-muted-foreground">Take them before they expire</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{jobs.length} job{jobs.length !== 1 ? "s" : ""} available</p>
                  <p className="text-xs text-muted-foreground">Matching your eligibility</p>
                </div>
              </li>
            </ul>
          </GlassCard>

          {/* Job Opportunities */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Opportunities
            </h2>
            {jobs.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No eligible jobs right now. Keep learning!</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location || "Remote"}
                    type={(job.job_type as "internship" | "full-time" | "part-time") || "full-time"}
                    skills={job.required_skills || []}
                    deadline={job.deadline ? new Date(job.deadline) : new Date(Date.now() + 30 * 86400000)}
                    isEligible={!job.has_applied}
                    delay={0.3 + index * 0.1}
                    onApply={!job.has_applied ? () => applyToJob(job.id) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
