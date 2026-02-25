import { useState, useEffect, useCallback, useRef } from "react";

interface UseQuizTimerProps {
  startedAt: string; // ISO timestamp
  durationMinutes: number;
  onTimeUp: () => void;
  isSubmitted: boolean;
}

export function useQuizTimer({ startedAt, durationMinutes, onTimeUp, isSubmitted }: UseQuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const calculateTimeLeft = useCallback(() => {
    const start = new Date(startedAt).getTime();
    const endTime = start + durationMinutes * 60 * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((endTime - now) / 1000));
  }, [startedAt, durationMinutes]);

  useEffect(() => {
    if (isSubmitted) return;

    const remaining = calculateTimeLeft();
    setTimeLeft(remaining);

    if (remaining <= 0) {
      onTimeUpRef.current();
      return;
    }

    const interval = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
        onTimeUpRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft, isSubmitted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const isUrgent = timeLeft < 60;
  const progress = durationMinutes > 0 ? ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100 : 100;

  return { timeLeft, formatted, isUrgent, progress, minutes, seconds };
}
