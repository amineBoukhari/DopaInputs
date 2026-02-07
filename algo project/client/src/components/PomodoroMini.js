import React from 'react';
import { usePomodoro } from '../contexts/PomodoroContext';

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const PomodoroMini = ({ onOpen }) => {
  const { isRunning, startPause, mode, secondsLeft } = usePomodoro();

  return (
    <div className="hidden sm:flex items-center gap-3">
      <button onClick={onOpen} className="px-2 py-1 rounded-md hover:bg-surface text-sm">
        {formatTime(secondsLeft)}
      </button>
      <div className="text-xs text-text-muted">{mode === 'work' ? 'Work' : mode === 'break' ? 'Short' : 'Long'}</div>
      <button
        onClick={startPause}
        className={`px-2 py-1 rounded-md inline-flex items-center justify-center ${isRunning ? 'bg-purple-500 text-white' : 'bg-primary text-white'}`}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="5" y="4" width="4" height="16" rx="1" fill="currentColor" />
            <rect x="15" y="4" width="4" height="16" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PomodoroMini;
