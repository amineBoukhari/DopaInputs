import React from 'react';
import dayjs from 'dayjs';

const DayView = ({ selectedDate, tasks, habits, onClose, onToggleTask, onCompleteHabit }) => {
  if (!selectedDate) return null;
  
  const date = dayjs(selectedDate);
  const dayOfWeek = date.day();
  
  const dateTasks = tasks.filter(task => task.dueDate === selectedDate);
  
  const dateHabits = habits.filter(habit => {
    if (Array.isArray(habit.days) && habit.days.length > 0) {
      return habit.days.includes(dayOfWeek);
    }
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekdays') {
      return dayOfWeek >= 1 && dayOfWeek <= 5; 
    }
    return false;
  });
  
  const isCompletedToday = (habit) => {
    return habit.lastCompletedDate === selectedDate;
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
              {date.format('dddd')}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {date.format('MMMM D, YYYY')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: 8 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="modal-body space-y-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span className="dot" style={{ background: 'var(--primary)' }}></span>
              Tasks
            </h4>
            {dateTasks.length === 0 ? (
              <p className="text-sm py-3" style={{ color: 'var(--text-muted)' }}>No tasks for this day</p>
            ) : (
              <div className="space-y-2">
                {dateTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'var(--surface-hover)' }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id, !task.completed)}
                      className="checkbox"
                    />
                    <span className="text-sm flex-1" style={{ 
                      color: task.completed ? 'var(--text-muted)' : 'var(--text)',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span className="dot" style={{ background: 'var(--accent)' }}></span>
              Habits
            </h4>
            {dateHabits.length === 0 ? (
              <p className="text-sm py-3" style={{ color: 'var(--text-muted)' }}>No habits for this day</p>
            ) : (
              <div className="space-y-2">
                {dateHabits.map(habit => {
                  const completed = isCompletedToday(habit);
                  const isPast = dayjs(selectedDate).isBefore(dayjs(), 'day');
                  const isFuture = dayjs(selectedDate).isAfter(dayjs(), 'day');
                  
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: 'var(--surface-hover)' }}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm" style={{ color: 'var(--text)' }}>{habit.name}</span>
                        {habit.streak > 0 && (
                          <span className="streak-badge">
                            <span>🔥</span>
                            <span>{habit.streak}</span>
                          </span>
                        )}
                      </div>
                      {!isFuture && (
                        <button
                          onClick={() => onCompleteHabit(habit.id)}
                          disabled={completed || isPast}
                          className={`btn btn-sm ${completed ? '' : isPast ? '' : 'btn-primary'}`}
                          style={completed ? { background: 'var(--success-bg)', color: 'var(--success)', cursor: 'default' } : isPast ? { background: 'var(--surface-active)', color: 'var(--text-muted)', cursor: 'default' } : {}}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {completed ? 'Done' : 'Complete'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
