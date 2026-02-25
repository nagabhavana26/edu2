import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuizTimer } from "@/hooks/use-quiz-timer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: { text: string; is_correct: boolean }[] | null;
  points: number;
  order_num: number;
}

interface Attempt {
  id: string;
  started_at: string;
  is_submitted: boolean;
  answers: { question_id: string; answer: string; is_correct?: boolean; points_awarded?: number }[];
}

export default function QuizTake() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load quiz, questions, and attempt
  useEffect(() => {
    if (!quizId) return;

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      // Fetch quiz
      const { data: quizData } = await supabase.from("quizzes").select("*").eq("id", quizId).single();
      if (!quizData) { navigate("/dashboard"); return; }
      setQuiz(quizData);

      // Fetch questions
      const { data: qData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_num");
      setQuestions((qData || []) as unknown as Question[]);

      // Get or create attempt
      let { data: existingAttempt } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("student_id", user.id)
        .single();

      if (!existingAttempt) {
        const { data: newAttempt } = await supabase
          .from("quiz_attempts")
          .insert({ quiz_id: quizId, student_id: user.id, answers: [] })
          .select()
          .single();
        existingAttempt = newAttempt;
      }

      if (existingAttempt) {
        setAttempt(existingAttempt as any);
        // Restore saved answers
        const savedAnswers: Record<string, string> = {};
        ((existingAttempt as any).answers || []).forEach((a: any) => {
          savedAnswers[a.question_id] = a.answer;
        });
        setAnswers(savedAnswers);
      }

      setLoading(false);
    };

    load();
  }, [quizId, navigate]);

  // Auto-submit on time up
  const handleAutoSubmit = useCallback(async () => {
    if (!attempt || attempt.is_submitted) return;
    await submitQuiz(true);
  }, [attempt]);

  const timer = useQuizTimer({
    startedAt: attempt?.started_at || new Date().toISOString(),
    durationMinutes: quiz?.duration_minutes || 30,
    onTimeUp: handleAutoSubmit,
    isSubmitted: attempt?.is_submitted || false,
  });

  const saveAnswer = async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    if (!attempt) return;

    const updatedAnswers = Object.entries({ ...answers, [questionId]: answer }).map(([qId, ans]) => ({
      question_id: qId,
      answer: ans,
    }));

    await supabase
      .from("quiz_attempts")
      .update({ answers: updatedAnswers as any })
      .eq("id", attempt.id);
  };

  const submitQuiz = async (isAutoSubmit = false) => {
    if (!attempt || !quiz) return;
    setSubmitting(true);

    // Auto-grade MCQs
    let totalScore = 0;
    let maxScore = 0;
    const gradedAnswers = questions.map(q => {
      maxScore += q.points;
      const studentAnswer = answers[q.id] || "";
      let isCorrect = false;
      let pointsAwarded = 0;

      if (q.question_type === "mcq" && q.options) {
        const correctOption = q.options.find(o => o.is_correct);
        isCorrect = correctOption?.text === studentAnswer;
        pointsAwarded = isCorrect ? q.points : 0;
        totalScore += pointsAwarded;
      }

      return {
        question_id: q.id,
        answer: studentAnswer,
        is_correct: isCorrect,
        points_awarded: pointsAwarded,
      };
    });

    await supabase
      .from("quiz_attempts")
      .update({
        answers: gradedAnswers as any,
        score: totalScore,
        max_score: maxScore,
        is_submitted: true,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", attempt.id);

    setAttempt(prev => prev ? { ...prev, is_submitted: true } : prev);

    toast({
      title: isAutoSubmit ? "Time's Up!" : "Quiz Submitted!",
      description: `You scored ${totalScore}/${maxScore} on auto-graded questions.`,
    });

    setTimeout(() => navigate("/dashboard"), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (attempt?.is_submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <GlassCard className="p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-6">Your answers have been submitted successfully.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </GlassCard>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Timer Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-foreground">{quiz?.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {answeredCount}/{questions.length} answered
            </span>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold",
              timer.isUrgent ? "bg-destructive/20 text-destructive animate-pulse" : "bg-primary/10 text-primary"
            )}>
              {timer.isUrgent && <AlertTriangle className="w-5 h-5" />}
              <Clock className="w-5 h-5" />
              {timer.formatted}
            </div>
          </div>
        </div>
        <Progress value={timer.progress} className="h-1" />
      </div>

      {/* Question Area */}
      <div className="pt-24 pb-32 px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                  i === currentIndex && "bg-primary text-primary-foreground",
                  i !== currentIndex && answers[q.id] && "bg-success/20 text-success",
                  i !== currentIndex && !answers[q.id] && "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {currentQuestion.question_text}
                  </h2>

                  {currentQuestion.question_type === "mcq" && currentQuestion.options ? (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => saveAnswer(currentQuestion.id, option.text)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all",
                            answers[currentQuestion.id] === option.text
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium text-foreground">{option.text}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className="w-full h-40 p-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => saveAnswer(currentQuestion.id, e.target.value)}
                    />
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border p-4">
        <div className="container mx-auto max-w-3xl flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={() => submitQuiz(false)}
              disabled={submitting}
              className="bg-success hover:bg-success/90"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
