import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import HabitTracker from './components/HabitTracker';
import DayView from './components/DayView';
import Auth from './components/Auth';
import Stats from './components/Stats';
import Pomodoro from './components/Pomodoro';
import { PomodoroProvider } from './contexts/PomodoroContext';
import PomodoroMini from './components/PomodoroMini';
import * as api from './api';
import { HomeIcon, ChartIcon, TomatoIcon } from './components/icons';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home'); 
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    setHabits([]);
  };
  
  const fetchData = async () => {
    try {
      const [tasksRes, habitsRes] = await Promise.all([
        api.getTasks(),
        api.getHabits()
      ]);
      setTasks(tasksRes.data);
      setHabits(habitsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
    setLoading(true);
    fetchData();
  };
  
  // ============== TASK HANDLERS ==============
  const handleAddTask = async (task) => {
    try {
      const res = await api.createTask(task);
      setTasks([...tasks, res.data]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const handleToggleTask = async (id, completed) => {
    try {
      const res = await api.updateTask(id, { completed });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  // ============== HABIT HANDLERS ==============
  const handleAddHabit = async (habit) => {
    try {
      const res = await api.createHabit(habit);
      setHabits([...habits, res.data]);
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };
  
  const handleCompleteHabit = async (id) => {
    try {
      const res = await api.completeHabit(id);
      setHabits(habits.map(h => h.id === id ? res.data : h));
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };
  
  const handleDeleteHabit = async (id) => {
    try {
      await api.deleteHabit(id);
      setHabits(habits.filter(h => h.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
        <p className="muted text-sm">Loading your workspace...</p>
      </div>
    );
  }
  
  // Show login/register if not authenticated
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }
  
  return (
    <PomodoroProvider>
    <div className="min-h-screen bg-surface" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="header-brand">
            <div className="logo">
              <img src="/bg.png" alt="Upward logo" className="logo-image" />
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>Upward</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Focus. Track. Improve.</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden sm:flex gap-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
            >
              <HomeIcon className="icon" size={16} />
              Home
            </button>
            <button
              onClick={() => setCurrentPage('stats')}
              className={`nav-btn ${currentPage === 'stats' ? 'active' : ''}`}
            >
              <ChartIcon className="icon" size={16} />
              Statistics
            </button>
            <button
              onClick={() => setCurrentPage('pomodoro')}
              className={`nav-btn ${currentPage === 'pomodoro' ? 'active' : ''}`}
            >
              <TomatoIcon className="icon" size={16} />
              Pomodoro
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <PomodoroMini onOpen={() => setCurrentPage('pomodoro')} />
            <div className="hidden sm:flex items-center gap-3">
              <div className="avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
              <div className="hidden md:block">
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{user.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
            >
              Sign out
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="sm:hidden flex border-t" style={{ borderColor: 'var(--border-light)' }}>
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
              currentPage === 'home'
                ? 'border-b-2'
                : ''
            }`}
            style={{ 
              color: currentPage === 'home' ? 'var(--primary)' : 'var(--text-muted)',
              borderColor: currentPage === 'home' ? 'var(--primary)' : 'transparent'
            }}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('stats')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
              currentPage === 'stats'
                ? 'border-b-2'
                : ''
            }`}
            style={{ 
              color: currentPage === 'stats' ? 'var(--primary)' : 'var(--text-muted)',
              borderColor: currentPage === 'stats' ? 'var(--primary)' : 'transparent'
            }}
          >
            Statistics
          </button>
          <button
            onClick={() => setCurrentPage('pomodoro')}
            className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
              currentPage === 'pomodoro'
                ? 'border-b-2'
                : ''
            }`}
            style={{ 
              color: currentPage === 'pomodoro' ? 'var(--primary)' : 'var(--text-muted)',
              borderColor: currentPage === 'pomodoro' ? 'var(--primary)' : 'transparent'
            }}
          >
            Pomodoro
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {currentPage === 'home' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <Calendar
                tasks={tasks}
                habits={habits}
                onDateClick={setSelectedDate}
                selectedDate={selectedDate}
              />
              <HabitTracker
                habits={habits}
                onAddHabit={handleAddHabit}
                onCompleteHabit={handleCompleteHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            </div>
            
            {/* Right column */}
            <div>
              <TodoList
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        ) : (
          currentPage === 'stats' ? (
            <Stats tasks={tasks} habits={habits} />
          ) : (
            <Pomodoro />
          )
        )}
      </main>
      
      {/* Day view modal */}
      {selectedDate && (
        <DayView
          selectedDate={selectedDate}
          tasks={tasks}
          habits={habits}
          onClose={() => setSelectedDate(null)}
          onToggleTask={handleToggleTask}
          onCompleteHabit={handleCompleteHabit}
        />
      )}
    </div>
    </PomodoroProvider>
  );
}

export default App;
