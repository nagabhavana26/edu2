
-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.course_enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
