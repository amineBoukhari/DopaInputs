import React, { useState } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const Calendar = ({ tasks, habits, onDateClick, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const today = dayjs();
  const currentMonth = currentDate.month();
  const currentYear = currentDate.year();
  
  const firstDayOfMonth = dayjs().year(currentYear).month(currentMonth).date(1);
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const startDay = firstDayOfMonth.day(); // 0 = Sunday
  

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };
  
  const goToToday = () => {
    setCurrentDate(today);
  };
  
  const goToPreviousYear = () => {
    setCurrentDate(currentDate.subtract(1, 'year'));
  };
  
  const goToNextYear = () => {
    setCurrentDate(currentDate.add(1, 'year'));
  };
  
  const calendarDays = [];
  
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const hasEvents = (day) => {
    const dateStr = dayjs().year(currentYear).month(currentMonth).date(day).format('YYYY-MM-DD');
    
    const hasTasks = tasks.some(task => task.dueDate === dateStr);
    const hasHabits = habits.some(habit => {
      if (Array.isArray(habit.days) && habit.days.length > 0) {
        const dayOfWeek = dayjs(dateStr).day();
        return habit.days.includes(dayOfWeek);
      }
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekdays') {
        const dayOfWeek = dayjs(dateStr).day();
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      }
      return false;
    });
    
    return { hasTasks, hasHabits };
  };
  
  const getTaskCount = (day) => {
    const dateStr = dayjs().year(currentYear).month(currentMonth).date(day).format('YYYY-MM-DD');
    return tasks.filter(task => task.dueDate === dateStr).length;
  };
  

  const getWeekNumber = (day) => {
    const date = dayjs().year(currentYear).month(currentMonth).date(day);
    return date.week();
  };
  
  return (
    <div className="card p-6">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousYear}
            className="p-2 hover:bg-surface rounded-lg transition-all duration-200 text-text-muted hover:text-text"
            title="Previous year"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-text">
            {currentYear}
          </h3>
          <button
            onClick={goToNextYear}
            className="p-2 hover:bg-surface rounded-lg transition-all duration-200 text-text-muted hover:text-text"
            title="Next year"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-surface rounded-lg transition-all duration-200 text-text-muted hover:text-text"
            title="Previous month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-text">
            {firstDayOfMonth.format('MMMM')}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-surface rounded-lg transition-all duration-200 text-text-muted hover:text-text"
            title="Next month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 text-sm font-medium shadow-sm"
          >
            Today
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-1 mb-3">
        <div className="text-center text-xs font-semibold text-text-muted py-2">
          Wk
        </div>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: Math.ceil((startDay + daysInMonth) / 7) }).map((_, weekIndex) => {
          const weekStart = weekIndex * 7;
          const weekDays = calendarDays.slice(weekStart, weekStart + 7);
          const firstDayOfWeek = weekDays.find(d => d !== null);
          const weekNumber = firstDayOfWeek ? getWeekNumber(firstDayOfWeek) : null;

          return (
            <React.Fragment key={`week-${weekIndex}`}>
              <div className="aspect-square flex items-center justify-center text-xs text-text-muted font-semibold">
                {weekNumber}
              </div>

              {weekDays.map((day, dayIndex) => {
                if (!day) {
                  return <div key={`empty-${weekStart + dayIndex}`} className="aspect-square" />;
                }

                const dateStr = dayjs().year(currentYear).month(currentMonth).date(day).format('YYYY-MM-DD');
                const isToday = today.date() === day && today.month() === currentMonth && today.year() === currentYear;
                const isSelected = selectedDate === dateStr;
                const { hasTasks, hasHabits } = hasEvents(day);
                const taskCount = getTaskCount(day);

                return (
                  <button
                    key={`${currentYear}-${currentMonth}-${day}`}
                    onClick={() => onDateClick(dateStr)}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium
                      transition-all duration-200 relative
                      ${isToday 
                        ? 'bg-primary text-white shadow-md' 
                        : isSelected
                        ? 'bg-primary bg-opacity-10 text-primary ring-2 ring-primary ring-opacity-50'
                        : 'hover:bg-surface text-text'
                      }
                    `}
                  >
                    <span className="font-medium">{day}</span>

                    {taskCount > 0 && !isToday && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                        {taskCount}
                      </div>
                    )}

                    {(hasTasks || hasHabits) && !isToday && (
                      <div className="absolute bottom-1.5 flex gap-0.5">
                        {hasTasks && <span className="dot" style={{background: 'var(--primary)'}} />}
                        {hasHabits && <span className="dot" style={{background: '#fb923c'}} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
            <span>Habits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary rounded text-white text-[10px] flex items-center justify-center font-bold">
              {today.date()}
            </div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
