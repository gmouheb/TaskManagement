import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const modes = ["focus", "shortBreak", "longBreak"];

function minutesToSeconds(minutes) {
  return Math.max(1, Number(minutes) || 1) * 60;
}

export function getModeLabel(mode) {
  return {
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  }[mode];
}

export function useTimer(settings, onComplete) {
  const [currentMode, setCurrentMode] = useState("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => minutesToSeconds(settings.durations.focus));
  const [focusRounds, setFocusRounds] = useState(0);
  const completionRef = useRef(onComplete);

  const totalTime = useMemo(
    () => minutesToSeconds(settings.durations[currentMode]),
    [currentMode, settings.durations]
  );

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(totalTime);
    }
  }, [totalTime, isRunning]);

  const selectMode = useCallback(
    (mode) => {
      if (!modes.includes(mode)) {
        return;
      }

      setCurrentMode(mode);
      setIsRunning(false);
      setTimeLeft(minutesToSeconds(settings.durations[mode]));
    },
    [settings.durations]
  );

  const completeCurrentSession = useCallback(() => {
    setIsRunning(false);

    const completedMode = currentMode;
    const durationMinutes = settings.durations[completedMode];
    completionRef.current?.(completedMode, durationMinutes);

    let nextMode = "focus";
    let shouldRunNext = false;

    if (completedMode === "focus") {
      const nextRound = focusRounds + 1;
      setFocusRounds(nextRound);
      nextMode = nextRound % 4 === 0 ? "longBreak" : "shortBreak";
      shouldRunNext = settings.autoStartBreaks;
    } else {
      nextMode = "focus";
      shouldRunNext = settings.autoStartFocus;
    }

    setCurrentMode(nextMode);
    setTimeLeft(minutesToSeconds(settings.durations[nextMode]));
    setIsRunning(shouldRunNext);
  }, [currentMode, focusRounds, settings]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          window.setTimeout(completeCurrentSession, 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [completeCurrentSession, isRunning]);

  const toggleRunning = useCallback(() => {
    setIsRunning((current) => !current);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  }, [totalTime]);

  const skip = useCallback(() => {
    completeCurrentSession();
  }, [completeCurrentSession]);

  return {
    currentMode,
    timeLeft,
    totalTime,
    isRunning,
    selectMode,
    toggleRunning,
    reset,
    skip,
  };
}
