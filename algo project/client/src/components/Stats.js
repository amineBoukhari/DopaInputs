import React, { useMemo } from 'react';
import { usePomodoro } from '../contexts/PomodoroContext';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Stats = ({ tasks, habits }) => {
  const { sessionHistory = [], completedSessions = 0, totalFocusedSeconds = 0 } = usePomodoro();

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const pendingTasks = totalTasks - completedTasks;
    
    const totalHabits = habits.length;
    const avgStreak = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
      : 0;
    const maxStreak = habits.length > 0
      ? Math.max(...habits.map(h => h.streak))
      : 0;
    
    // Completion rate
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;
    
    return {
      completedTasks,
      totalTasks,
      pendingTasks,
      totalHabits,
      avgStreak,
      maxStreak,
      completionRate
    };
  }, [tasks, habits]);


  const taskStatusData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'Pending', value: stats.pendingTasks, color: '#6b7280' }
  ];

  const habitStreakData = habits.map(habit => ({
    name: habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name,
    streak: habit.streak,
    frequency: habit.frequency
  }));

  const tasksOverTime = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      const completed = dayTasks.filter(t => t.completed).length;
      
      last7Days.push({
        date: date.format('MMM D'),
        completed,
        total: dayTasks.length,
        pending: dayTasks.length - completed
      });
    }
    return last7Days;
  }, [tasks]);

  const pomodoroOverTime = useMemo(() => {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const key = date.format('YYYY-MM-DD');
      const daySessions = sessionHistory.filter(s => dayjs(s.ts).format('YYYY-MM-DD') === key);
      last7.push({ date: date.format('MMM D'), sessions: daySessions.length, seconds: daySessions.reduce((a, b) => a + (b.duration || 0), 0) });
    }
    return last7;
  }, [sessionHistory]);

  const totalPomSessions = sessionHistory.length || completedSessions;
  const totalFocused = totalFocusedSeconds || sessionHistory.reduce((s, r) => s + (r.duration || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-text-muted text-sm mb-1">Total Tasks</div>
          <div className="text-3xl font-semibold text-text">{stats.totalTasks}</div>
        </div>
        
        <div className="card p-5">
          <div className="text-text-muted text-sm mb-1">Completion Rate</div>
          <div className="text-3xl font-semibold text-primary">{stats.completionRate}%</div>
        </div>
        
        <div className="card p-5">
          <div className="text-text-muted text-sm mb-1">Active Habits</div>
          <div className="text-3xl font-semibold text-text">{stats.totalHabits}</div>
        </div>
        
        <div className="card p-5">
          <div className="text-text-muted text-sm mb-1">Longest Streak</div>
          <div className="text-3xl font-semibold text-orange-600">🔥 {stats.maxStreak}</div>
        </div>
      </div>

        {/* Pomodoro Analytics */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Pomodoro Analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-surface rounded-lg">
              <div className="text-text-muted text-sm">Total Sessions</div>
              <div className="text-2xl font-semibold">{totalPomSessions}</div>
            </div>
            <div className="p-4 bg-surface rounded-lg">
              <div className="text-text-muted text-sm">Focused Time</div>
              <div className="text-2xl font-semibold">
                {Math.floor(totalFocused / 3600) > 0 ? `${Math.floor(totalFocused / 3600)}h ` : ''}{Math.floor((totalFocused % 3600) / 60)}m
              </div>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pomodoroOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === 'sessions' ? 'Sessions' : 'Seconds']} />
                <Bar dataKey="sessions" fill="#6366f1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Task Distribution</h3>
          {stats.totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
              No tasks yet
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Habit Streaks</h3>
          {habits.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={habitStreakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="streak" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
              No habits yet
            </div>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-text mb-4">Tasks Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tasksOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Completed"
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#6b7280" 
                strokeWidth={2}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Top Habits</h3>
          {habits.length > 0 ? (
            <div className="space-y-3">
              {[...habits]
                .sort((a, b) => b.streak - a.streak)
                .slice(0, 5)
                .map((habit, index) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-text-muted">#{index + 1}</span>
                      <span className="text-sm text-text">{habit.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-semibold">
                      <span>🔥</span>
                      <span>{habit.streak}</span>
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-text-muted text-sm">
              Start creating habits to track progress
            </div>
          )}
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Recently Completed</h3>
          {stats.completedTasks > 0 ? (
            <div className="space-y-3">
              {tasks
                .filter(t => t.completed)
                .slice(0, 5)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                    <span className="text-success text-lg">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text truncate">{task.title}</p>
                      {task.dueDate && (
                        <p className="text-xs text-text-muted">
                          {dayjs(task.dueDate).format('MMM D, YYYY')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-text-muted text-sm">
              Complete tasks to see them here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
