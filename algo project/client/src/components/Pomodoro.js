import React from 'react';
import { usePomodoro } from '../contexts/PomodoroContext';

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Pomodoro = () => {
  const {
    workMinutes, setWorkMinutes,
    breakMinutes, setBreakMinutes,
    longBreakMinutes, setLongBreakMinutes,
    isRunning, startPause, reset, skip,
    mode, secondsLeft, completedSessions
  } = usePomodoro();

  return (
    <div className="card p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-text mb-4">Pomodoro Timer</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl font-mono">{formatTime(Math.max(0, secondsLeft))}</div>
        <div className="text-sm text-text-muted">Mode: <span className="font-medium">{mode === 'work' ? 'Work' : mode === 'break' ? 'Short Break' : 'Long Break'}</span></div>

        <div className="flex gap-2">
          <button onClick={startPause} className={`px-4 py-2 rounded-lg ${isRunning ? 'bg-purple-500 text-white' : 'bg-primary text-white'}`}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={reset} className="px-4 py-2 rounded-lg bg-surface">Reset</button>
          <button onClick={skip} className="px-4 py-2 rounded-lg bg-surface">Skip</button>
        </div>

        <div className="w-full mt-4">
          <h4 className="text-sm font-semibold mb-2">Settings</h4>
          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-xs text-text-muted">Work (min)</label>
            <input type="number" min="1" value={workMinutes} onChange={e => setWorkMinutes(Number(e.target.value) || 1)} className="col-span-2 p-2 rounded-lg border border-border" />

            <label className="text-xs text-text-muted">Break (min)</label>
            <input type="number" min="1" value={breakMinutes} onChange={e => setBreakMinutes(Number(e.target.value) || 1)} className="col-span-2 p-2 rounded-lg border border-border" />

            <label className="text-xs text-text-muted">Long Break (min)</label>
            <input type="number" min="1" value={longBreakMinutes} onChange={e => setLongBreakMinutes(Number(e.target.value) || 1)} className="col-span-2 p-2 rounded-lg border border-border" />
          </div>
        </div>

        <div className="w-full mt-4 text-sm text-text-muted">
          Completed sessions: <span className="font-medium">{completedSessions}</span>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
