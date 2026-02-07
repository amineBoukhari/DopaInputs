import React, { useState } from 'react';
import dayjs from 'dayjs';

const TodoList = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });
  const [view, setView] = useState('today');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    onAddTask({
      title: newTask.title,
      dueDate: newTask.dueDate || null,
      completed: false
    });
    
    setNewTask({ title: '', dueDate: '' });
  };
  
  const filteredTasks = () => {
    const today = dayjs().format('YYYY-MM-DD');
    
    switch (view) {
      case 'today':
        return tasks.filter(task => !task.completed && task.dueDate === today);
      case 'upcoming':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  return (
    <div className="card" style={{ padding: 24 }}>
      <h2 className="section-title">Tasks</h2>
      <div className="tabs mb-6">
        {['today','upcoming','completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`tab ${view===tab ? 'active' : ''}`}
          >
            {tab === 'today' ? 'Today' : tab === 'upcoming' ? 'Upcoming' : 'Done'}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="input flex-1"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="input sm:w-auto"
            style={{ minWidth: 140 }}
          />
          <button
            type="submit"
            className="btn btn-primary whitespace-nowrap"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add task
          </button>
        </div>
      </form>
      
      <div className="space-y-2">
        {filteredTasks().length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11l3 3 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="empty-state-title">No tasks yet</p>
            <p className="empty-state-desc">Add a task above to get started</p>
          </div>
        ) : (
          filteredTasks().map(task => (
            <div
              key={task.id}
              className="group flex items-center gap-3 p-4 rounded-xl card-hover"
              style={{ border: '1px solid var(--border-light)' }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id, !task.completed)}
                className="checkbox"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ 
                  color: task.completed ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>
                    {dayjs(task.dueDate).format('MMM D, YYYY')}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100"
                style={{ color: 'var(--danger)', padding: '6px' }}
                title="Delete"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
