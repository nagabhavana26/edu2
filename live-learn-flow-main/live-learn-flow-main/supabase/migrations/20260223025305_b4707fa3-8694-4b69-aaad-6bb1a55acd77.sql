
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'parent', 'admin');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  student_level TEXT, -- 'k12', 'undergrad', 'postgrad'
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 4. Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Course enrollments
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- 6. Quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq', -- 'mcq' or 'descriptive'
  options JSONB, -- for MCQ: [{text, is_correct}]
  correct_answer TEXT, -- for MCQ auto-grading
  points INTEGER NOT NULL DEFAULT 1,
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  score NUMERIC,
  max_score NUMERIC,
  answers JSONB DEFAULT '[]', -- [{question_id, answer, is_correct, points_awarded}]
  is_submitted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quiz_id, student_id)
);

-- 9. Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  location TEXT,
  job_type TEXT DEFAULT 'full-time',
  eligible_levels TEXT[] DEFAULT '{}', -- ['undergrad', 'postgrad']
  required_skills TEXT[] DEFAULT '{}',
  minimum_score NUMERIC DEFAULT 0,
  deadline TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, student_id)
);

-- 11. Parent-student links
CREATE TABLE public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- 12. Alerts/notifications
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ ENABLE RLS ============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- ============ HELPER FUNCTIONS ============

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_quiz_active(_quiz_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE id = _quiz_id AND now() BETWEEN start_time AND end_time AND is_published = true
  )
$$;

-- ============ TRIGGER: auto-create profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NEW.email);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'));

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ TRIGGER: updated_at ============
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============ RLS POLICIES ============

-- PROFILES
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Parents can read linked student profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'parent') AND EXISTS (
    SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = profiles.user_id
  ));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- USER ROLES
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COURSES
CREATE POLICY "Students can read enrolled courses" ON public.courses FOR SELECT TO authenticated
  USING (is_published = true AND EXISTS (
    SELECT 1 FROM public.course_enrollments WHERE student_id = auth.uid() AND course_id = courses.id
  ));
CREATE POLICY "Teachers can manage own courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid());
CREATE POLICY "Admins can manage all courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students can browse published courses" ON public.courses FOR SELECT TO authenticated
  USING (is_published = true AND public.has_role(auth.uid(), 'student'));

-- COURSE ENROLLMENTS
CREATE POLICY "Students manage own enrollments" ON public.course_enrollments FOR ALL TO authenticated
  USING (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'))
  WITH CHECK (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Teachers can read own course enrollments" ON public.course_enrollments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') AND EXISTS (
    SELECT 1 FROM public.courses WHERE id = course_id AND created_by = auth.uid()
  ));
CREATE POLICY "Parents can read linked enrollments" ON public.course_enrollments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'parent') AND EXISTS (
    SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = course_enrollments.student_id
  ));
CREATE POLICY "Admins can manage all enrollments" ON public.course_enrollments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZZES
CREATE POLICY "Students can read active quizzes" ON public.quizzes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'student') AND is_published = true AND now() BETWEEN start_time AND end_time
    AND EXISTS (SELECT 1 FROM public.course_enrollments WHERE student_id = auth.uid() AND course_id = quizzes.course_id));
CREATE POLICY "Teachers can manage own quizzes" ON public.quizzes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid());
CREATE POLICY "Admins can manage all quizzes" ON public.quizzes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ QUESTIONS
CREATE POLICY "Students can read active quiz questions" ON public.quiz_questions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'student') AND public.is_quiz_active(quiz_id));
CREATE POLICY "Teachers can manage quiz questions" ON public.quiz_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins can manage all quiz questions" ON public.quiz_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUIZ ATTEMPTS
CREATE POLICY "Students manage own attempts" ON public.quiz_attempts FOR ALL TO authenticated
  USING (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'))
  WITH CHECK (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Teachers can read attempts for own quizzes" ON public.quiz_attempts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') AND EXISTS (
    SELECT 1 FROM public.quizzes WHERE id = quiz_id AND created_by = auth.uid()
  ));
CREATE POLICY "Parents can read linked attempts" ON public.quiz_attempts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'parent') AND EXISTS (
    SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = quiz_attempts.student_id
  ));
CREATE POLICY "Admins can manage all attempts" ON public.quiz_attempts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- JOBS
CREATE POLICY "Students can read eligible active jobs" ON public.jobs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'student') AND is_active = true
    AND (deadline IS NULL OR deadline > now())
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND student_level = ANY(eligible_levels)
    ));
CREATE POLICY "Teachers can read all jobs" ON public.jobs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can create jobs" ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid());
CREATE POLICY "Admins can manage all jobs" ON public.jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- JOB APPLICATIONS
CREATE POLICY "Students manage own applications" ON public.job_applications FOR ALL TO authenticated
  USING (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'))
  WITH CHECK (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Teachers can read applications" ON public.job_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins can manage all applications" ON public.job_applications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PARENT STUDENT LINKS
CREATE POLICY "Parents manage own links" ON public.parent_student_links FOR ALL TO authenticated
  USING (parent_id = auth.uid() AND public.has_role(auth.uid(), 'parent'))
  WITH CHECK (parent_id = auth.uid() AND public.has_role(auth.uid(), 'parent'));
CREATE POLICY "Students can read own links" ON public.parent_student_links FOR SELECT TO authenticated
  USING (student_id = auth.uid());
CREATE POLICY "Admins can manage all links" ON public.parent_student_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ALERTS
CREATE POLICY "Users can read own alerts" ON public.alerts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "System can create alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage all alerts" ON public.alerts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
