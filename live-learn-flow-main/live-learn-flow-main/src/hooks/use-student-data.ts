import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  student_level: string | null;
  skills: string[];
}

export interface EnrolledCourse {
  id: string;
  course_id: string;
  progress_percent: number;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    created_by: string;
  };
}

export interface ActiveQuiz {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  course_id: string;
  is_published: boolean;
  course_title?: string;
  question_count?: number;
  attempt?: {
    id: string;
    is_submitted: boolean;
    score: number | null;
    started_at: string;
  } | null;
}

export interface EligibleJob {
  id: string;
  title: string;
  company: string;
  description: string | null;
  location: string | null;
  job_type: string | null;
  eligible_levels: string[];
  required_skills: string[];
  minimum_score: number | null;
  deadline: string | null;
  is_active: boolean;
  has_applied?: boolean;
}

export function useStudentData() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [quizzes, setQuizzes] = useState<ActiveQuiz[]>([]);
  const [jobs, setJobs] = useState<EligibleJob[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data as any);
    }
    return user;
  }, []);

  const fetchCourses = useCallback(async () => {
    const { data } = await supabase
      .from("course_enrollments")
      .select(`
        id,
        course_id,
        progress_percent,
        enrolled_at,
        courses (id, title, description, thumbnail_url, created_by)
      `);

    if (data) {
      const mapped = data.map((e: any) => ({
        ...e,
        course: e.courses,
      }));
      setCourses(mapped);
    }
  }, []);

  const fetchQuizzes = useCallback(async () => {
    // Fetch quizzes (RLS handles time-window filtering for students)
    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("is_published", true);

    if (quizData) {
      // Get question counts
      const quizIds = quizData.map((q: any) => q.id);
      const { data: questions } = await supabase
        .from("quiz_questions")
        .select("quiz_id")
        .in("quiz_id", quizIds.length > 0 ? quizIds : ["__none__"]);

      // Get existing attempts
      const { data: attemptData } = await supabase
        .from("quiz_attempts")
        .select("*")
        .in("quiz_id", quizIds.length > 0 ? quizIds : ["__none__"]);

      // Get course titles
      const courseIds = [...new Set(quizData.map((q: any) => q.course_id))];
      const { data: courseData } = await supabase
        .from("courses")
        .select("id, title")
        .in("id", courseIds.length > 0 ? courseIds : ["__none__"]);

      const courseMap = Object.fromEntries((courseData || []).map((c: any) => [c.id, c.title]));
      const questionCounts: Record<string, number> = {};
      (questions || []).forEach((q: any) => {
        questionCounts[q.quiz_id] = (questionCounts[q.quiz_id] || 0) + 1;
      });
      const attemptMap: Record<string, any> = {};
      (attemptData || []).forEach((a: any) => {
        attemptMap[a.quiz_id] = a;
      });

      setAttempts(attemptData || []);
      setQuizzes(
        quizData.map((q: any) => ({
          ...q,
          course_title: courseMap[q.course_id] || "Unknown Course",
          question_count: questionCounts[q.id] || 0,
          attempt: attemptMap[q.id] || null,
        }))
      );
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    const { data: jobData } = await supabase
      .from("jobs")
      .select("*");

    if (jobData) {
      // Check applications
      const jobIds = jobData.map((j: any) => j.id);
      const { data: apps } = await supabase
        .from("job_applications")
        .select("job_id")
        .in("job_id", jobIds.length > 0 ? jobIds : ["__none__"]);

      const appliedIds = new Set((apps || []).map((a: any) => a.job_id));

      setJobs(
        jobData.map((j: any) => ({
          ...j,
          has_applied: appliedIds.has(j.id),
        }))
      );
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await fetchProfile();
    await Promise.all([fetchCourses(), fetchQuizzes(), fetchJobs()]);
    setLoading(false);
  }, [fetchProfile, fetchCourses, fetchQuizzes, fetchJobs]);

  useEffect(() => {
    fetchAll();

    // Real-time subscriptions
    const channel = supabase
      .channel("student-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "quizzes" }, () => fetchQuizzes())
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_attempts" }, () => fetchQuizzes())
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => fetchJobs())
      .on("postgres_changes", { event: "*", schema: "public", table: "course_enrollments" }, () => fetchCourses())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll, fetchQuizzes, fetchJobs, fetchCourses]);

  // Computed stats
  const stats = {
    overallScore: attempts.length > 0
      ? Math.round(attempts.filter((a: any) => a.is_submitted && a.score != null).reduce((acc: number, a: any) => acc + Number(a.score), 0) / Math.max(attempts.filter((a: any) => a.is_submitted && a.score != null).length, 1))
      : 0,
    coursesEnrolled: courses.length,
    quizzesCompleted: attempts.filter((a: any) => a.is_submitted).length,
    activeQuizzes: quizzes.filter(q => !q.attempt?.is_submitted).length,
  };

  return {
    profile,
    courses,
    quizzes,
    jobs,
    stats,
    loading,
    refetch: fetchAll,
    applyToJob: async (jobId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("job_applications").insert({ job_id: jobId, student_id: user.id });
      fetchJobs();
    },
  };
}
