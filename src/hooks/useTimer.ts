import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isCompleted: boolean;
  initialDuration: number;
}

const STORAGE_KEY = 'serenefocus_timer_state';

export function useTimer(initialMinutes: number = 25) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [initialDuration, setInitialDuration] = useState(initialMinutes);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(initialMinutes * 60);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed: TimerState = JSON.parse(savedState);
        setTimeLeft(parsed.timeLeft);
        setIsRunning(false);
        setIsCompleted(parsed.isCompleted);
        setInitialDuration(parsed.initialDuration);
        pausedTimeRef.current = parsed.timeLeft;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const state: TimerState = {
      timeLeft,
      isRunning,
      isCompleted,
      initialDuration,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [timeLeft, isRunning, isCompleted, initialDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = timeLeft;

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const newTimeLeft = Math.max(0, pausedTimeRef.current - elapsed);

        setTimeLeft(newTimeLeft);

        if (newTimeLeft === 0) {
          setIsRunning(false);
          setIsCompleted(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
    pausedTimeRef.current = timeLeft;
  }, [timeLeft]);

  const reset = useCallback((newDuration?: number) => {
    const duration = newDuration ?? initialDuration;
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
    setInitialDuration(duration);
    pausedTimeRef.current = duration * 60;
    startTimeRef.current = null;
  }, [initialDuration]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = ((initialDuration * 60 - timeLeft) / (initialDuration * 60)) * 100;

  return {
    timeLeft,
    isRunning,
    isCompleted,
    initialDuration,
    start,
    pause,
    reset,
    formatTime,
    progress,
  };
}
