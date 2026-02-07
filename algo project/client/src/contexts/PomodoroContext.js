import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'pomodoroState_v1';

const defaultState = {
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  isRunning: false,
  mode: 'work',
  secondsLeft: 25 * 60,
  completedSessions: 0,
  // history of completed work sessions: { ts: number, duration: seconds }
  sessionHistory: []
};

const PomodoroContext = createContext(null);

const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 1000;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    o.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // ignore
  }
};

const showNotification = (title, body) => {
  try {
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') new Notification(title, { body });
      });
    }
  } catch (e) {
    // ignore
  }
};

export const PomodoroProvider = ({ children }) => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  const parsed = saved ? JSON.parse(saved) : {};

  const [workMinutes, setWorkMinutes] = useState(parsed.workMinutes ?? defaultState.workMinutes);
  const [breakMinutes, setBreakMinutes] = useState(parsed.breakMinutes ?? defaultState.breakMinutes);
  const [longBreakMinutes, setLongBreakMinutes] = useState(parsed.longBreakMinutes ?? defaultState.longBreakMinutes);
  const [isRunning, setIsRunning] = useState(parsed.isRunning ?? defaultState.isRunning);
  const [mode, setMode] = useState(parsed.mode ?? defaultState.mode);
  const [secondsLeft, setSecondsLeft] = useState(parsed.secondsLeft ?? (parsed.workMinutes ? parsed.workMinutes * 60 : defaultState.secondsLeft));
  const [completedSessions, setCompletedSessions] = useState(parsed.completedSessions ?? defaultState.completedSessions);
  const [sessionHistory, setSessionHistory] = useState(parsed.sessionHistory ?? defaultState.sessionHistory);

  const intervalRef = useRef(null);

  // persist state
  useEffect(() => {
    const toSave = { workMinutes, breakMinutes, longBreakMinutes, isRunning, mode, secondsLeft, completedSessions, sessionHistory };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // ignore
    }
  }, [workMinutes, breakMinutes, longBreakMinutes, isRunning, mode, secondsLeft, completedSessions, sessionHistory]);

  // timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // handle end of countdown
  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      playBeep();
      const title = mode === 'work' ? 'Work session finished' : 'Break finished';
      const body = mode === 'work' ? 'Time for a break!' : 'Back to work!';
      showNotification(title, body);

      if (mode === 'work') {
        const nextCount = completedSessions + 1;
        setCompletedSessions(nextCount);

        // record a completed work session (duration based on current workMinutes)
        try {
          const duration = Math.max(1, (workMinutes || defaultState.workMinutes) * 60);
          const record = { ts: Date.now(), duration };
          setSessionHistory(h => [record, ...h].slice(0, 1000));
        } catch (e) {}

        if (nextCount % 4 === 0) {
          setMode('longBreak');
          setSecondsLeft(longBreakMinutes * 60);
        } else {
          setMode('break');
          setSecondsLeft(breakMinutes * 60);
        }
      } else {
        setMode('work');
        setSecondsLeft(workMinutes * 60);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const startPause = () => setIsRunning(r => !r);

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setMode('work');
    setCompletedSessions(0);
    setSecondsLeft(workMinutes * 60);
  };

  const skip = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (mode === 'work') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      if (nextCount % 4 === 0) {
        setMode('longBreak');
        setSecondsLeft(longBreakMinutes * 60);
      } else {
        setMode('break');
        setSecondsLeft(breakMinutes * 60);
      }
    } else {
      setMode('work');
      setSecondsLeft(workMinutes * 60);
    }
  };

  // update secondsLeft immediately when durations change (if not running)
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'work') setSecondsLeft(workMinutes * 60);
      if (mode === 'break') setSecondsLeft(breakMinutes * 60);
      if (mode === 'longBreak') setSecondsLeft(longBreakMinutes * 60);
    }
  }, [workMinutes, breakMinutes, longBreakMinutes, mode, isRunning]);

  return (
    <PomodoroContext.Provider value={{
      workMinutes, setWorkMinutes,
      breakMinutes, setBreakMinutes,
      longBreakMinutes, setLongBreakMinutes,
      isRunning, startPause, reset, skip,
      mode, secondsLeft, completedSessions
      ,
      sessionHistory,
      // convenience derived value: total focused seconds
      totalFocusedSeconds: sessionHistory.reduce((s, r) => s + (r.duration || 0), 0)
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
};

export default PomodoroContext;
