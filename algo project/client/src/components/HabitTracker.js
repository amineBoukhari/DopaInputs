import React, { useState } from 'react';
import dayjs from 'dayjs';

const HabitTracker = ({ habits, onAddHabit, onCompleteHabit, onDeleteHabit }) => {
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily', days: [] });
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    
    onAddHabit({
      name: newHabit.name,
      frequency: newHabit.frequency,
      days: newHabit.frequency === 'custom' ? newHabit.days : null,
      streak: 0
    });
    
    setNewHabit({ name: '', frequency: 'daily', days: [] });
    setShowForm(false);
  };
  
  const isCompletedToday = (habit) => {
    const today = dayjs().format('YYYY-MM-DD');
    return habit.lastCompletedDate === today;
  };
  
  const shouldShowHabitToday = (habit) => {
    if (Array.isArray(habit.days) && habit.days.length > 0) {
      const today = dayjs().day();
      return habit.days.includes(today);
    }
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekdays') {
      const today = dayjs().day();
      return today >= 1 && today <= 5; // Mon-Fri
    }
    return false;
  };
  
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Habits</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn btn-sm ${showForm ? 'btn-ghost' : 'btn-secondary'}`}
        >
          {showForm ? '× Cancel' : '+ New habit'}
        </button>
      </div>
      
      {/* Add habit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-5 rounded-xl" style={{ background: 'var(--surface-hover)', border: '1px solid var(--border-light)' }}>
          <input
            type="text"
            placeholder="Habit name (e.g., Morning run, Read 30 min)"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            className="input w-full mb-4"
          />
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { value: 'daily', label: 'Daily' },
              { value: 'weekdays', label: 'Weekdays' },
              { value: 'custom', label: 'Specific days' }
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={opt.value}
                  checked={newHabit.frequency === opt.value}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{opt.label}</span>
              </label>
            ))}
          </div>
          {newHabit.frequency === 'custom' && (
            <div className="mb-4 flex gap-2 flex-wrap">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    const days = newHabit.days.includes(i)
                      ? newHabit.days.filter(x => x !== i)
                      : [...newHabit.days, i];
                    setNewHabit({ ...newHabit, days });
                  }}
                  className={`btn btn-sm ${newHabit.days.includes(i) ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: 48 }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full">
            Create habit
          </button>
        </form>
      )}
      
      {/* Habit list */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="empty-state-title">No habits yet</p>
            <p className="empty-state-desc">Build consistency with daily habits</p>
          </div>
        ) : (
          habits.map(habit => {
            const completedToday = isCompletedToday(habit);
            const showToday = shouldShowHabitToday(habit);
            
            return (
              <div
                key={habit.id}
                className="p-4 rounded-xl card-hover"
                style={{ border: '1px solid var(--border-light)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium" style={{ color: 'var(--text)' }}>{habit.name}</h3>
                      {habit.streak > 0 && (
                        <span className="streak-badge">
                          <span>🔥</span>
                          <span>{habit.streak}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {Array.isArray(habit.days) && habit.days.length > 0
                        ? habit.days.sort().map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')
                        : (habit.frequency === 'daily' ? 'Every day' : 'Monday – Friday')
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showToday && (
                      <button
                        onClick={() => onCompleteHabit(habit.id)}
                        disabled={completedToday}
                        className={`btn btn-sm ${completedToday ? '' : 'btn-primary'}`}
                        style={completedToday ? { background: 'var(--success-bg)', color: 'var(--success)', cursor: 'default' } : {}}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {completedToday ? 'Done' : 'Complete'}
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--text-light)', padding: 6 }}
                      title="Delete"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
