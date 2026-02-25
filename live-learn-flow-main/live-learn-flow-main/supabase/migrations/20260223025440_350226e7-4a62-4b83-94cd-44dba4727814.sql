
-- Fix: Replace overly permissive alerts INSERT policy
DROP POLICY "System can create alerts" ON public.alerts;

CREATE POLICY "Users can create own alerts" ON public.alerts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
