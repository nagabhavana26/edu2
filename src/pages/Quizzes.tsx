import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { QuizCard } from "@/components/dashboard/QuizCard";
import { ClipboardCheck } from "lucide-react";

export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("is_published", true);

      if (quizData) {
        const quizIds = quizData.map((q: any) => q.id);
        const { data: questions } = await supabase
          .from("quiz_questions")
          .select("quiz_id")
          .in("quiz_id", quizIds.length > 0 ? quizIds : ["__none__"]);

        const { data: attemptData } = await supabase
          .from("quiz_attempts")
          .select("*")
          .in("quiz_id", quizIds.length > 0 ? quizIds : ["__none__"]);

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

        setQuizzes(
          quizData.map((q: any) => ({
            ...q,
            course_title: courseMap[q.course_id] || "Unknown Course",
            question_count: questionCounts[q.id] || 0,
            attempt: attemptMap[q.id] || null,
          }))
        );
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const getQuizStatus = (quiz: any): "active" | "upcoming" | "completed" | "locked" => {
    if (quiz.attempt?.is_submitted) return "completed";
    const now = Date.now();
    const start = new Date(quiz.start_time).getTime();
    const end = new Date(quiz.end_time).getTime();
    if (now < start) return "upcoming";
    if (now > end) return "locked";
    return "active";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <ClipboardCheck className="w-8 h-8 text-primary" />
        My Quizzes
      </h1>
      {quizzes.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <ClipboardCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Quizzes Available</h2>
          <p className="text-muted-foreground">Quizzes will appear here when your teachers publish them.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
